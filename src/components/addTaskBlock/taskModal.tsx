// import React from "react";
import { useSwipeable } from "react-swipeable";
import appState from "../../../store/Appstate.ts";
import { observer } from "mobx-react-lite";
import Calendar from "../calendar.tsx";
import ArrowBack from "@mui/icons-material/ArrowBackIosNewTwoTone";
import AddCategory from "./addCategory.tsx";
import EmojiPicker from "./addEmodziBlock.tsx";
import RepeatCustom from "./repeatCustum.tsx";
import AddTags from "./addTags.tsx";
import Note from "../../components/Note";
import Clear from "./addClear.tsx";
import Alert from "../notification.tsx";
import AddParent from "./addParent.tsx";

import SpeechToText from "../record.tsx";

const TaskModal = observer(() => {
  console.log("isTaskModalVisible", appState.isTaskModalVisible);
  let isTaskModalVisible = appState.isTaskModalVisible;
  const taskModalName = appState.taskModalName;
  const taskModalContent = appState.taskModalContent;

  if (taskModalContent == "clear") {
    isTaskModalVisible = false;
  }

  const taskModalstyle = {
    transform: isTaskModalVisible ? "translateY(0)" : "translateY(100%)",
  };

  const fonStyle = {
    display: isTaskModalVisible ? "block" : "none",
  };

  // Обработчик свайпа вниз
  const handlers = useSwipeable({
    onSwipedDown: () => appState.hideTaskModal(),
    trackMouse: true, // Отслеживание свайпа мышью
  });

  const isNote = {
    height: taskModalContent == "note" ? "100%" : "auto",
  };

  return (
    <>
      <div
        onClick={() => {
          appState.hideTaskModal();
          appState.setFocusOnInput();
        }}
        style={fonStyle}
        className="fon fixed top-0 left-0 right-0 bottom-0 w-full h-full"
      ></div>
      <div
        {...handlers} // Добавляем обработчики свайпа
        style={{ ...taskModalstyle, ...isNote }}
        className="taskModal"
      >
        <div className="line__before"></div>
        <div id="modalName" className="flex items-center pb-2">
          <ArrowBack
            fontSize="small"
            onClick={() => {
              appState.hideTaskModal();
              appState.setFocusOnInput();
            }}
          />
          <span className="ml-4 text-lg font-bold">{taskModalName}</span>
        </div>
        {taskModalContent == "emodji" && <EmojiPicker />}
        {taskModalContent == "categories" && <AddCategory />}
        {taskModalContent == "calendar" && <Calendar />}
        {taskModalContent == "repeat" && <RepeatCustom />}
        {taskModalContent == "tags" && <AddTags />}
        {taskModalContent == "clear" && <Clear />}
        {taskModalContent == "pomodoro" && <Alert />}
        {taskModalContent == "lists" && <AddParent />}
        {taskModalContent == "microphone" && <SpeechToText />}
        {taskModalContent == "note" && <Note />}
      </div>
    </>
  );
});

export default TaskModal;
