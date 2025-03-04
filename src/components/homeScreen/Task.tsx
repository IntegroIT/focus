import appState from "../../../store/Appstate.ts";
import data from "../../../store/Data.ts"; // Импортируем хранилище
import { observer, useObserver } from "mobx-react-lite";
// import { useState } from "react";
import Bolt from "@mui/icons-material/ElectricBoltRounded";
import ExpandOpen from "@mui/icons-material/ExpandMoreRounded";
import ExpandClose from "@mui/icons-material/KeyboardArrowUpRounded";
import Play from "@mui/icons-material/PlayCircleFilledRounded";
import Done from "@mui/icons-material/DoneRounded";
import List from "@mui/icons-material/FormatListBulletedRounded";
import DraggableBlock from "./DraggableBlock.tsx";
import {
  yellow,
  grey,
  red,
  green,
  blue,
  purple,
  orange,
  brown,
  cyan,
  pink,
  indigo,
} from "@mui/material/colors";
import DateComponent from "./date.tsx";

// appState.setTasks(appState.taskArray);
const tasks = data.tasks;
const taskMap = appState.taskMap;
const taskParentTitle = (id: string) => {
  const maxLength = 35;
  const parent = tasks.find((it) => it.id == id);
  if (parent) {
    let title = parent.title;
    return title.length > maxLength ? title.slice(0, maxLength) + "..." : title;
  } else return "Входящие";
};

const Task = observer((prop: any) => {
  const { task, isChildren } = prop;
  // const [isExpanded, setIsExpanded1] = useState(task.expand);
  const isExpanded = task.expand || false;

  const setIsExpanded = (value: boolean) => {
    appState.updateTaskValue(task.id, "expand", value);
  };

  const handleColor = (color: string) => {
    const colors: { [key: string]: any } = {
      red: red,
      yellow: yellow,
      green: green,
      blue: blue,
      purple: purple,
      orange: orange,
      brown: brown,
      cyan: cyan,
      pink: pink,
      indigo: indigo,
      gray: { 500: "#808080" },
      black: { 500: "#000000" },
      white: { 500: "#FFFFFF" },
      magenta: { 500: "#FF00FF" },
      lime: { 500: "#00FF00" },
      teal: { 500: "#008080" },
      maroon: { 500: "#800000" },
      navy: { 500: "#000080" },
      olive: { 500: "#808000" },
      silver: { 500: "#C0C0C0" },
      gold: { 500: "#FFD700" },
      violet: { 500: "#EE82EE" },
      beige: { 500: "#F5F5DC" },
    };
    return colors[color] || grey;
  };

  const isHasBorder: any = () => {
    if (!isChildren) {
      return task.color || "transparent";
    } else return "transparent";
  };

  const handleToggleComplete = (id: string) => {
    const newCompletedState = !task.isCompleted;
    appState.updateTaskValue(id, "isCompleted", newCompletedState);

    if (task.emodji && newCompletedState) {
      appState.showEmojiAnimation(task.emodji);
    }
  };

  const isHasChildren: any = () => {
    if (!isChildren) {
      return {
        paddingRight: "0.85rem",
        paddingLeft: "1rem",
        paddingBottom: "0.5rem",
      };
    } else return {};
  };

  return useObserver(() => (
    <li
      key={task.id}
      style={{
        borderLeft: `4px solid ${isHasBorder()}`,
        ...isHasChildren(),
      }}
      className="flex flex-col bg-slate-900 mb-1 pt-3 select-none"
    >
      <div className="mainTask w-full flex flex-col">
        <div className="flex items-center">
          <div
            className="inputCheckbox cursor-pointer flex justify-center items-center min-w-[23px] h-[23px] w-[23px] rounded-md mr-4 border-slate-400 border-[2px]"
            // style={{ borderLeft: handleColor(task.color)[900] }}
            id={task.id}
            onClick={() => handleToggleComplete(task.id)}
          >
            {task.isCompleted && <Done fontSize="small" />}
            {!task.isCompleted && task.emodji && (
              <span className="emodji text-[10px]">{task.emodji}</span>
            )}
          </div>
          <label
            onClick={() => {
              console.log(task);
              appState.setMainTask(task);
              // appState.showTaskModal("note");
              appState.showNote();
            }}
            style={{
              textDecoration: task.isCompleted ? "line-through" : "",
              color: task.isCompleted ? grey[500] : "",
            }}
            className="text-md cursor-pointer font-semibold pr-2 overflow-hidden"
          >
            {task.title}
          </label>
          <div className="ml-auto flex flex-row">
            <div className="taskMark w-[7vw] flex justify-center items-center">
              {!task.children && task.isFast && (
                <Bolt fontSize="small" sx={{ color: yellow[500] }} />
              )}
              {!task.isFast && !task.children && (
                <Play
                  fontSize="medium"
                  style={{ color: handleColor(task.color)[500] }}
                />
              )}
              {task.children && task.children.length > 0 && !isExpanded && (
                <div
                  // style={{ backgroundColor: handleColor(task.color)[100] }}
                  className="w-6 h-6 flex justify-center items-center rounded-full bg-slate-800"
                >
                  <ExpandOpen
                    onClick={() => setIsExpanded(!isExpanded)}
                    fontSize="small"
                    sx={{ color: grey[300] }}
                    // style={{ color: handleColor(task.color)[500] }}
                  />
                </div>
              )}
              {task.children && task.children.length > 0 && isExpanded && (
                <div className="w-6 h-6 flex justify-center items-center rounded-full bg-slate-800">
                  <ExpandClose
                    onClick={() => setIsExpanded(!isExpanded)}
                    fontSize="small"
                    sx={{ color: grey[500] }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="secRow flex items-center pb-1">
          <div className="w-[20px] mr-4 flex justify-center"></div>
          <span className="list__name text-[0.7rem] w-10/12 flex flex-row items-center">
            {!isChildren && (
              <>
                <List sx={{ fontSize: 13 }} />
                {taskParentTitle(task.parent)}
              </>
            )}
            {task.startDate && (
              <DateComponent
                dateString={task.startDate}
                time={task.startTime}
              />
            )}
          </span>
        </div>

        {/* Блок с тегами на новой строке */}
        {task.tags && task.tags.length > 0 && (
          <div className="tagsrow ml-7">
            <div className="tags flex flex-row flex-wrap ml-1 items-center">
              {task.tags.slice(0, 2).map((tag: any, index: number) => (
                <div
                  className="tag flex justify-center items-center pl-0.5 pr-0.5 h-4 text-[0.6rem] rounded-[2px] ml-1 border-slate-400 border-[1px]"
                  key={tag + task.id + index}
                >
                  {tag.length > 13 ? tag.slice(0, 13) + "..." : tag}
                </div>
              ))}
              {task.tags && task.tags.length > 2 && (
                <div
                  className="tag flex justify-center items-center pl-0.5 pr-0.5 h-4 text-[0.6rem] rounded-[2px] ml-1 border-slate-400 border-[1px]"
                  // key={"tag" + task.id}
                >
                  +{task.tags.length - 2}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {task.children && isExpanded && (
        <ul className="ml-5">
          {task.children.map((child: any, index: number) => (
            <DraggableBlock
              id={child}
              key={taskMap.get(child) + index}
              isChild={true}
            >
              <Task
                key={child + index + task.id}
                isChildren={true}
                task={taskMap.get(child)}
              />
            </DraggableBlock>
          ))}
        </ul>
      )}
    </li>
  ));
});

export default Task;
