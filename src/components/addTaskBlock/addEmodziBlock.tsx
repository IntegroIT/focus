import { useState } from "react";
import Recent from "@mui/icons-material/ScheduleRounded";
import appState from "../../../store/Appstate.ts";

function EmojiPicker() {
  // const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [selectedBlock, setSelectedBlock] = useState(0);
  const [isEmojiClicked, setIsEmojiClicked] = useState(-1);

  const emojiBlocks = [
    [
      "🔥",
      "❤️",
      "😍",
      "🐸",
      "⭐️",
      "👩‍💻",
      "🤡",
      "💩",
      "😢",
      "😡",
      "❗️",
      "💪",
      "👑",
      "☀️",
      "🍽",
      "🍅",
      "🍌",
      "☕️",
      "🍎",
      "🍺",
    ],
    ["🤣", "😃", "😄", "😅"],
    ["😆", "😉", "😊", "😋"],
  ];

  const blockComponents = [
    <Recent />,
    <span>Блок 2</span>,
    <span>Блок 55</span>,
  ];

  const handleEmojiClick = (emoji: any, index: number) => {
    if (appState.isNoteVisible) {
      let getEmoji = appState.mainTask.emodji;
      if (getEmoji == emoji) {
        appState.updateTaskValue(appState.mainTask.id, "emodji", "");
        setIsEmojiClicked(-1);
      } else {
        appState.updateTaskValue(appState.mainTask.id, "emodji", emoji);
        setIsEmojiClicked(index);
      }
    } else {
      let getEmoji = appState.taskData.emodji;
      if (getEmoji == emoji) {
        appState.setTaskData("emodji", "");
        setIsEmojiClicked(-1);
      } else {
        appState.setTaskData("emodji", emoji);
        setIsEmojiClicked(index);
      }
    }
    // setSelectedEmoji(emoji);

    appState.hideTaskModal();
    appState.setFocusOnInput();
  };

  const handleBlockClick = (index: number) => {
    setSelectedBlock(index);
  };

  return (
    <div>
      {/* Меню выбора блока */}
      <div>
        {emojiBlocks.map((_, index) => (
          <button
            key={"emoblock" + index}
            onClick={() => handleBlockClick(index)}
          >
            {blockComponents[index]}
          </button>
        ))}
      </div>

      {/* Отображение эмодзи из выбранного блока */}
      <div>
        {emojiBlocks[selectedBlock].map((emoji, index) => (
          <button
            className="w-1/6 bg-slate-800 p-2 m-1 box-content relative"
            key={"emoji" + index}
            style={{
              backgroundColor:
                isEmojiClicked === index ? "rgb(64, 76, 96)" : "",
            }}
            // trim() удаляет пробелы в начале и конце строки
            onClick={() => handleEmojiClick(emoji, index)}
          >
            {isEmojiClicked === index && (
              <div className="w-1/6 absolute top-0 right-1 rotate-45 opacity-30">
                +
              </div>
            )}
            {emoji}
          </button>
        ))}
      </div>

      {/* {selectedEmoji && <span>{selectedEmoji}</span>} */}
    </div>
  );
}

export default EmojiPicker;
