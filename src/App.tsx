// import { useState } from "react";
import { observer } from "mobx-react-lite";
import Home from "./components/homeScreen/home";
import TaskModal from "./components/addTaskBlock/taskModal";
import Menu from "./components/menu";
import Note from "./components/Note";
import appState from "../store/Appstate";
import PlusTask from "./components/homeScreen/PlusTask";
// import KandinskyImageGenerator from "./components/homeScreen/Kand";
// import AdaptiveHeight from "./components/AdaptiveHeight";
// import Calendar Component from "./components/calendar2";
// import Calendar from "./components/calendar";
// import DatePickerFormatting from "./components/cal";
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import "./App.css";

const App: any = observer(() => {
  appState.updateTaskMap(); // TODO настроить обновление карты задач, а точее сделать ее инициализацию на старте с помощью setTasks
  // const [count, setCount] = useState(0)
  // const [isOpen, setIsOpen] = useState(false);

  return (
    // <AdaptiveHeight>
    <div className="pb-36 pt-16">
      {/* <Header /> */}
      <Home />
      <Menu />
      {/* <CalendarComponent /> */}
      {/* <Calendar /> */}
      <TaskModal />
      <Note />
      {!appState.isAddTaskModalVisible && <PlusTask />}
      {/* <KandinskyImageGenerator /> */}
      {/* <button onClick={() => setIsOpen(true)}>Открыть лист</button> */}
      {/* <Sheet isOpen={isOpen} onClose={() => setIsOpen(false)} height={500} /> */}
      {/* <DatePickerFormatting /> */}
      {/* <div>
      <a href="https://vitejs.dev" target="_blank">
      <img src={viteLogo} className="logo" alt="Vite logo" />
      </a>
      <a href="https://react.dev" target="_blank">
      <img src={reactLogo} className="logo react" alt="React logo" />
      </a>
      </div>
      <h1 className='text-blue-500'>Vite + React</h1>
      <div className="card">
      <button onClick={() => setCount((count) => count + 1)}>
      count is {count}
      </button>
      <p>
      Edit <code>src/App.tsx</code> and save to test HMR
      </p>
      </div>
      <p className="read-the-docs">
      Click on the Vite and React logos to learn more
      </p> */}
    </div>
  );
});

export default App;
