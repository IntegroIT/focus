import React, { useState } from "react";

interface CalendarProps {
  initialMonth?: number; // 0 - январь, 11 - декабрь
  initialYear?: number;
}

const Calendar: React.FC<CalendarProps> = ({
  initialMonth = new Date().getMonth(),
  initialYear = new Date().getFullYear(),
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(initialMonth);
  const [currentYear, setCurrentYear] = useState(initialYear);

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getWeekDays = () => {
    const daysOfWeek = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
    return daysOfWeek;
  };

  const getCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = (new Date(currentYear, currentMonth, 1).getDay() + 6) % 7; // 0 - воскресенье, 6 - суббота
    const days = [];

    // Заполняем пустые ячейки перед первым днем месяца
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Заполняем ячейки днями месяца
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    // Заполняем оставшиеся ячейки пустыми
    while (days.length % 7 !== 0) {
      days.push(null);
    }

    return days;
  };

  const handleMonthChange = (direction: "prev" | "next") => {
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

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button onClick={() => handleMonthChange("prev")}>&lt;</button>
        <h2>
          {monthNames[currentMonth]} {currentYear}
        </h2>
        <button onClick={() => handleMonthChange("next")}>&gt;</button>
      </div>
      <div className="calendar-weekdays grid grid-cols-7 gap-1">
        {getWeekDays().map((day, index) => (
          <div className="text-center" key={index}>
            {day}
          </div>
        ))}
      </div>
      <div className="calendar-grid grid grid-cols-7 gap-1">
        {getCalendarDays().map((day, index) => (
          <div
            key={index}
            className={
              selectedDate && selectedDate.getDate() === day
                ? "calendar-day selected"
                : "calendar-day"
            }
            onClick={() => handleDateSelect(day)}
          >
            <span className="inline-block w-7 h-7 rounded-full calendar-day-number">
              {day ? day : ""}
            </span>
          </div>
        ))}
      </div>
      {selectedDate && (
        <div className="selected-date">
          <h3>Выбранная дата:</h3>
          <p>
            {selectedDate.toLocaleDateString("ru-RU", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      )}
    </div>
  );
};

export default Calendar;
