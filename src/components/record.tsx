import React, { useEffect } from "react";
import appState from "../../store/Appstate.ts";
import { observer } from "mobx-react-lite";
import MicButton from "../components/microphone.tsx";

const SpeechToText: React.FC = observer(() => {
  const isListening = appState.isListening;
  const isTaskModalVisible = appState.isTaskModalVisible;
  const [text, setText] = React.useState("");

  useEffect(() => {
    let recognition: any;

    if ("webkitSpeechRecognition" in window) {
      recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "ru-RU";

      recognition.onstart = () => {
        console.log(
          "Voice recognition started. Try speaking into the microphone."
        );
      };

      recognition.onspeechend = () => {
        console.log("Speech has stopped.");
        recognition.stop();
        appState.setIsListening(false);
      };

      recognition.onresult = (event: any) => {
        let interimTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            setText(event.results[i][0].transcript);
          } else {
            interimTranscript += event.results[i][0].transcript;
            setText(interimTranscript);
          }
        }
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        appState.setIsListening(false);
      };
    } else {
      console.error("Speech recognition is not supported in this browser.");
    }

    if (isListening && isTaskModalVisible && recognition) {
      recognition.start();
    } else if (recognition) {
      appState.setIsListening(false);
      console.log("Stop listening close");
      recognition.stop();
    }

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [isListening]);

  // const handleListen = () => {
  //   appState.setIsListening(!isListening);
  // };

  return (
    <div>
      {/* <button onClick={handleListen}>
    {isListening ? "Stop Listening" : "Start Listening"}
    </button> */}
      <MicButton stopAnimation={!isListening} />
      <p>{text}</p>
    </div>
  );
});

export default SpeechToText;
