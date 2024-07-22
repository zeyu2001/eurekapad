import {
  AudioConfig,
  Recognizer,
  SessionEventArgs,
  SpeechConfig,
  SpeechRecognitionCanceledEventArgs,
  SpeechRecognitionEventArgs,
  SpeechRecognizer,
} from "microsoft-cognitiveservices-speech-sdk";

type RecognizerEventHandler = (
  s: Recognizer,
  e: SpeechRecognitionEventArgs
) => void;

type RecognizerCanceledEventHandler = (
  s: Recognizer,
  e: SpeechRecognitionCanceledEventArgs
) => void;

type RecognizerSessionStoppedEventHandler = (
  s: Recognizer,
  e: SessionEventArgs
) => void;

export class SingletonSpeechRecognizer {
  private static instance: SingletonSpeechRecognizer;
  private recognizer: SpeechRecognizer;

  private constructor(speechConfig: SpeechConfig, audioConfig: AudioConfig) {
    this.recognizer = new SpeechRecognizer(speechConfig, audioConfig);
  }

  public static getInstance(
    speechConfig: SpeechConfig,
    audioConfig: AudioConfig
  ) {
    if (!SingletonSpeechRecognizer.instance) {
      SingletonSpeechRecognizer.instance = new SingletonSpeechRecognizer(
        speechConfig,
        audioConfig
      );
    }
    return SingletonSpeechRecognizer.instance;
  }

  public setRecognizingHandler(handler: RecognizerEventHandler) {
    this.recognizer.recognizing = handler;
  }

  public setRecognizedHandler(handler: RecognizerEventHandler) {
    this.recognizer.recognized = handler;
  }

  public setCanceledHandler(handler: RecognizerCanceledEventHandler) {
    this.recognizer.canceled = handler;
  }

  public setSessionStoppedHandler(
    handler: RecognizerSessionStoppedEventHandler
  ) {
    this.recognizer.sessionStopped = handler;
  }

  public startListening() {
    this.recognizer.startContinuousRecognitionAsync();
  }

  public stopListening() {
    this.recognizer.stopContinuousRecognitionAsync();
  }
}
