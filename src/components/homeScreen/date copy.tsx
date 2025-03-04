import React, { useState } from "react";

interface DateComponentProps {
  dateString: string;
}

const DateComponent: React.FC<DateComponentProps> = ({ dateString }) => {
  const [isExpired, setIsExpired] = useState(false);

  // Преобразуем строку даты в объект Date
  const date = new Date(dateString);

  // Проверяем, просрочена ли дата
  const isDateExpired = () => {
    const currentDate = new Date();
    return date < currentDate;
  };

  // Вызываем функцию проверки при монтировании компонента
  React.useEffect(() => {
    setIsExpired(isDateExpired());
  }, []);

  // Форматируем дату
  const formattedDate = date.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  // Возвращаем блок с датой и стилями
  return (
    <div className={`date-block ${isExpired ? "expired" : ""}`}>
      {formattedDate}
    </div>
  );
};

export default DateComponent;
