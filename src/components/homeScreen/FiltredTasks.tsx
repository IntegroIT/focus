import { useMemo, useState } from "react";
// import appState from "../../../store⚡️/Appstate.ts";
import { observer } from "mobx-react-lite";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";
import Task from "./Task.tsx";
import DraggableBlock from "./DraggableBlock.tsx";
// import { div } from "framer-motion/client";

const FiltredTasks: React.FC<any> = observer(({ tasks, detailsName }) => {
  // const tasks = appState.taskArray;
  const [isOpen, setIsOpen] = useState(false); // Состояние для управления открытием/закрытием

  // Создаем хэш-таблицу для быстрого доступа к задачам по их ID (с useMemo)
  const taskMap = useMemo(() => {
    const map = new Map();
    tasks.forEach((task: any) => map.set(task.id, task));
    return map;
  }, [tasks]); // Зависимость от tasks

  // Фильтруем выполненные задачи (без useMemo)
  // const filteredTasks = tasks.filter((task: any) => task.isCompleted);

  // Если нет выполненных задач, не рендерим компонент
  if (tasks.length === 0) {
    return null;
  }

  // Функция для проверки, выполнена ли родительская задача
  const isParentCompleted = (task: any) => {
    if (!task.parent) return false; // Если родителя нет, считаем, что он не выполнен
    const parent = taskMap.get(task.parent);
    return parent ? parent.isCompleted : false;
  };

  return (
    <details open={isOpen}>
      <summary
        className="cursor-pointer m-4 select-none"
        onClick={(e) => {
          e.preventDefault(); // Предотвращаем стандартное поведение
          setIsOpen(!isOpen); // Переключаем состояние
        }}
        style={{ listStyle: "none" }} // Убираем стандартный треугольник
      >
        <div className="flex items-center">
          {isOpen ? (
            <KeyboardArrowDownRoundedIcon />
          ) : (
            <KeyboardArrowRightRoundedIcon />
          )}
          <span className="ml-2">{detailsName}</span>
        </div>
      </summary>
      <ul>
        {tasks.map((task: any, index: number) =>
          // Проверяем оба условия:
          // 1. Если у задачи есть родитель и он не выполнен, выводим задачу.
          // 2. Если у задачи нет родителя, выводим задачу.
          (task.parent && !isParentCompleted(task)) || !task.parent ? (
            <DraggableBlock id={task.id} key={`DraggableBlock-${task.id}`}>
              <Task key={task.id + index} task={task} />
            </DraggableBlock>
          ) : null
        )}
      </ul>
    </details>
  );
});

export default FiltredTasks;
