import { InlineContentSchema, StyleSchema } from "@blocknote/core";
import { ReactCustomBlockRenderProps } from "@blocknote/react";
import {
  AudioConfig,
  ResultReason,
  SpeechConfig,
  SpeechRecognizer,
} from "microsoft-cognitiveservices-speech-sdk";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import { AiOutlineAudio } from "react-icons/ai";
import { FaMagic, FaRegStopCircle } from "react-icons/fa";

import { type TranscriptionBlockConfig } from "@/components/editor/transcription";
import { Spinner } from "@/components/spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSpeechToken } from "@/hooks/use-speech-token";

const TranscriptionComponent = ({
  token,
  region,
  contentRef,
}: {
  token: string;
  region: string;
  contentRef: HTMLElement | null;
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);

  const speechConfig = SpeechConfig.fromAuthorizationToken(token, region);
  speechConfig.speechRecognitionLanguage = "en-US";

  const audioConfig = AudioConfig.fromDefaultMicrophoneInput();

  const handleRecognizing = (e) => {
    console.log("Recognizing:", e.result.text);
  };

  const handleRecognized = async (e) => {
    console.log("Recognized:", e.result.text);
  };

  const recognizerRef = useRef<SpeechRecognizer>(null);

  const handleListen = useCallback(() => {
    let recognizer = recognizerRef.current;

    if (isListening) {
      recognizer = new SpeechRecognizer(speechConfig, audioConfig);
      recognizer.startContinuousRecognitionAsync();

      recognizer.recognizing = (s, e) => {
        console.log("Recognizing:", e.result.text);
        handleRecognizing(e);
      };

      recognizer.recognized = async (s, e) => {
        if (e.result.reason == ResultReason.RecognizedSpeech) {
          console.log("Recognized:", e.result.text);
          handleRecognized(e);
        } else if (e.result.reason == ResultReason.NoMatch) {
          console.log("NOMATCH: Speech could not be recognized.");
        }
      };

      recognizer.canceled = (s, e) => {
        console.log(`CANCELED: Reason=${e.reason}`);

        if (e.reason == sdk.CancellationReason.Error) {
          console.log(`"CANCELED: ErrorCode=${e.errorCode}`);
          console.log(`"CANCELED: ErrorDetails=${e.errorDetails}`);
          console.log(
            "CANCELED: Did you set the speech resource key and region values?"
          );
        }

        recognizer.stopContinuousRecognitionAsync();
        setIsListening(false);
      };

      recognizer.sessionStopped = (s, e) => {
        console.log("\n    Session stopped event.");
        recognizer.stopContinuousRecognitionAsync();
        setIsListening(false);
      };
    } else {
      recognizer?.close();
    }
  }, [isListening, speechConfig, audioConfig]);

  useEffect(() => {
    handleListen();
  }, [isListening, handleListen]);

  return (
    <>
      <Alert>
        <div className="flex items-center justify-between">
          <Button
            className="mb-4"
            variant="outline"
            size="icon"
            onClick={() => setIsListening((l) => !l)}
          >
            <Tooltip>
              <TooltipTrigger>
                {isListening ? (
                  <FaRegStopCircle color="red" className="h-4 w-4" />
                ) : (
                  <AiOutlineAudio className="h-4 w-4" />
                )}
              </TooltipTrigger>
              <TooltipContent>
                {isListening ? "Stop recording" : "Start recording"}
              </TooltipContent>
            </Tooltip>
          </Button>
          <Button
            className="mb-4"
            variant="outline"
            onClick={() => setOpen((o) => !o)}
          >
            <FaMagic className="mr-2" /> Summary
          </Button>
        </div>
        <AlertDescription className="w-full max-h-52 overflow-y-scroll my-4">
          <div ref={contentRef}></div>
        </AlertDescription>
      </Alert>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-full sm:w-1/2 sm:max-w-full z-[99999]">
          <SheetHeader>
            <SheetTitle>Transcription</SheetTitle>
            <SheetDescription>
              Make changes to your profile here.
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-4">this will be the summary</div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export const TranscriptionBlock: FC<
  ReactCustomBlockRenderProps<
    TranscriptionBlockConfig,
    InlineContentSchema,
    StyleSchema
  >
> = ({ block, editor, contentRef }) => {
  const { token, region } = useSpeechToken();

  if (!token || !region) {
    return (
      <div className="flex items-center h-32 w-full justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <TranscriptionComponent
      token={token}
      region={region}
      contentRef={contentRef}
    />
  );
};
