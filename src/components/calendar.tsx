import React, { useState, useEffect } from "react";
import { useSwipeable } from "react-swipeable";
import { motion, AnimatePresence } from "framer-motion";
import appState from "../../store/Appstate.ts";
import TimeSelector from "./homeScreen/time.tsx";
import Repeat from "./addTaskBlock/repeat.tsx";
// import Alert from "./notification.tsx";

interface CalendarProps {
  initialMonth?: number;
  initialYear?: number;
}

const Calendar: React.FC<CalendarProps> = ({
  initialMonth = new Date().getMonth(),
  initialYear = new Date().getFullYear(),
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(initialMonth);
  const [currentYear, setCurrentYear] = useState(initialYear);
  const [animationDirection, setAnimationDirection] = useState<
    "left" | "right"
  >("left");
  const [isPastMonthDisabled, setIsPastMonthDisabled] = useState(false);

  const firstDayOfWeek = "monday"; // TODO записать первый день недели в глобавльные настройки
  const firstDaysOfWeek = {
    monday: {
      array: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
      start: 1,
    },
    sunday: {
      array: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
      start: 0,
    },
  };

  useEffect(() => {
    const isInitialMonthAndYear =
      currentMonth === initialMonth && currentYear === initialYear;
    setIsPastMonthDisabled(isInitialMonthAndYear);
  }, [currentMonth, currentYear, initialMonth, initialYear]);

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getWeekDays = () => {
    const daysOfWeek = firstDaysOfWeek[firstDayOfWeek].array;
    return daysOfWeek;
  };

  const getCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay =
      (new Date(currentYear, currentMonth, 1).getDay() -
        firstDaysOfWeek[firstDayOfWeek].start +
        7) %
      7;
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    while (days.length % 7 !== 0) {
      days.push(null);
    }

    return days;
  };

  const handleMonthChange = (direction: "prev" | "next") => {
    if (direction === "prev" && isPastMonthDisabled) {
      return;
    }

    const newDirection = direction === "prev" ? "right" : "left";
    setAnimationDirection(newDirection);
    console.log(`Направление анимации: ${newDirection}`);

    if (direction === "prev") {
      if (currentMonth === 0) {
        setCurrentYear(currentYear - 1);
        setCurrentMonth(11);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentYear(currentYear + 1);
        setCurrentMonth(0);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  const handleDateSelect = (day: number | null) => {
    if (day !== null) {
      const date = new Date(currentYear, currentMonth, day);
      setSelectedDate(date);
      appState.setTaskData(
        "startDate",
        `${currentYear}-${currentMonth + 1}-${day}`
      );
    } else {
      setSelectedDate(null);
    }
  };

  const handleButtonClick = (daysToAdd: number | null) => {
    const today = new Date();
    let newDate: Date | null = null;

    if (daysToAdd !== null) {
      newDate = new Date(today);
      newDate.setDate(today.getDate() + daysToAdd);
    }

    setSelectedDate(newDate);
    if (newDate) {
      setCurrentMonth(newDate.getMonth());
      setCurrentYear(newDate.getFullYear());
      appState.setTaskData(
        "startDate",
        `${newDate.getFullYear()}-${
          newDate.getMonth() + 1
        }-${newDate.getDate()}`
      );
    } else {
      appState.setTaskData("startDate", "");
    }
  };

  const monthNames = [
    "Январь",
    "Февраль",
    "Март",
    "Апрель",
    "Май",
    "Июнь",
    "Июль",
    "Август",
    "Сентябрь",
    "Октябрь",
    "Ноябрь",
    "Декабрь",
  ];

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleMonthChange("next"),
    onSwipedRight: () => {
      if (!isPastMonthDisabled) {
        handleMonthChange("prev");
      }
    },
    trackMouse: true,
  });

  return (
    <div className="calendar min-h-[60vh]" {...swipeHandlers}>
      <div className="calendar-buttons grid grid-cols-4 gap-2 mb-2">
        <button
          className="calendar-button"
          onClick={() => handleButtonClick(0)} // Сегодня
        >
          Сегодня
        </button>
        <button
          className="calendar-button"
          onClick={() => handleButtonClick(1)} // Завтра
        >
          Завтра
        </button>
        <button
          className="calendar-button"
          onClick={() => handleButtonClick(7)} // Через неделю
        >
          Через неделю
        </button>
        <button
          className="calendar-button"
          onClick={() => handleButtonClick(null)} // Без даты
        >
          Без даты
        </button>
      </div>
      <div className="calendar-header flex justify-between items-center">
        <button
          className="w-8 text-center"
          onClick={() => handleMonthChange("prev")}
          disabled={isPastMonthDisabled}
        >
          &lt;
        </button>
        <h2 className="text-center flex-1">
          {monthNames[currentMonth]} {currentYear}
        </h2>
        <button
          className="w-8 text-center"
          onClick={() => handleMonthChange("next")}
        >
          &gt;
        </button>
      </div>
      <div className="calendar-weekdays grid grid-cols-7 gap-1">
        {getWeekDays().map((day, index) => (
          <div className="text-center text-slate-500" key={index}>
            {day}
          </div>
        ))}
      </div>
      <div className="calendar-grid-container overflow-hidden relative">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`${currentYear}-${currentMonth}`}
            initial={{
              x: animationDirection === "left" ? 100 : -100,
              opacity: 0,
            }}
            animate={{ x: 0, opacity: 1 }}
            // exit={{ x: animationDirection === "left" ? -100 : 100, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="calendar-grid grid grid-cols-7 gap-1 w-full"
          >
            {getCalendarDays().map((day, index) => {
              const isSelected =
                selectedDate &&
                selectedDate.getFullYear() === currentYear &&
                selectedDate.getMonth() === currentMonth &&
                selectedDate.getDate() === day;

              const isToday =
                new Date().getDate() === day &&
                new Date().getMonth() === currentMonth &&
                new Date().getFullYear() === currentYear;

              return (
                <div
                  key={index}
                  className={`calendar-day ${isSelected ? "selected" : ""} ${
                    isToday ? "today" : ""
                  }`}
                  onClick={() => handleDateSelect(day)}
                >
                  <span className="inline-block w-7 h-7 rounded-full calendar-day-number">
                    {day ? day : ""}
                  </span>
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
      {appState.taskData.startDate && <TimeSelector />}
      <Repeat />
      <div className="calendar-footer grid grid-cols-2 gap-2 mt-5">
        <button
          className="w-full py-2 bg-gray-500 hover:bg-gray-500 rounded"
          onClick={() => {
            handleButtonClick(null);
            appState.hideTaskModal();
          }} // Отменить
        >
          Отменить
        </button>
        <button
          className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
          onClick={() => {
            appState.hideTaskModal();
          }} // Выбрать
        >
          Выбрать
        </button>
      </div>
    </div>
  );
};

export default Calendar;
