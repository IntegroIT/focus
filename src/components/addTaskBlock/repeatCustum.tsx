import { useState } from "react";

const RepeatCustom = () => {
  const [selectedFrequency, setSelectedFrequency] = useState("Ежедневно");
  const [intervalValue, setIntervalValue] = useState("");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedMonthDate, setSelectedMonthDate] = useState<number | null>(
    null
  );
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedYearDay, setSelectedYearDay] = useState<number | null>(null);
  const greenColor = "green";

  const handleSave = () => {
    const type = typeOfInterval();
    const data = {
      type,
      interval: intervalValue,
      days: selectedDays,
      monthDate: selectedMonthDate,
      month: selectedMonth,
      yearDay: selectedYearDay,
    };
    console.log(data);
  };

  const typeOfInterval = () => {
    if (selectedFrequency === "Ежедневно") {
      return "daily";
    } else if (selectedFrequency === "Еженедельно") {
      return "weekly";
    } else if (selectedFrequency === "Ежемесячно") {
      return "monthly";
    } else if (selectedFrequency === "Ежегодно") {
      return "yearly";
    } else {
      return "daily";
    }
  };

  const getIntervalUnit = () => {
    switch (selectedFrequency) {
      case "Ежедневно":
        return "д";
      case "Еженедельно":
        return "н";
      case "Ежемесячно":
        return "м";
      case "Ежегодно":
        return "г";
      default:
        return "";
    }
  };

  const daysOfWeek = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

  const handleDayClick = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
      console.log(selectedDays);
      console.log(day);
    }
  };

  const months = [
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
    <div className="flex flex-col gap-4 min-h-80">
      <div className="flex gap-2">
        <label htmlFor="frequency" className="text-gray-700">
          Повторять:
        </label>
        <select
          id="frequency"
          value={selectedFrequency}
          onChange={(e) => setSelectedFrequency(e.target.value)}
          className="border border-gray-300 rounded-md p-2"
        >
          <option value="Ежедневно">Ежедневно</option>
          <option value="Еженедельно">Еженедельно</option>
          <option value="Ежемесячно">Ежемесячно</option>
          <option value="Ежегодно">Ежегодно</option>
        </select>
      </div>

      <div className="flex gap-2">
        <label htmlFor="interval" className="text-gray-700">
          Повторять с интервалом:
        </label>
        <input
          type="number"
          id="interval"
          value={intervalValue}
          onChange={(e) => setIntervalValue(e.target.value)}
          className="border border-gray-300 rounded-md p-2"
        />
        {getIntervalUnit()}
      </div>

      {selectedFrequency === "Еженедельно" && (
        <div className="flex flex-wrap gap-2">
          {daysOfWeek.map((day) => (
            <button
              key={day}
              onClick={() => handleDayClick(day)}
              className={`rounded-full px-4 py-2 border border-white text-white ${
                selectedDays.includes(day) ? `bg-${greenColor}` : "bg-green-300"
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      )}

      {selectedFrequency === "Ежемесячно" && (
        <select
          value={selectedMonthDate ?? ""}
          onChange={(e) => setSelectedMonthDate(parseInt(e.target.value, 10))}
          className="border border-gray-300 rounded-md p-2"
        >
          <option value="">Выберите дату</option>
          {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
            <option key={day} value={day}>
              {day}
            </option>
          ))}
        </select>
      )}

      {selectedFrequency === "Ежегодно" && (
        <div className="flex gap-2">
          <label htmlFor="month" className="text-gray-700">
            Месяц:
          </label>
          <select
            id="month"
            value={selectedMonth ?? ""}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value, 10))}
            className="border border-gray-300 rounded-md p-2"
          >
            <option value="">Выберите месяц</option>
            {months.map((month, index) => (
              <option key={index} value={index + 1}>
                {month}
              </option>
            ))}
          </select>

          <label htmlFor="yearDay" className="text-gray-700">
            День:
          </label>
          <select
            id="yearDay"
            value={selectedYearDay ?? ""}
            onChange={(e) => setSelectedYearDay(parseInt(e.target.value, 10))}
            className="border border-gray-300 rounded-md p-2 "
          >
            <option value="">Выберите день</option>
            {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
        </div>
      )}
      <button
        onClick={handleSave}
        className="bg-blue-500 text-white px-4 py-2 rounded-md w-full"
      >
        Сохранить
      </button>
    </div>
  );
};

export default RepeatCustom;
