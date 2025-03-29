import React, { useRef, useState, useEffect } from "react";
import { useObserver } from "mobx-react-lite";
import appState from "../../../store/Appstate.ts";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import OfflineBoltTwoToneIcon from "@mui/icons-material/OfflineBoltTwoTone";
import WidgetsRoundedIcon from "@mui/icons-material/WidgetsRounded";
// import Tags from "@mui/icons-material/LocalOfferRounded";
// import Tags from "@mui/icons-material/LabelImportantOutlined";
import Tags from "@mui/icons-material/LabelOutlined";
import List from "@mui/icons-material/FormatListBulletedRounded";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import LoopRoundedIcon from "@mui/icons-material/LoopRounded";
import Send from "@mui/icons-material/SendRounded";
import ShutterSpeedRoundedIcon from "@mui/icons-material/ShutterSpeedRounded";
import AddReactionTwoToneIcon from "@mui/icons-material/AddReactionTwoTone";
import LaunchRoundedIcon from "@mui/icons-material/LaunchRounded";
import Mic from "@mui/icons-material/MicNoneRounded";
import { yellow } from "@mui/material/colors";
// import { useKeyboardHeight } from "../useKeyboardHeight";
// import SpeechRecognitionComponent from "../../components/spech.tsx"; // Импортируем компонент записи

const AddTask = () => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const inputValue = inputRef.current?.value;
  const [isFast, setIsFast] = useState(appState.taskData.isFast);
  const [isSetData, setIsSetData] = useState(false);
  const [textareaHeight, setTextareaHeight] = useState(24);
  // const keyboardHeight = useKeyboardHeight();

  // const [isListening, setIsListening] = useState(false); // Состояние записи
  // const [transcript, setTranscript] = useState(""); // Текст из распознавания речи

  // Обработчик для обновления текста в textarea
  // useEffect(() => {
  //   if (inputRef.current) {
  //     inputRef.current.value = transcript;
  //     setTextareaHeight(inputRef.current.scrollHeight); // Обновляем высоту textarea
  //   }
  // }, [transcript]);

  // Устанавливаем фокус на textarea при монтировании компонента
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      console.log("focus");
    }
  }, []);

  const handleMicrophoneClick = () => {
    // setIsListening((prev) => !prev); // Переключаем состояние записи
    appState.showTaskModal("microphone");
    appState.setIsListening(true);
  };

  // Обработчик для изменения высоты textarea
  const handleTextareaInput = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    if (event.target.scrollHeight > 0) {
      setTextareaHeight(event.target.scrollHeight);
    }
  };

  const handleClick = () => {
    setIsFast(false);
    let value = (inputRef.current as HTMLTextAreaElement).value;
    if (value == "") {
      return;
    }
    appState.setTaskData("title", value);
    appState.setTaskData("id", String(Date.now()));
    appState.setTaskData("type", "task");
    appState.addTask();
    appState.taskData = {};
    appState.refreshTags();
    appState.showTaskModal("clear");
    setTextareaHeight(24);
    (inputRef.current as HTMLTextAreaElement).value = "";
    (inputRef.current as HTMLTextAreaElement).focus();
  };

  const handleFast = () => {
    appState.setTaskData("isFast", !isFast);
    setIsFast(!isFast);
  };

  const handleFocus = () => {
    setTimeout(() => {
      window.scrollBy({ top: document.body.scrollHeight, behavior: "smooth" });
    }, 2000);
  };

  const fonStyle = {
    display: appState.isAddTaskModalVisible ? "block" : "none",
  };

  return useObserver(() => (
    <>
      <div
        onClick={() => {
          appState.toggleAddTaskModal();
          appState.taskData = {};
          setIsFast(false);
          setIsSetData(false);
          appState.setFocusOnInput();
          appState.setIsNewTask(false);
        }}
        style={fonStyle}
        className="fon fixed top-0 left-0 right-0 bottom-0 w-full h-full"
      ></div>
      <div
        style={
          appState.isAddTaskModalVisible
            ? { display: "block", bottom: appState.bottomPosition + "px" }
            : { display: "none" }
        }
        className="addDataTask fixed bottom-0 w-full left-0 z-50"
      >
        <div
          className="flex items-center h-10 box-content pl-4 pr-4 pt-2 bg-slate-800"
          style={{
            borderLeft: appState.taskData.color
              ? "3px solid " + appState.taskData.color
              : "",
            height: textareaHeight === 0 ? "40px" : `${textareaHeight + 16}px`,
          }}
        >
          {!appState.taskData.emodji && (
            <AddReactionTwoToneIcon
              onClick={() => appState.showTaskModal("emodji")}
            />
          )}
          {appState.taskData.emodji && (
            <div
              className="cursor-pointer w-8 h-8 text-lg"
              onClick={() => appState.showTaskModal("emodji")}
            >
              {appState.taskData.emodji}
            </div>
          )}
          <textarea
            style={{
              resize: "none",
              width: "100%",
              height: textareaHeight === 0 ? "24px" : `${textareaHeight}px`,
              outline: "none",
            }}
            autoComplete="off"
            onChange={() => setIsSetData(true)}
            onInput={handleTextareaInput}
            ref={inputRef}
            onFocus={handleFocus}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleClick();
              }
            }}
            id="addTaskInput"
            placeholder="Добавьте задачу"
            className="w-full pl-4 outline-none bg-slate-800"
          />
          <LaunchRoundedIcon color="primary" />
        </div>
        <div className="taskSetData h-16 bg-slate-950 flex items-center justify-between p-4">
          <div className="flex gap-3">
            <WidgetsRoundedIcon
              onClick={() => appState.showTaskModal("categories")}
            />
            <CalendarMonthRoundedIcon
              color="primary"
              onClick={() => appState.showTaskModal("calendar")}
            />
            <NotificationsNoneRoundedIcon
              onClick={() => appState.showTaskModal("alerts")}
            />
            <LoopRoundedIcon onClick={() => appState.showTaskModal("repeat")} />
            <Tags onClick={() => appState.showTaskModal("tags")} />
            <ShutterSpeedRoundedIcon
              onClick={() => appState.showTaskModal("pomodoro")}
            />
            {!appState.isNoteVisible && (
              <List
                color="primary"
                onClick={() => appState.showTaskModal("lists")}
              />
            )}
          </div>
          <div className="flex gap-3">
            <OfflineBoltTwoToneIcon
              onClick={() => {
                handleFast();
                appState.setFocusOnInput();
              }}
              style={{ color: isFast ? yellow[500] : "" }}
            />
            {inputValue != "" || isSetData ? (
              <Send onClick={handleClick} />
            ) : (
              <Mic
                onClick={handleMicrophoneClick} // Переключаем состояние записи
                // style={{ color: isListening ? yellow[500] : "" }} // Подсветка микрофона при записи
              />
            )}
          </div>
        </div>
      </div>
      {/* Компонент записи речи */}
      {/* // Внутри вашего компонента AddTask */}
      {/* <SpeechRecognitionComponent
      onTranscriptChange={(text) => {
      setTranscript((prev) => prev + text); // Накапливаем текст
      }}
      onStopListening={() => setIsListening(false)}
      isListening={isListening}
      /> */}
    </>
  ));
};

export default AddTask;
