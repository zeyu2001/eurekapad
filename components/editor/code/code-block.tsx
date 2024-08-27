import "@fortawesome/fontawesome-free/css/all.min.css";

import { InlineContentSchema, StyleSchema } from "@blocknote/core";
import { ReactCustomBlockRenderProps } from "@blocknote/react";
import { langNames, langs } from "@uiw/codemirror-extensions-langs";
import { vscodeDarkInit, vscodeLightInit } from "@uiw/codemirror-theme-vscode";
import ReactCodeMirror from "@uiw/react-codemirror";
import clsx from "clsx";
import { useAction } from "convex/react";
import { Check, ChevronsDown, CircleAlert, Delete, Play } from "lucide-react";
import { useTheme } from "next-themes";
import { FC, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { CodeBlockConfig } from "@/components/editor/code";
import { RUNNABLE_LANGUAGES } from "@/components/editor/code/constants";
import { Images, imagesJSONSchema } from "@/components/editor/code/schemas";
import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { api } from "@/convex/_generated/api";
import { useEditorContext } from "@/hooks/use-editor-context";
import { usePythonRunner } from "@/hooks/use-python-runner";
import { upload } from "@/lib/client-uploads";
import { ansiToSpans, capitalizeFirstLetter, cn } from "@/lib/utils";

const LanguageDropdown = ({
  language,
  onChange,
}: Readonly<{
  language: string;
  onChange: (lang: string) => void;
}>) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(language);

  const languages = langNames.map((lang) => ({
    key: lang.toLowerCase(),
    value: lang,
  }));

  const onSelect = (selected: string) => {
    const value = languages.find((lang) => lang.key === selected)?.value;
    if (!value) return;
    setValue(value);
    onChange(value);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {capitalizeFirstLetter(value) || "Select language..."}
          <ChevronsDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command className="max-h-64">
          <CommandInput placeholder="Search framework..." />
          <CommandEmpty>No language found.</CommandEmpty>
          <ScrollArea className="overflow-auto">
            <CommandGroup>
              {languages.map((lang) => (
                <CommandItem
                  key={lang.key}
                  value={lang.value}
                  onSelect={onSelect}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === lang.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {capitalizeFirstLetter(lang.value)}
                </CommandItem>
              ))}
            </CommandGroup>
          </ScrollArea>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export const CodeBlock: FC<
  ReactCustomBlockRenderProps<CodeBlockConfig, InlineContentSchema, StyleSchema>
> = ({ block, editor, contentRef }) => {
  const code = block.props.code || "";

  const language = block.props.language || "python";

  const [stdout, setStdout] = useState<string>(block.props.stdout || "");
  const [stderr, setStderr] = useState<string>(block.props.stderr || "");
  const [images, setImages] = useState<Images>(
    imagesJSONSchema.parse(block.props.images)
  );
  const [isRunning, setIsRunning] = useState(false);
  const [isProcessingMedia, setIsProcessingMedia] = useState(false);

  const editorContext = useEditorContext();

  const getUploadUrl = useAction(api.uploads.getUploadUrl);

  const stdoutHandler = useCallback(
    (msg: string) => setStdout((prev: string) => `${prev}\n${msg}`.trim()),
    []
  );

  const stderrHandler = useCallback(
    (msg: string) => setStderr((prev: string) => `${prev}\n${msg}`.trim()),
    []
  );

  const imageHandler = useCallback(
    (format: string, b64Data: string) => {
      const toURL = async (format: string, b64Data: string) => {
        const dataUrl = `data:${format};base64,${b64Data}`;

        if (!editorContext.authenticated || !editorContext.savable) {
          return new URL(dataUrl);
        }

        const response = await fetch(dataUrl);
        const blob = await response.blob();
        const file = new File([blob], "image.png", { type: blob.type });

        const uploadUrl = await getUploadUrl({});
        const azBlobUrl = await upload(file, uploadUrl);

        return azBlobUrl;
      };

      setIsProcessingMedia(true);
      toURL(format, b64Data).then((url) => {
        setIsProcessingMedia(false);
        if (!url) {
          toast.error("Failed to upload media.");
          return;
        }
        setImages((prev) => [...prev, url]);
      });
    },
    [getUploadUrl, editorContext]
  );

  const { runner, loaded } = usePythonRunner();

  const handleInputChange = ({
    code,
    language,
  }: {
    code?: string;
    language?: string;
  }) => {
    editor.updateBlock(block.id, {
      props: {
        ...block.props,
        language: language ?? block.props.language,
        code: code ?? block.props.code,
      },
    });
  };

  const runCode = useCallback(async () => {
    if (!runner || !loaded) {
      toast.error("Hang tight, Python kernel is still getting ready...");
      return;
    }

    setStdout("");
    setStderr("");
    setImages([]);

    setIsRunning(true);

    await runner.runPython(code, stdoutHandler, stderrHandler, imageHandler);

    setIsRunning(false);
  }, [runner, loaded, code, stdoutHandler, stderrHandler, imageHandler]);

  useEffect(() => {
    editor.updateBlock(block.id, {
      props: {
        ...block.props,
        stdout: stdout,
        stderr: stderr,
        images: JSON.stringify(images),
      },
    });
  }, [stdout, stderr, images, editor, block.id, block.props]);

  const { theme } = useTheme();
  const editorTheme =
    theme === "light"
      ? vscodeLightInit({
          settings: {
            caret: "#000000",
            fontFamily: "monospace",
          },
        })
      : vscodeDarkInit({
          settings: {
            caret: "#c6c6c6",
            fontFamily: "monospace",
          },
        });

  const runnable = RUNNABLE_LANGUAGES.includes(language);

  return (
    <div className="w-full">
      <div className="flex text-sm p-2 bg-background rounded-t-lg justify-between">
        <LanguageDropdown
          language={language}
          onChange={(lang) => handleInputChange({ language: lang })}
        />
        {runnable && (
          <div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="ghost" onClick={runCode}>
                  {isRunning ? <Spinner /> : <Play size={16} />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Run code</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => {
                    setStdout("");
                    setStderr("");
                    setImages([]);
                  }}
                >
                  <Delete size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Clear output</TooltipContent>
            </Tooltip>
          </div>
        )}
      </div>
      <ReactCodeMirror
        id={block?.id}
        placeholder={"Write your code here..."}
        style={{ width: "100%", resize: "vertical" }}
        //@ts-ignore
        extensions={[langs[language]()]}
        value={code}
        theme={editorTheme}
        editable={editor.isEditable}
        width="100%"
        height="200px"
        onChange={(value) => handleInputChange({ code: value })}
      />
      <div>
        {stdout && (
          <div
            className={clsx(
              "font-mono p-4 bg-background border-green-600 border-l-4",
              stderr || "rounded-b-lg"
            )}
          >
            {stdout.split("\n").map((line, index) => (
              <div key={index}>{ansiToSpans(line)}</div>
            ))}
          </div>
        )}
        {stderr && (
          <div className="font-mono p-4 bg-background rounded-b-lg border-red-600 border-l-4">
            {stderr.split("\n").map((line, index) => (
              <div key={index}>
                {index === 0 && (
                  <CircleAlert className="mr-4 my-2 inline-block text-red-600" />
                )}
                {ansiToSpans(line)}
              </div>
            ))}
          </div>
        )}
      </div>
      <div
        className={clsx(
          "w-full place-items-center grid",
          images.length >= 2 ? "grid-cols-2" : "grid-cols-1",
          isProcessingMedia && "h-64"
        )}
      >
        {isProcessingMedia ? (
          <Spinner />
        ) : (
          images.map((url, index) => (
            <img key={index} src={url.href} alt="Image output" />
          ))
        )}
      </div>
    </div>
  );
};
