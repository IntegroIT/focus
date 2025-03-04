import { useEffect, useState, useRef } from "react";
import { observer } from "mobx-react-lite";
import appState from "../../store/Appstate.ts";
// import List from "@mui/icons-material/FormatListBulletedRounded";
import List from "@mui/icons-material/MenuOpen";
import DateStart from "@mui/icons-material/InsertInvitationRounded";
// import Time from "@mui/icons-material/ScheduleRounded";
import Notifications from "@mui/icons-material/NotificationsRounded";
import Tags from "@mui/icons-material/LocalOfferRounded";
// import Tag from "../components/addTaskBlock/tag.tsx";
import ListTasks from "../components/homeScreen/ListsTasks.tsx";
import ArrowBack from "@mui/icons-material/ArrowBackIosNewTwoTone";
import Done from "@mui/icons-material/DoneRounded";
import More from "@mui/icons-material/MoreVertRounded";
import StarBorderRoundedIcon from "@mui/icons-material/StarBorderRounded";
import DateComponent from "./homeScreen/date.tsx";
import LoopRoundedIcon from "@mui/icons-material/LoopRounded";
import AddReaction from "@mui/icons-material/AddReactionTwoTone";
import EditNote from "@mui/icons-material/EditNoteRounded";
import EditableText from "./EditableText.tsx";
const taskMap = appState.taskMap;

// import ImageGenerator from "./homeScreen/ImageGenerator.tsx";
import { grey } from "@mui/material/colors";
// import { small } from "framer-motion/client";

const Note: any = observer(() => {
  const [headerOpacity, setHeaderOpacity] = useState(0);
  const [coverTop, setCoverTop] = useState(0);
  const [titleDisplay, setTitleDisplay] = useState(0);
  const [isShowEmodji, setIsShowEmoji] = useState(false);
  const task = appState.mainTask;
  const isNoteVisible = appState.isNoteVisible;
  const fixedContainerRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const excludedElementRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  // const coverRef = useRef<HTMLDivElement | null>(null);
  // const coverHeight = coverRef.current?.clientHeight || 0;

  isNoteVisible && appState.setTaskData("parent", task.id);

  const handleWheel = (event: WheelEvent) => {
    if (containerRef.current) {
      // Отменяем стандартное поведение вертикальной прокрутки
      event.preventDefault();
      // Прокручиваем контейнер по горизонтали
      containerRef.current.scrollLeft += event.deltaY;
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false });
    }

    return () => {
      if (container) {
        container.removeEventListener("wheel", handleWheel);
      }
    };
  }, []);

  const handleBlur = () => {
    // Используем setTimeout, чтобы дать браузеру время обновить фокус
    setTimeout(() => {
      const focusedElement = document.activeElement; // Получаем текущий активный элемент

      // Проверяем, является ли focusedElement исключаемым элементом
      if (
        excludedElementRef.current &&
        excludedElementRef.current.contains(focusedElement)
      ) {
        console.log(
          "Курсор перешел на исключаемый элемент. onBlur не выполняется."
        );
        return;
      }

      // Логика, которая выполняется при потере фокуса
      setIsShowEmoji(false);
      appState.updateTaskValue(task.id, "title", titleRef?.current?.innerText);
    }, 0); // Задержка 0 мс, чтобы выполнить код после обновления фокуса
  };

  const getParentTitles = (taskId: string) => {
    const titles: object[] = [];

    function traverse(taskId: string) {
      if (!taskMap.has(taskId)) return; // Если задачи нет в Map, завершаем рекурсию

      const task = taskMap.get(taskId); // Получаем задачу по ID
      titles.unshift(task); // Добавляем title текущей задачи в массив

      if (task.parent) {
        traverse(task.parent); // Рекурсивно вызываем для родительской задачи
      }
    }

    traverse(taskId);
    // titles.shift();
    titles.pop();
    return titles;
  };

  useEffect(() => {
    // console.log("coverHeight", coverHeight);
    const handleScroll = () => {
      const scrollTop = fixedContainerRef.current?.scrollTop || 0;
      const clientHeight = fixedContainerRef.current?.clientHeight || 0;
      const threshold = (14 * clientHeight) / 100;
      const opacity = Math.min(scrollTop / threshold, 1);
      const topPosition = Math.min(0, 0 - scrollTop / 6);

      const headerTitleDisplay = scrollTop > 120 ? 1 : 0; // При достижении 120 пикселей скролла показать заголовок задачи в header

      // console.log("scrollTop:", scrollTop);
      // console.log("threshold:", threshold);
      // console.log("opacity:", opacity);
      // console.log("topPosition:", topPosition);

      setHeaderOpacity(opacity);
      setCoverTop(topPosition);
      setTitleDisplay(headerTitleDisplay);
    };

    if (fixedContainerRef.current) {
      fixedContainerRef.current.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (fixedContainerRef.current) {
        fixedContainerRef.current.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  const handleToggleComplete = (id: string) => {
    const newCompletedState = !task.isCompleted;
    appState.updateTaskValue(id, "isCompleted", newCompletedState);
    if (task.emodji && newCompletedState) {
      appState.showEmojiAnimation(task.emodji);
    }
  };

  const noteStyle = {
    left: isNoteVisible ? "0" : "100%",
    transition: "left 0.1s ease-out",
  };

  const coverStyle = {
    left: isNoteVisible ? "0" : "100%",
    transition: "left 0.1s ease-out",
    top: coverTop,
  };

  const headerStyle = {
    left: isNoteVisible ? "0" : "100%",
    transition: "left 0.1s ease-out",
  };

  const headerTitle = {
    opacity: titleDisplay,
    transition: "opacity 0.1s ease-out",
  };

  function getDescendants(tasks: any[], parentId: string): any[] {
    const result: any[] = [];
    function findDescendants(taskId: string): void {
      tasks.forEach((task) => {
        if (task.parent === taskId) {
          result.push(task);
          findDescendants(task.id);
        }
      });
    }
    findDescendants(parentId);
    return result;
  }

  return (
    <div
      style={{ ...noteStyle }}
      ref={fixedContainerRef}
      className="note z-10 flex flex-col overflow-auto bg-slate-900"
    >
      <div
        className="note__header p-4 flex justify-between fixed top-0 w-full z-30 transition duration-200"
        style={{
          ...headerStyle,
          backgroundColor: `rgba(2, 6, 21, ${headerOpacity})`,
        }}
      >
        <div className="flex items-center gap-4">
          <div
            className="bg-slate-900/40 rounded-full p-1 w-10 cursor-pointer"
            onClick={() => {
              setCoverTop(0);
              setHeaderOpacity(0);
              setTitleDisplay(0);
              appState.setTaskData("parent", false);
              fixedContainerRef?.current?.scrollTo({
                top: 0,
              });
              appState.hideNote();
            }}
          >
            <ArrowBack fontSize="small" />
          </div>
          <span
            style={{ ...headerTitle }}
            className="title truncate max-w-[60vw]"
          >
            {task.title}
          </span>
        </div>
        <div className="flex gap-4 items-center bg-slate-900/40 rounded-full p-1">
          <StarBorderRoundedIcon fontSize="medium" />
          <More fontSize="medium" />
        </div>
      </div>
      <div
        // ref={coverRef}
        id="cover"
        className="noteBackground fixed left-0  w-full h-[150px] bg-cover bg-center"
        style={{
          ...coverStyle,
          backgroundImage: task.background
            ? `url(${task.background})`
            : `url("https://img.freepik.com/free-vector/low-poly-style-abstract-backdrop-modern-presentation_1017-53594.jpg")`,
        }}
      ></div>
      <div className="note__content relative z-10 bg-slate-900 rounded-t-2xl pt-4">
        <div className="p-4">
          {getParentTitles(task.id).length > 0 && (
            <div className="parents mb-2 items-center flex flex-row gap-2">
              <List fontSize="small" />
              <div
                ref={containerRef}
                className="parentsbread w-full overflow-x-auto scrollbar-hide flex flex-nowrap gap-2"
              >
                {getParentTitles(task.id).map((taskParent: any) => (
                  <Parent
                    task={taskParent}
                    title={taskParent.title}
                    key={taskParent.id + "parent"}
                  />
                ))}
              </div>
            </div>
          )}
          <div
            ref={excludedElementRef}
            tabIndex={0}
            className="flex flex-row items-center"
          >
            {isShowEmodji ? (
              <div
                className="cursor-pointer flex justify-center h-[26px] w-[26px] mr-4 text-lg"
                onClick={() => appState.showTaskModal("emodji")}
              >
                {task.emodji || <AddReaction />}
              </div>
            ) : (
              <div
                className="inputCheckbox cursor-pointer flex justify-center items-center min-w-[26px] h-[26px] w-[26px] rounded-md mr-4 border-slate-400 border-[2px]"
                id={task.id}
                onClick={() => handleToggleComplete(task.id)}
              >
                {task.isCompleted && <Done fontSize="small" />}
                {!task.isCompleted && task.emodji && (
                  <span className="emodji text-[12px]">{task.emodji}</span>
                )}
              </div>
            )}

            <div
              onBlur={handleBlur}
              ref={titleRef}
              onClick={() => setIsShowEmoji(true)}
              contentEditable="true"
              className="text-2xl font-bold outline-none"
              style={{
                textDecoration: task.isCompleted ? "line-through" : "",
                color: task.isCompleted ? grey[500] : "",
              }}
            >
              {task.title}
            </div>
          </div>
          {task.description && (
            <div className="mt-2">
              <EditNote /> {task.description}
            </div>
          )}

          <div
            className="noteValues"
            onClick={() => appState.showTaskModal("categories")}
          >
            <div className="flex flex-row gap-1">
              <div
                style={{
                  borderColor:
                    task.color == "transparent" ? "gray" : task.color,
                }}
                className="w-6 h-6 rounded-full border-4"
              ></div>
              <span>
                {appState.categories.find((it) => it.color == task.color)
                  ?.name || "Без категории"}
              </span>
            </div>
          </div>
          <div
            className="noteValues"
            onClick={() => appState.showTaskModal("categories")}
          >
            <div>
              <DateStart />
              <span>Дата и время</span>
            </div>
            {task.startDate && (
              <DateComponent
                dateString={task.startDate}
                time={task.startTime}
              />
            )}
          </div>
          <div className="noteValues">
            <div>
              <Notifications />
              <span>Напоминание</span>
            </div>
            {task.alert && <DateComponent dateString={task.alert} />}
          </div>
          <div className="noteValues">
            <div>
              <LoopRoundedIcon />
              <span>Повтор</span>
            </div>
            {/* <div>{task}</div> */}
          </div>
          <div
            className="noteValues items-end"
            onClick={() => appState.showTaskModal("tags")}
          >
            <div>
              <Tags />
              <span>Теги</span>
            </div>
            <div className="flex flex-row flex-wrap justify-end w-2/3">
              {task.tags &&
                task.tags.map((it: string) => {
                  return (
                    <div className="tag cursor-pointer flex justify-center items-center pl-1 pr-1 pb-0.5 pt-0.5 h-4 text-[0.8rem] rounded-[2px] ml-1 mb-1 border-slate-400 border-[1px]">
                      {it}
                    </div>
                    // <Tag
                    //   key={"tag" + it}
                    //   tag={it}
                    //   isChoised={tagsObj[it as keyof typeof tagsObj]}
                    // />
                  );
                })}
            </div>
          </div>
        </div>

        <ListTasks
          taskArray={getDescendants(appState.taskArray, task.id)}
          parentId={task.id}
          className="listTasks"
        />
      </div>
      <EditableText initialText={task.description} />
      {/* <Note /> */}
      {isNoteVisible && <Comments />}
      {/* <ImageGenerator /> */}
    </div>
  );
});

const Comments = () => {
  const isNoteVisible = appState.isNoteVisible;
  const positionComments = {
    transform: isNoteVisible ? "translateX(0)" : "translateX(100%)",
    transition: "transform 0.1 ease-out",
    bottom: 0,
    width: "100%",
    padding: "1rem",
  };

  return (
    <div style={positionComments} className="comments fixed z-20 bg-slate-900">
      <input
        type="text"
        className="note__comments w-full border-b-[1px] p-2 rounded-md focus:outline-none focus:border-b-2 focus:border-blue-500"
        placeholder="Комментарий к задаче..."
      />
    </div>
  );
};

export default Note;

const Parent: any = ({ title, task }: { title: string; task: object }) => {
  return (
    <div
      onClick={() => appState.setMainTask(task)}
      className="parent cursor-pointer flex flex-row text-sm"
    >
      <div className="truncate max-w-[150px]">{title}</div>
    </div>
  );
};
