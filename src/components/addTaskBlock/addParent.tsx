import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import appState from "../../../store/Appstate.ts";
// import data from "../../../store⚡️/Data.ts"; // Импортируем хранилище

const AddParents: React.FC = observer(() => {
  const tasks = appState.taskArray; // Получаем задачи из хранилища

  // Состояние для отслеживания открытых/закрытых задач
  const [openTasks, setOpenTasks] = useState<Set<string>>(new Set());

  // Состояние для отслеживания выбранной задачи
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  // Состояние для фильтрации задач
  const [filterText, setFilterText] = useState("");

  // Шаг 1: Создаем карту задач для быстрого доступа по id
  const taskMap = tasks.reduce((map, task) => {
    map[task.id] = { ...task, children: [] };
    return map;
  }, {} as Record<string, any>);

  // Шаг 2: Строим дерево задач
  const rootTasks: any[] = [];
  tasks.forEach((task) => {
    if (task.parent) {
      // Если у задачи есть родитель, добавляем её в children родителя
      taskMap[task.parent].children.push(taskMap[task.id]);
    } else {
      // Если родителя нет, это корневая задача
      rootTasks.push(taskMap[task.id]);
    }
  });

  // Шаг 3: Обработчик клика по треугольнику (раскрытие/сворачивание)
  const handleTriangleClick = (id: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Останавливаем всплытие события
    const newOpenTasks = new Set(openTasks);
    if (newOpenTasks.has(id)) {
      newOpenTasks.delete(id); // Закрываем задачу, если она уже открыта
    } else {
      newOpenTasks.add(id); // Открываем задачу, если она закрыта
    }
    setOpenTasks(newOpenTasks);
  };

  // Шаг 4: Обработчик выбора задачи через радио-кнопку
  const handleTaskSelect = (id: string) => {
    if (selectedTaskId === id) {
      setSelectedTaskId(null); // Снимаем выбор, если задача уже выбрана
    } else {
      setSelectedTaskId(id); // Устанавливаем выбранную задачу
    }
    appState.setTaskData("parent", id); // Закомментировано, как вы просили
    console.log("parent", id);
  };

  // Шаг 5: Функция для создания новой задачи
  const createParent = (title: string) => {
    console.log("Создана задача:", title); // Пока просто выводим в консоль
  };

  // Шаг 6: Функция для обрезки текста
  const truncateText = (text: string, maxLength: number) => {
    if (text.length > maxLength) {
      const truncated = text.slice(0, maxLength); // Обрезаем текст
      const lastSpaceIndex = truncated.lastIndexOf(" "); // Находим последний пробел
      const finalText =
        lastSpaceIndex > 0 ? truncated.slice(0, lastSpaceIndex) : truncated; // Обрезаем до последнего пробела
      return (
        <>
          {finalText}
          <span style={{ whiteSpace: "nowrap" }}>...</span>{" "}
          {/* Троеточие без переноса */}
        </>
      );
    }
    return text;
  };

  // Шаг 7: Рекурсивная функция для поиска всех задач (включая дочерние)
  const getAllTasks = (tasks: any[]): any[] => {
    return tasks.reduce((acc, task) => {
      acc.push(task); // Добавляем текущую задачу
      if (task.children && task.children.length > 0) {
        acc.push(...getAllTasks(task.children)); // Добавляем дочерние задачи
      }
      return acc;
    }, []);
  };

  // Шаг 8: Фильтрация задач (ищем по всем задачам, включая дочерние)
  const allTasks = getAllTasks(rootTasks);
  const filteredTasks = allTasks.filter((task) =>
    task.title.toLowerCase().includes(filterText.toLowerCase())
  );

  // Шаг 9: Рендеринг задач (с иерархией или без)
  const renderTasks = (tasks: any[], level: number = 0) => {
    return tasks.map((task) => {
      const isOpen = openTasks.has(task.id); // Проверяем, открыта ли задача
      const hasChildren = task.children && task.children.length > 0;
      const isSelected = selectedTaskId === task.id; // Проверяем, выбрана ли задача
      const truncatedTitle = truncateText(task.title, 35); // Обрезаем текст задачи до 35 символов

      // Если фильтр активен, отображаем задачи без вложенности
      if (filterText.length > 1) {
        return (
          <div
            key={task.id}
            className={`flex justify-between items-center p-2 rounded ${
              isSelected ? "bg-green-900" : ""
            }`}
          >
            <div
              className="flex items-center flex-1 cursor-pointer"
              onClick={() => handleTaskSelect(task.id)} // Клик на всю область задачи
            >
              <span>{truncatedTitle}</span> {/* Заголовок задачи */}
            </div>
            {/* Радио-кнопка */}
            <input
              type="radio"
              name="task"
              checked={isSelected}
              onChange={() => handleTaskSelect(task.id)} // Обработчик выбора задачи
              className="ml-2 rounded-full cursor-pointer"
            />
          </div>
        );
      }

      // Если фильтр не активен, отображаем задачи с иерархией
      return (
        <div key={task.id}>
          {/* Родительская задача */}
          <div
            className={`flex justify-between items-center p-2 rounded ${
              isSelected ? "bg-green-900" : ""
            }`}
            style={{ marginLeft: `${level * 20}px` }}
          >
            <div
              className="flex items-center flex-1 cursor-pointer"
              onClick={() => {
                if (hasChildren) {
                  const newOpenTasks = new Set(openTasks);
                  if (newOpenTasks.has(task.id)) {
                    newOpenTasks.delete(task.id); // Закрываем задачу, если она уже открыта
                  } else {
                    newOpenTasks.add(task.id); // Открываем задачу, если она закрыта
                  }
                  setOpenTasks(newOpenTasks);
                }
              }}
            >
              {/* Стрелка (треугольник) */}
              {hasChildren && (
                <span
                  className={`mr-2 text-gray-500 transition-transform transform ${
                    isOpen ? "rotate-90" : ""
                  } cursor-pointer`}
                  onClick={(e) => handleTriangleClick(task.id, e)} // Обработчик клика по треугольнику
                >
                  ▸
                </span>
              )}
              <span>{truncatedTitle}</span> {/* Заголовок задачи */}
            </div>
            {/* Радио-кнопка */}
            <input
              type="radio"
              name="task"
              checked={isSelected}
              onChange={() => handleTaskSelect(task.id)} // Обработчик выбора задачи
              className="ml-2 rounded-full cursor-pointer"
            />
          </div>

          {/* Дочерние задачи */}
          {isOpen && hasChildren && (
            <div style={{ marginLeft: `${(level + 1) * 20}px` }}>
              {renderTasks(task.children, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div>
      {/* Поле для ввода */}
      <input
        type="text"
        placeholder="Поиск задач..."
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
        className="w-full p-2 border-b-2 border-white focus:outline-none"
      />

      {/* Список задач */}
      {filterText.length > 1 ? (
        filteredTasks.length > 0 ? (
          renderTasks(filteredTasks)
        ) : (
          <div className="mt-4">
            <p>Создать "{truncateText(filterText, 35)}"</p>
            <button
              onClick={() => createParent(filterText)}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
            >
              Создать
            </button>
          </div>
        )
      ) : (
        renderTasks(rootTasks)
      )}
    </div>
  );
});

export default AddParents;
