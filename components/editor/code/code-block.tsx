import "@fortawesome/fontawesome-free/css/all.min.css";

import { InlineContentSchema, StyleSchema } from "@blocknote/core";
import { ReactCustomBlockRenderProps } from "@blocknote/react";
import { langNames, langs } from "@uiw/codemirror-extensions-langs";
import { vscodeDarkInit } from "@uiw/codemirror-theme-vscode";
import { vscodeLightInit } from "@uiw/codemirror-theme-vscode";
import ReactCodeMirror from "@uiw/react-codemirror";
import clsx from "clsx";
import { Check, ChevronsDown, Play } from "lucide-react";
import { useTheme } from "next-themes";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { set } from "zod";

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
import { usePythonRunner } from "@/hooks/use-python-runner";
import { capitalizeFirstLetter, cn } from "@/lib/utils";

import { CodeBlockConfig } from ".";
import { RUNNABLE_LANGUAGES } from "./constants";

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
  const mplTargetRef = useRef<HTMLDivElement>(null);

  const [language, setLanguage] = useState<string>(
    block.props.language || "python"
  );

  const [stdout, setStdout] = useState<string>("");
  const [stderr, setStderr] = useState<string>("");
  const [hasRun, setHasRun] = useState(false);

  const stdoutHandler = useCallback(
    (msg: string) => setStdout((prev: string) => `${prev}\r\n${msg}`),
    []
  );
  const stderrHandler = useCallback(
    (msg: string) => setStderr((prev: string) => `${prev}\r\n${msg}`),
    []
  );

  const { runner, loaded } = usePythonRunner();

  const onInputChange = (val: string) => {
    editor.updateBlock(block.id, {
      props: {
        ...block.props,
        code: val,
      },
    });
  };

  const runCode = useCallback(async () => {
    if (!runner || !loaded) {
      toast.error("Hang on, the runner is still loading...");
      return;
    }

    setStdout("");
    setStderr("");

    runner.runPython(code, mplTargetRef, stdoutHandler, stderrHandler);

    setHasRun(true);
  }, [runner, loaded, code, stdoutHandler, stderrHandler]);

  useEffect(() => {
    if (!runner || !loaded) return;
    if (block.props.hasRun && !hasRun) {
      // this block was ran before saving,
      // so when rendering, we should run it again
      runCode().then(() => setHasRun(true));
    }
  }, [block.props.hasRun, hasRun, runner, loaded, runCode]);

  useEffect(() => {
    editor.updateBlock(block.id, {
      props: {
        ...block.props,
        language: language,
        hasRun: hasRun || block.props.hasRun,
      },
    });
  }, [language, hasRun, editor, block]);

  const { theme } = useTheme();
  const editorTheme =
    theme === "dark"
      ? vscodeDarkInit({
          settings: {
            caret: "#c6c6c6",
            fontFamily: "monospace",
          },
        })
      : vscodeLightInit({
          settings: {
            caret: "#000000",
            fontFamily: "monospace",
          },
        });

  const runnable = RUNNABLE_LANGUAGES.includes(language);

  return (
    <div className="w-full">
      <div className="flex text-sm p-2 bg-background rounded-t-lg justify-between">
        <LanguageDropdown language={language} onChange={setLanguage} />
        {runnable && (
          <Button size="icon" variant="ghost" onClick={runCode}>
            <Play size={16} />
          </Button>
        )}
      </div>
      <ReactCodeMirror
        id={block?.id}
        autoFocus
        placeholder={"Write your code here..."}
        style={{ width: "100%", resize: "vertical" }}
        //@ts-ignore
        extensions={[langs[language]()]}
        value={code}
        theme={editorTheme}
        editable={editor.isEditable}
        width="100%"
        height="200px"
        onChange={onInputChange}
      />
      <div>
        {stdout && (
          <div className="font-mono p-4 bg-background rounded-b-lg">
            {stdout.split("\n").map((line, index) => (
              <div key={index}>{line}</div>
            ))}
          </div>
        )}
        {stderr && (
          <div className="font-mono text-red-500 p-4 bg-background rounded-b-lg">
            {stderr.split("\n").map((line, index) => (
              <div key={index}>{line}</div>
            ))}
          </div>
        )}
      </div>
      <div
        ref={mplTargetRef}
        className={clsx(
          "w-full",
          hasRun && code.includes("matplotlib") ? "block" : "hidden"
        )}
      />
    </div>
  );
};
