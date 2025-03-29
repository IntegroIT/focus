import appState from "../../../store/Appstate.ts";
import { observer } from "mobx-react-lite";
import DoNotDisturbTwoToneIcon from "@mui/icons-material/DoNotDisturbTwoTone";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import Check from "@mui/icons-material/CheckTwoTone";
import { useRef, useState } from "react";
// import { BorderBottom } from "@mui/icons-material";

const errorLine = {
  // borderColor: "blue",
  borderBottom: "2px solid blue",
  transition: "border-bottom-width 0.2s ease",
};

const AddCategory = observer(() => {
  const [color, setColor] = useState("");
  const [isEmptyValue, setIsEmptyValue] = useState(false);

  const showErrorLine = () => {
    setIsEmptyValue(true);
    setTimeout(() => {
      setIsEmptyValue(false);
    }, 3000);
  };
  // const [clickedBlock, setClickedBlock] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const handleClick = (name: string, color: string) => {
    (inputRef.current as HTMLInputElement).value = name;
    setColor(color);
    appState.setTaskData("color", color);
    if (appState.isNoteVisible && !appState.isNewTask) {
      appState.updateTaskValue(appState.mainTask.id, "color", color);
      appState.taskData = {};
    }
  };
  // appState.setTaskModalName("Категория");

  return (
    <>
      <div
        style={isEmptyValue ? errorLine : {}}
        className="mb-4 w-[98%] h-10 border-b-[1px] border-slate-600 mt-4 flex justify-between items-center"
      >
        <div
          style={{ borderColor: color == "transparent" ? "gray" : color }}
          className="w-6 h-6 rounded-full border-4"
        ></div>
        <input
          ref={inputRef}
          type="text"
          className="w-[80%]  bg-transparent outline-none pl-2"
          placeholder="Введите название категории"
        />
        <SendRoundedIcon
          className="cursor-pointer "
          onClick={() => {
            let value = (inputRef.current as HTMLInputElement).value;
            appState.updateCategoryName(color, value);
            value === "" ? showErrorLine() : appState.hideTaskModal();
          }}
        />
      </div>
      <div className="grid grid-cols-6 gap-2">
        <div
          onClick={() => handleClick("Без категории", "transparent")}
          className="bg-slate-800 cursor-pointer rounded-lg border-dotted border-slate-400 border-2 flex items-center justify-center h-[10vw]"
        >
          <DoNotDisturbTwoToneIcon />
        </div>
        {appState.categories.map((it: any, index) => (
          <div
            onClick={() => handleClick(it.name, it.color)}
            className="cursor-pointer rounded-lg flex items-center justify-center h-[10vw]
            mr-2"
            key={"cat" + index}
            style={{ backgroundColor: it.color }}
          >
            {color === it.color && <Check fontSize="large" />}
          </div>
        ))}
      </div>
    </>
  );
});
export default AddCategory;
