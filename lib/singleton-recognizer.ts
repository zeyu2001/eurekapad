import { SpeechRecognizer } from "microsoft-cognitiveservices-speech-sdk";

export class SingletonSpeechRecognizer {
  private static recognizer: SingletonSpeechRecognizer;

  private constructor(speechConfig, audioConfig) {
    this.recognizer = new SpeechRecognizer(speechConfig, audioConfig);
  }

  public static getInstance(speechConfig, audioConfig) {
    if (!this.recognizer) {
      this.recognizer = new SingletonSpeechRecognizer(
        speechConfig,
        audioConfig
      );
    }
    return this.recognizer;
  }

  public setRecognizingHandler(handler) {
    this.recognizer.recognizing = handler;
  }

  public setRecognizedHandler(handler) {
    this.recognizer.recognized = handler;
  }

  public setCanceledHandler(handler) {
    this.recognizer.canceled = handler;
  }

  public setSessionStoppedHandler(handler) {
    this.recognizer.sessionStopped = handler;
  }

  public startListening() {
    this.recognizer.startContinuousRecognitionAsync();
  }

  public stopListening() {
    this.recognizer.stopContinuousRecognitionAsync();
  }
}
