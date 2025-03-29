import appState from "../../../store/Appstate.ts";
import AddRoundedIcon from "@mui/icons-material/AddRounded";

export default function PlusTask() {
  const handleClick = () => {
    // appState.setClicked(); // Изменяем состояние при клике
    appState.toggleAddTaskModal();
    appState.setFocusOnInput();
    appState.setIsNewTask(true);
    appState.refreshTags();
    // appState.setMainTask({});
    // alert(window.innerWidth);
  };

  return (
    <div
      className="plustask rounded-2xl flex fixed
    bottom-20 right-4 w-14 h-14 bg-blue-500 justify-center items-center
    text-4xl text-white cursor-pointer z-50"
      onClick={handleClick}
    >
      <AddRoundedIcon />
    </div>
  );
}
