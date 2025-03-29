import appState from "../../../store/Appstate.ts";
import Tag from "./tag.tsx";
import { observer } from "mobx-react-lite"; // импортируем observer
import { useState, useEffect } from "react";

const AddTags: any = observer(() => {
  const [inputValue, setInputValue] = useState("");
  const tagsObj = appState.tags;
  // appState.refreshTags();

  useEffect(() => {
    appState.refreshTags();
    if (appState.isNoteVisible && !appState.isNewTask) {
      const mainTaskTags = appState.mainTask.tags || [];
      mainTaskTags.forEach((tag: String) => {
        tagsObj[tag as keyof typeof tagsObj] = true;
      });
      appState.tags = tagsObj;
      console.log("tagsObj:", tagsObj);
    }
  }, [appState.mainTask.tags, appState.isNoteVisible]);

  const tags = Object.keys(tagsObj); // appState.tags

  // appState.isNoteVisible && {

  // }

  return (
    <div className="addTags">
      <input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        type="text"
        className="w-full h-5 mt-2 mb-2 pb-4 pt-4 border-b-2 bg-transparent focus:outline-none focus:ring-0"
      />
      {inputValue.length >= 2 && !tags.includes(inputValue) && (
        <button
          onClick={() => {
            appState.addTag(inputValue);
            const tags = appState.taskData.tags || [];
            tags.push(inputValue);
            appState.setTaskData("tags", tags);
            setInputValue(""); // Очищаем ввод после добавления тега
          }}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Добавить
        </button>
      )}
      {inputValue.length >= 2 &&
      tags.filter((tag: string) =>
        tag.toLowerCase().includes(inputValue.toLowerCase())
      ).length === 0 ? (
        <div></div>
      ) : tags.length > 0 ? (
        tags
          .filter((tag: string) =>
            tag.toLowerCase().includes(inputValue.toLowerCase())
          )
          .map((tag: string) => (
            <Tag
              key={tag}
              tag={tag}
              isChoised={tagsObj[tag as keyof typeof tagsObj]}
            />
          ))
      ) : (
        <div></div>
      )}
    </div>
  );
});

export default AddTags;
