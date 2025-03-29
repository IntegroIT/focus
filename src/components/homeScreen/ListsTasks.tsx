// import appState from "../../../store/Appstate.ts";
import { observer } from "mobx-react-lite";
// import PlusTask from "../homeScreen/PlusTask";
// import Tasks from "./Tasks.tsx";
import FiltredTasks from "./FiltredTasks.tsx";

const ListTasks: React.FC<any> = observer(({ taskArray, parentId }) => {
  const tasks: any = [];
  const completed: any = [];
  const ideas: any = [];
  taskArray.forEach((task: any) => {
    if (task.isCompleted) {
      completed.push(task);
    } else if (
      !task.isCompleted &&
      task.parent == parentId &&
      task.type == "task"
    ) {
      tasks.push(task);
    } else if (task.type == "Идея") {
      ideas.push(task);
    }
  });
  // console.log("tasks", tasks.length);

  return (
    <div className="App">
      {/* <Tasks tasks={tasks} /> */}
      <FiltredTasks tasks={tasks} detailsName="Задачи проекта" />
      <FiltredTasks tasks={completed} detailsName="Выполнено" />
      <FiltredTasks tasks={ideas} detailsName="Идеи" />
    </div>
  );
});

export default ListTasks;
