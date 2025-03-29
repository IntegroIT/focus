import { makeAutoObservable } from "mobx";
import data from "./Data.ts";
// import { th } from "framer-motion/client";
// import { light } from "@mui/material/styles/createPalette";

export interface TaskTemplate {
  id: string;
  title: string;
  description: string;
  list: string;
  isFocus: boolean;
  isImportant: boolean;
  isFast: boolean;
  color: string;
  tags: string[];
  cluster: string;
  startDate: string;
  startTime: string;
  alert: string;
  children: string[];
  isCompleted: boolean;
  emodji: string;
  type: string;
  background: string;
  expand: boolean;
}

class AppState {
  count = 0;
  taskArray = data.tasks;
  taskMap = new Map(); // Карта задач
  categories = data.categories;
  tags = data.tags;
  clicked = false;
  focusedInputName = ""; // Название фокуса в поле ввода
  mainTask: { [key: string]: any } = {};
  // refreshTags = false;
  taskData: { [key: string]: any } = {};
  isTaskModalVisible = false;
  isAddTaskModalVisible = false;
  isNoteVisible = false; // Видимость заметки в модальном окне
  taskModalName = ""; // Название модального окна при выборе пунтка в задаче
  categoryName = "";
  taskModalContent = "";
  isEmodjiAnimate = "";
  isListening = false;
  isNewTask = false; // Опредеим, это новая задача, или редактируем старую
  draggedBlockId: string | null = null;
  bottomPosition: number = 0;
  taskModalContntentToName = {
    // TODO добавить ключи. См.
    emodji: "Добавьте эмоцию в задачу",
    categories: "Выберите категорию",
    calendar: "Настроить дату",
    alerts: "Настройте уведомления",
    isFast: "Быстрое",
    color: "Цвет",
    listId: "Список",
    tags: "Теги",
    cluster: "Кластер",
    startDate: "Старт",
    alert: "Алерт",
    lists: "Родительский проект или задача",
  };

  constructor() {
    makeAutoObservable(this);
  }

  // increment = () => {
  //   this.count++;
  //   console.log("ok", this.count);
  // };

  // decrement = () => {
  //   this.count--;
  // };

  // setClicked = () => {
  //   this.clicked = true;
  // };

  // Инициализация задач (например, при загрузке данных)
  setTasks(tasks: []) {
    this.taskArray = tasks;
    this.updateTaskMap(); // Обновляем карту задач
  }

  // Обновление карты задач на основе taskArray
  updateTaskMap() {
    this.taskMap.clear();
    this.taskArray.forEach((task) => this.taskMap.set(task.id, task));
    // console.log("Обновим карту задач", this.taskMap);
  }

  setTaskData = (key: any, value: any) => {
    // if (this.isNoteVisible) key = this.mainTask.id;
    this.taskData[key] = value;
    // if (this.isNoteVisible) this.updateTaskValue(this.mainTask.id, key, value);
  };

  // addMoreTask = () => { // Добавим много задач
  //   for (let i = 0; i < 10000; i++) {
  //     this.taskArray.push(this.taskData as TaskTemplate);
  //   }
  // };

  // setParent = (id: string) => {
  //   const parent = this.taskArray.find((it) => it.id == id) || {};
  //   const childrens = parent.children;
  //   this.setTaskData("parent", id);
  // };

  // @action
  updateChildrens = (parentId: string) => {
    // Находим индекс родителя в массиве
    const parentIndex = this.taskArray.findIndex((it) => it.id === parentId);
    if (parentIndex === -1) return;

    // Находим всех детей для данного родителя
    const childrenIds = this.taskArray
      .filter((it) => it.parent === parentId)
      .map((it) => it.id);

    // Создаем новый объект родителя с обновленными детьми
    const updatedParent = {
      ...this.taskArray[parentIndex],
      children: childrenIds,
    };

    // Заменяем родителя в массиве
    this.taskArray[parentIndex] = updatedParent as TaskTemplate;
  };

  setMainTask = (task: any) => {
    this.mainTask = task;
  };

  showNote = () => {
    this.isNoteVisible = true;
  };

  hideNote = () => {
    this.isNoteVisible = false;
  };

  showTaskModal = (value: string) => {
    this.isTaskModalVisible = true;
    this.taskModalContent = value;
    this.taskModalName =
      this.taskModalContntentToName[
        value as keyof typeof this.taskModalContntentToName
      ];
  };

  hideTaskModal = () => {
    this.isTaskModalVisible = false;
    this.setFocusOnInput();
  };

  setIsListening = (value: boolean) => {
    this.isListening = value;
  };

  addTask = () => {
    // if (this.taskData.parent) {
    //   console.log("Есть родитель", this.taskData.parent);
    //   this.updateChildrens(this.taskData.parent);
    // }
    if (this.taskData.parent) {
      this.addChildren(this.taskData.parent, this.taskData.id);
    }
    this.taskArray.push(this.taskData as TaskTemplate);
    console.log("addTask", Object.entries(this.taskData));
    console.log(
      "Все задачи",
      this.taskArray.map((it) => Object.entries(it))
    );
  };

  // addDataTask = (key: keyof (typeof this.taskArray)[0], value: any) => {
  //   this.taskData[key] = value;
  // };

  // addDataTask = (
  //   id: string,
  //   title: string,
  //   list: string,
  //   isFocus: boolean,
  //   isImportant: boolean,
  //   isFast: boolean,
  //   color: string,
  //   listId: number,
  //   tags: any,
  //   cluster: "string",
  //   start: "string",
  //   alert: boolean
  // ) => {
  //   this.taskArray.push({
  //     id: id,
  //     title: title,
  //     list: list,
  //     isFocus: isFocus,
  //     isImportant: isImportant,
  //     isFast: isFast,
  //     color: color,
  //     listId: listId,
  //     tags: tags,
  //     cluster: cluster,
  //     start: start,
  //     alert: alert,
  //   });
  //   console.log(this.taskArray[this.taskArray.length - 1].title);
  // };

  updateTaskData = (taskId: string, newTaskData: object) => {
    const taskIndex = this.taskArray.findIndex((task) => task.id === taskId);
    if (taskIndex !== -1) {
      const updateData = {
        ...this.taskArray[taskIndex],
        ...newTaskData,
      };
      this.taskArray[taskIndex] = updateData;
      this.taskMap.set(taskId, updateData);
    } else {
      console.error(`Задача с id ${taskId} не найдена.`);
    }
  };

  updateTaskValue = (
    taskId: string,
    key: keyof (typeof this.taskArray)[0],
    value: any
  ) => {
    const taskIndex = this.taskArray.findIndex((task) => task.id === taskId);

    if (taskIndex !== -1) {
      const task = this.taskArray[taskIndex];
      (task as any)[key] = value;
      this.taskArray[taskIndex] = task;
      this.taskMap.set(taskId, task);
    } else {
      console.error(`Задача с id ${taskId} не найдена.`);
    }
  };

  updateCategoryName = (color: string, name: string) => {
    const cat = this.categories.findIndex((cat) => cat.color === color);
    if (cat !== -1) {
      this.categories[cat] = { color: color, name: name };
      console.log(this.categories[cat]);
    }
  };

  setTaskModalName = (name: string) => {
    this.taskModalName = name;
  };

  toggleAddTaskModal = () => {
    this.isAddTaskModalVisible = !this.isAddTaskModalVisible;
  };

  addTag(tag: string) {
    if (!this.tags[tag as keyof typeof this.tags]) {
      this.tags[tag as keyof typeof this.tags] = true;
    }
  }

  refreshTags() {
    const tagsNames = Object.keys(this.tags);
    tagsNames.forEach((tag) => {
      this.tags[tag as keyof typeof this.tags] = false;
    });
  }

  addChildren = (taskId: string, children: string) => {
    const taskIndex = this.taskArray.findIndex((task) => task.id === taskId);

    if (taskIndex !== -1) {
      const task = this.taskArray[taskIndex];
      if (!task.children) task.children = [];
      (task as any).children.push(children);
      this.taskArray[taskIndex] = task;
    } else {
      console.error(`Задача с id ${taskId} не найдена.`);
    }
  };

  showEmojiAnimation = (emodji: string) => {
    this.isEmodjiAnimate = emodji;
    console.log(this.isEmodjiAnimate);
  };

  setDraggedBlockId(id: string | null) {
    this.draggedBlockId = id;
  }

  // Установимить фокус на нужное поле ввода
  setFocusOnInput() {
    if (
      "virtualKeyboard" in navigator &&
      typeof (navigator as any).virtualKeyboard === "object" &&
      "overlaysContent" in (navigator as any).virtualKeyboard
    ) {
      (navigator as any).virtualKeyboard.overlaysContent = true;

      (navigator as any).virtualKeyboard.addEventListener(
        "geometrychange",
        (event: any) => {
          const { height } = event.target.boundingRect;
          setTimeout(() => {
            this.bottomPosition = height;
            // alert("Высота клавиатуры:" + height);
          }, 0); // Задержка 300 мс
          // alert(`Высота клавиатуры: ${height}px`);
        }
      );
    }

    const inputElement = document.getElementById(
      "addTaskInput"
    ) as HTMLInputElement;
    setTimeout(() => {
      if (inputElement) inputElement.focus();
    }, 0);
  }

  setIsNewTask = (isIt: boolean) => {
    this.isNewTask = isIt;
  };

  setBottomPosition = () => {
    const innerHeight = window.innerHeight;
    const visualViewport = window.visualViewport?.height;
    if (visualViewport && innerHeight - visualViewport > 100)
      return innerHeight - visualViewport;
    else return 0;
  };

  getKeyboardHeight = (): number => {
    // Проверяем, что устройство мобильное (проверка userAgent)
    const isMobile: boolean = /Android|iPhone|iPad/i.test(navigator.userAgent);
    if (!isMobile) return 0;

    // Используем только visualViewport для расчета
    const viewportHeight = window.visualViewport?.height || window.innerHeight;

    // Рассчитываем высоту клавиатуры на основе разницы между screen.height и видимой областью
    const keyboardHeight = window.screen.height - viewportHeight;

    // Возвращаем корректную высоту, если разница значительная (> 50px)
    return keyboardHeight > 50 ? keyboardHeight : 0;
  };

  // clearRefreshTags() {
  //   this.refreshTags = false;
  // }
  // setRefreshTags() {
  //   this.refreshTags = true;
  // }
}

const appState = new AppState();
export default appState;
