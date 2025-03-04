// import appState from "../../../store/Appstate.ts";
import { observer } from "mobx-react-lite";
// import Bolt from "@mui/icons-material/ElectricBoltRounded";
// import Star from "@mui/icons-material/StarOutlineRounded";
// import StarRate from "@mui/icons-material/StarRateRounded";
// import ExpandMore from "@mui/icons-material/ExpandMoreRounded";
// // import ExpandLess from "@mui/icons-material/ExpandLessRounded";
// import List from "@mui/icons-material/FormatListBulletedRounded";
// import { yellow } from "@mui/material/colors";
import Task from "./Task.tsx";
// import CompletedTasks from "./CompletedTasks.tsx";
// import EmojiAnimation from "./EmojiAnimation.tsx";

const Tasks: React.FC<any> = observer(({ tasks }) => {
  // const emodji = appState.isEmodjiAnimate;
  // function toggleIsImportant(taskId: string, isImportant: boolean) {
  //   appState.updateTaskValue(taskId, "isImportant", !isImportant);
  // }
  //  Добавляем observer
  return (
    <>
      <ul>
        {tasks.map(
          (task: any) => (
            // <div>{it.title}</div>
            // !task.isCompleted &&
            // !task.parent && (
            <Task
              // onClick={console.log("okkk")}
              // onClick={() => {
              //   console.log(task);
              //   appState.setMainTask(task);
              //   appState.showTaskModal("note");
              // }}
              key={`Task-${task.id}`}
              task={task}
            />
          )
          // )
        )}
      </ul>
      {/* <CompletedTasks tasks={taskArrayMap} /> */}
      {/* {emodji != "" && (
        <EmojiAnimation
          emoji={emodji}
          onAnimationEnd={() => appState.showEmojiAnimation("")} // Останавливаем анимацию
        />
      )} */}
    </>
  );
});

export default Tasks;
