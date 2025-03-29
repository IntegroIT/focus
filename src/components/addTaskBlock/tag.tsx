// Выводим один тег
import Done from "@mui/icons-material/DoneRounded";
import appState from "../../../store/Appstate.ts";
// import { useState } from "react";

const Tag = ({ tag, isChoised }: { tag: string; isChoised: boolean }) => {
  // const [isClicked, setIsClicked] = useState(isChoised);

  const handleClick = () => {
    // setIsClicked(!isClicked);
    // appState.setRefreshTags();
    appState.tags[tag as keyof typeof appState.tags] = !isChoised;
    const tags =
      appState.isNoteVisible && !appState.isNewTask
        ? appState.mainTask.tags || []
        : appState.taskData.tags || [];
    if (!tags.includes(tag)) {
      tags.push(tag);
    } else {
      const index = tags.indexOf(tag);
      tags.splice(index, 1);
    }

    if (appState.isNoteVisible && !appState.isNewTask) {
      appState.updateTaskValue(appState.mainTask.id, "tags", tags);
      console.log("main task");
    } else appState.setTaskData("tags", tags);
    // appState.setTaskData("tags", tag);
  };

  return (
    <div
      onClick={handleClick}
      style={{
        backgroundColor: isChoised ? "#22225e" : "", // TODO изменить фон
      }}
      className="flex items-center justify-between mt-2 cursor-pointer"
      key={tag}
    >
      <div>{tag}</div>
      <div className="inputCheckbox flex justify-center items-center min-w-[23px] h-[23px] w-[23px] rounded-md mr-2 border-slate-400 border-[2px]">
        {isChoised && <Done fontSize="small" />}
      </div>
    </div>
  );
};

export default Tag;
