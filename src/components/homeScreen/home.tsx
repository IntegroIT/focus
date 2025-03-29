import "../../App.css";
import { observer } from "mobx-react-lite";
import appState from "../../../store/Appstate.ts";
import Header from "../header";
import AddTask from "./AddTask";
import Tasks from "./Tasks.tsx";
import FiltredTasks from "./FiltredTasks.tsx";
// import PlusTask from "../homeScreen/PlusTask";
import EmojiAnimation from "./EmojiAnimation.tsx";

const Home = observer(() => {
  const tasks: any = [];
  const completed: any = [];
  const emodji = appState.isEmodjiAnimate;

  appState.taskArray.forEach((task) => {
    if (task.isCompleted) {
      completed.push(task);
    } else if (!task.isCompleted && !task.parent) {
      tasks.push(task);
    }
  });

  return (
    <div className="Home">
      <Header />
      {!appState.isNoteVisible && <Tasks tasks={tasks} filteredRulle={null} />}
      {!appState.isNoteVisible && (
        <FiltredTasks tasks={completed} detailsName="Выполнено" />
      )}

      {/* {!appState.isAddTaskModalVisible && <PlusTask />} */}
      <AddTask />
      {emodji != "" && (
        <EmojiAnimation
          emoji={emodji}
          onAnimationEnd={() => appState.showEmojiAnimation("")} // Останавливаем анимацию
        />
      )}
    </div>
  );
});

export default Home;
