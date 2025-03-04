import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
// import appState from "../../store⚡️/Appstate.ts"; // Путь до вашего хранилища

interface AdaptiveHeightProps {
  children: React.ReactNode; // Тип для children
}

const AdaptiveHeight: React.FC<AdaptiveHeightProps> = observer(
  ({ children }) => {
    // Подписываемся на изменение визуального viewport
    useEffect(() => {
      const handleResize = () => {
        if (window.visualViewport) {
          const newHeight = window.visualViewport.height;
          const heightDifference = window.innerHeight - newHeight; // Разница высот
          console.log(`Разница высот: ${heightDifference}px`); // Выводим в консоль

          // Находим div с классом addTaskInput
          const addTaskInputElement = document.querySelector(
            ".addTaskInput"
          ) as HTMLElement;

          // Применяем смещение к div с классом addTaskInput
          if (addTaskInputElement) {
            addTaskInputElement.style.bottom = `${heightDifference}px`;
          }

          // Фиксируем положение контента
          document.body.style.position = "fixed";
          document.body.style.top = `-${window.scrollY}px`;
          document.body.style.width = "100%";
        }
      };

      const handleResizeEnd = () => {
        // Восстанавливаем положение контента
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";

        // Восстанавливаем исходное положение div с классом addTaskInput
        const addTaskInputElement = document.querySelector(
          ".addTaskInput"
        ) as HTMLElement;
        if (addTaskInputElement) {
          addTaskInputElement.style.bottom = "0";
        }
      };

      // Подписываемся на изменение визуального viewport
      if (window.visualViewport) {
        window.visualViewport.addEventListener("resize", handleResize);
        window.visualViewport.addEventListener("scroll", handleResizeEnd);
      }

      // Отписываемся от событий при размонтировании компонента
      return () => {
        if (window.visualViewport) {
          window.visualViewport.removeEventListener("resize", handleResize);
          window.visualViewport.removeEventListener("scroll", handleResizeEnd);
        }

        // Восстанавливаем положение контента
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";

        // Восстанавливаем исходное положение div с классом addTaskInput
        const addTaskInputElement = document.querySelector(
          ".addTaskInput"
        ) as HTMLElement;
        if (addTaskInputElement) {
          addTaskInputElement.style.bottom = "0";
        }
      };
    }, []);

    return (
      <div
        style={{
          height: "100vh", // Занимаем всю высоту видимой области
          overflowY: "auto", // Добавляем скролл, если контент превышает высоту
          // padding: "20px", // Пример стилей (можно настроить под ваши нужды)
          backgroundColor: "#f0f0f0", // Пример стилей
        }}
      >
        {children}
      </div>
    );
  }
);

export default AdaptiveHeight;
