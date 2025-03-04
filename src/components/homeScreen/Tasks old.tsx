import appState from "../../../store/Appstate.ts";
import { observer } from "mobx-react-lite";
import Bolt from "@mui/icons-material/ElectricBoltRounded";
import Star from "@mui/icons-material/StarOutlineRounded";
import StarRate from "@mui/icons-material/StarRateRounded";
import ExpandMore from "@mui/icons-material/ExpandMoreRounded";
// import ExpandLess from "@mui/icons-material/ExpandLessRounded";
import List from "@mui/icons-material/FormatListBulletedRounded";
import { yellow } from "@mui/material/colors";

const Tasks = observer(() => {
  function toggleIsImportant(taskId: string, isImportant: boolean) {
    appState.updateTaskValue(taskId, "isImportant", !isImportant);
  }
  //  Добавляем observer
  return (
    <ul>
      {appState.taskArray.map((task: any) => (
        // <div>{it.title}</div>
        <li
          key={task.id}
          style={{ borderLeft: `3px solid ${task.color || "transparent"}` }}
          className="flex bg-slate-900 mb-1 p-3"
        >
          <input
            className="w-5 h-5 mt-0 ml-2 border-slate-100 border-2 rounded"
            type="checkbox"
            checked={task.completed}
            id={task.id}
            // onChange={() => handleToggleComplete(task.id)}
          />
          <div className="ml-4 w-full">
            <div className="flex items-start">
              <label className="text-sm cursor-pointer w-10/12 font-semibold pr-2">
                {task.title}
              </label>
              <div className="w-1/12">
                {task.isFast && (
                  <Bolt
                    fontSize="small"
                    sx={{ color: yellow[500] }}
                    // className="ml-2"
                  />
                )}
              </div>
              {task.isImportant ? (
                <StarRate onClick={() => toggleIsImportant(task.id, true)} />
              ) : (
                <Star onClick={() => toggleIsImportant(task.id, false)} />
              )}
            </div>
            <div
              style={{ minHeight: task.isHasChildren ? "3rem" : "auto" }}
              className="flex pt-1 items-center"
            >
              <span className="list__name text-[0.7rem] w-11/12">
                <List sx={{ fontSize: 13 }} />
                {task.list}
              </span>
              <div className="w-1/12 flex justify-center">
                {task.isHasChildren && <ExpandMore fontSize="medium" />}
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
});

export default Tasks;
