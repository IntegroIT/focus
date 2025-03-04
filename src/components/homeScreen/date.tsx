// import React, { useState } from "react";

interface DateComponentProps {
  dateString: string;
  time?: string;
}

const DateComponent: React.FC<DateComponentProps> = ({ dateString, time }) => {
  // const [isExpired, setIsExpired] = useState(false);

  // Преобразуем строку даты в объект Date
  const date = new Date(dateString);

  // Проверяем, просрочена ли дата
  const isDateExpired = () => {
    const currentDate = new Date();
    console.log("currentDate", currentDate);
    return date < currentDate;
  };

  // Вызываем функцию проверки при монтировании компонента
  // React.useEffect(() => {
  //   setIsExpired(isDateExpired());
  // }, []);

  // Форматируем дату
  const formattedDate = () => {
    // setIsExpired(isDateExpired());
    const currentDate = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(currentDate.getDate() + 1);

    if (
      date.getDate() === currentDate.getDate() &&
      date.getMonth() === currentDate.getMonth() &&
      date.getFullYear() === currentDate.getFullYear()
    ) {
      return "Сегодня";
    } else if (
      date.getDate() === tomorrow.getDate() &&
      date.getMonth() === tomorrow.getMonth() &&
      date.getFullYear() === tomorrow.getFullYear()
    ) {
      return "Завтра";
    } else {
      const monthNames = [
        "янв",
        "фев",
        "мар",
        "апр",
        "май",
        "июн",
        "июл",
        "авг",
        "сен",
        "окт",
        "ноя",
        "дек",
      ];
      const year =
        date.getFullYear() !== currentDate.getFullYear()
          ? `${date.getFullYear()}`
          : "";
      return `${date.getDate()}.${monthNames[date.getMonth()]} ${year}`;
    }
  };

  // Возвращаем блок с датой и стилями
  return (
    <div className={`date-block ${isDateExpired() ? "expired" : ""}`}>
      {formattedDate()} {time && time}
    </div>
  );
};

export default DateComponent;
