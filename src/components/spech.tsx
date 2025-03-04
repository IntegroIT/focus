import React, { useEffect, useRef, useState } from "react";

interface SpeechRecognitionComponentProps {
  onTranscriptChange: (text: string) => void;
  onStopListening: () => void;
  isListening: boolean;
}

const SpeechRecognitionComponent: React.FC<SpeechRecognitionComponentProps> = ({
  onTranscriptChange,
  onStopListening,
  isListening,
}) => {
  const recognitionRef = useRef<any>(null);
  const [fullTranscript, setFullTranscript] = useState("");

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "ru-RU";

      recognition.onresult = (event: any) => {
        let currentTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setFullTranscript((prev) => prev + currentTranscript);
        onTranscriptChange(fullTranscript + currentTranscript);
      };

      recognition.onend = () => {
        console.log("Recognition ended.");
        if (isListening) {
          console.log("Restarting recognition...");
          recognition.start();
        } else {
          onStopListening();
        }
      };

      recognition.onerror = (event: any) => {
        console.error("Recognition error:", event.error);
        if (event.error === "no-speech") {
          recognition.stop();
        }
      };

      recognitionRef.current = recognition;
    } else {
      console.error("Speech Recognition API not supported.");
    }

    return () => {
      if (recognitionRef.current) {
        console.log("Stopping recognition...");
        recognitionRef.current.stop();
      }
    };
  }, [onTranscriptChange, onStopListening]);

  useEffect(() => {
    if (!recognitionRef.current) return;

    if (isListening) {
      console.log("Starting recognition...");
      recognitionRef.current.start();
    } else {
      console.log("Stopping recognition...");
      recognitionRef.current.stop();
    }
  }, [isListening]);

  return null;
};

export default SpeechRecognitionComponent;
