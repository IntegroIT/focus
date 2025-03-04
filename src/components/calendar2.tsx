import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CalendarComponent = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false); // Добавлен setShowCalendar

  const handleDateChange = (date: any) => {
    setStartDate(date);
  };

  return (
    <div>
      <button onClick={() => setShowCalendar(!showCalendar)}>
        Показать календарь
      </button>
      {showCalendar && (
        <DatePicker
          selected={startDate}
          onChange={handleDateChange}
          className="custom-datepicker"
        />
      )}
    </div>
  );
};

export default CalendarComponent;
