import appState from "../../../store/Appstate.ts";
import { observer, useObserver } from "mobx-react-lite";
import { useState } from "react";
import Bolt from "@mui/icons-material/ElectricBoltRounded";
// import Star from "@mui/icons-material/StarOutlineRounded";
// import StarRate from "@mui/icons-material/StarRateRounded";
import ExpandOpen from "@mui/icons-material/ExpandMoreRounded";
import ExpandClose from "@mui/icons-material/KeyboardArrowUpRounded";
import Play from "@mui/icons-material/PlayCircleFilledRounded";
// import Play from "@mui/icons-material/PlayArrowRounded";
import Done from "@mui/icons-material/DoneRounded";
import List from "@mui/icons-material/FormatListBulletedRounded";
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
// import Tasks from "./Tasks.tsx";

const Task = observer((prop: any) => {
  // const cc = yellow;
  const { task, isChildren } = prop;
  // const colot = task.color || "transparent";
  const [isExpanded, setIsExpanded] = useState(false);
  // function toggleIsImportant(taskId: string, isImportant: boolean) {
  //   appState.updateTaskValue(taskId, "isImportant", !isImportant);
  // }

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
    };
    return colors[color] || grey;
  };

  const isHasBorder: any = () => {
    if (!isChildren) {
      return task.color || "transparent";
    } else return "transparent";
  };

  // const dateFormat: any = (date: string) => {
  //   const d = new Date(date);
  //   const today = d.toLocaleDateString("ru-RU", {
  //     day: "2-digit",
  //     month: "2-digit",
  //     year: "numeric",
  //   });
  //   // if (d.toDateString() === today.toDateString())
  // };

  // const isHasChildren: any = () => {
  //   if (!isChildren) {
  //     return "0px";
  //   } else return "0.5rem";
  // };

  const handleToggleComplete: any = () => {
    appState.updateTaskValue(task.id, "isCompleted", !task.isCompleted);
  };

  const isHasChildren: any = () => {
    if (!isChildren) {
      return {
        paddingRight: "0.85rem",
        paddingLeft: "1rem",
        paddingBottom: "0.5rem",
      };
    } else
      return {
        // paddingLeft: "1/12",
        // borderTop: "1px dotted gray",
        // paddingTop: "2rem",
      };
  };
  return useObserver(() => (
    <li
      key={task.id}
      style={{
        borderLeft: `3px solid ${isHasBorder()}`,
        ...isHasChildren(),
      }}
      className="flex flex-col bg-slate-900 mb-1 pt-3"
      // style={{ padding: `${isChildren ? "5px" : "10px"}` }}
    >
      <div className="mainTask w-full flex flex-col">
        <div className="flex items-start">
          {/* {isChildren && <div className="paddingForChildren w-1/12"></div>} */}
          <div
            className="inputCheckbox flex justify-center items-center min-w-[23px] h-[23px] w-[23px] rounded-md mr-2 border-slate-400 border-[2px]"
            id={task.id}
            onClick={() => handleToggleComplete(task.id)}
          >
            {task.isCompleted && <Done fontSize="small" />}
            {!task.isCompleted && task.emodji && (
              <span className="emodji text-[10px]">{task.emodji}</span>
            )}
          </div>
          {/* <div className="flex items-start"> */}
          <label
            style={{
              textDecoration: task.isCompleted ? "line-through" : "",
              color: task.isCompleted ? grey[500] : "",
            }}
            className="text-md max-h-12 cursor-pointer font-semibold pr-2 overflow-hidden"
          >
            {task.title}
          </label>
          <div className="ml-auto flex flex-row">
            {/* <div className="w-[7vw] flex justify-center"> */}
            {/* {task.isImportant && (
                <StarRate
                  sx={{ color: grey[300] }}
                  onClick={() => toggleIsImportant(task.id, true)}
                />
              )}
              {!task.isImportant && (
                <Star
                  sx={{ color: grey[500] }}
                  onClick={() => toggleIsImportant(task.id, false)}
                />
              )} */}
            {/* </div> */}
            <div className="w-[7vw] flex justify-center items-center">
              {!task.children && task.isFast && (
                <Bolt
                  fontSize="small"
                  sx={{ color: yellow[500] }}
                  // className="ml-2"
                />
              )}
              {!task.isFast && !task.children && (
                <Play
                  fontSize="small"
                  style={{ color: handleColor(task.color)[500] }}
                  // sx={{ color: grey[500] }}
                  // className="ml-2"
                />
              )}
              {task.children && task.children.length > 0 && !isExpanded && (
                <ExpandOpen
                  onClick={() => setIsExpanded(!isExpanded)}
                  fontSize="small"
                  sx={{ color: grey[300] }}
                />
              )}
              {task.children && task.children.length > 0 && isExpanded && (
                <ExpandClose
                  onClick={() => setIsExpanded(!isExpanded)}
                  fontSize="small"
                  sx={{ color: grey[500] }}
                />
              )}
            </div>
          </div>
        </div>

        {true && (
          <div className="secRow flex items-center pb-1">
            <div className="w-[20px] mr-2 flex justify-center">
              {/* {task.children && task.children.length > 0 && !isExpanded && (
                <ExpandMore
                  onClick={() => setIsExpanded(!isExpanded)}
                  fontSize="small"
                  sx={{ color: grey[500] }}
                />
              )}
              {task.children && task.children.length > 0 && isExpanded && (
                <ExpandOpen
                  onClick={() => setIsExpanded(!isExpanded)}
                  fontSize="small"
                  sx={{ color: grey[500] }}
                />
              )} */}
            </div>
            <span className="list__name text-[0.7rem] w-10/12 flex flex-row items-center">
              <List sx={{ fontSize: 13 }} />
              {task.list || "Входящие"}
              {task.startDate && <DateComponent dateString={task.startDate} />}
              {task.startTime && <div> {task.startTime}</div>}
            </span>
            {/* <div className="w-1/12 flex justify-center">
              
            </div> */}
          </div>
        )}
      </div>
      {task.children && isExpanded && (
        <ul className="ml-5">
          {task.children.map((child: any) => (
            <Task
              key={child}
              isChildren={true}
              task={appState.taskArray.find((it) => it.id === child)}
            />
          ))}
        </ul>
      )}

      {/* // <Task task={appState.taskArray.find((it) => it.id === task.children)} /> */}
      {/* } */}
    </li>
  ));
});

export default Task;
