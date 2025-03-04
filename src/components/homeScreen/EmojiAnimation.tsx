import { useState, useEffect } from "react";
// import appState from "../../../store⚡️/Appstate";

// Константы для настройки анимации
const EMOJI_COUNT = 20; // Количество эмодзи
const MIN_DELAY = 0; // Минимальная задержка перед началом анимации (в секундах)
const MAX_DELAY = 1.5; // Максимальная задержка перед началом анимации (в секундах)
const MIN_DURATION = 0.8; // Минимальная длительность анимации (в секундах)
const MAX_DURATION = 1.8; // Максимальная длительность анимации (в секундах)
const MIN_START_Y = 100; // Минимальная начальная высота (в пикселях)
const MAX_START_Y = 120; // Максимальная начальная высота (в пикселях)
const FADE_OUT_PERCENT = 80; // Процент анимации, на котором эмодзи начинают затухать
const ANIMATION_TIMEOUT = 3000; // Время, через которое анимация завершается (в миллисекундах)

const EmojiAnimation = ({
  emoji,
  onAnimationEnd,
}: {
  emoji: string;
  onAnimationEnd: () => void;
}) => {
  const [emojis, setEmojis] = useState<
    {
      id: number;
      left: number;
      delay: number;
      duration: number;
      startY: number;
    }[]
  >([]);

  // appState.isEmodjiAnimate = "";

  useEffect(() => {
    if (emoji) {
      // Создаем эмодзи с рандомными задержками, скоростями и начальными позициями
      const newEmojis = Array.from({ length: EMOJI_COUNT }, (_, i) => ({
        id: Date.now() + i,
        left: Math.random() * window.innerWidth, // Случайная позиция по горизонтали
        delay: Math.random() * (MAX_DELAY - MIN_DELAY) + MIN_DELAY, // Случайная задержка
        duration: Math.random() * (MAX_DURATION - MIN_DURATION) + MIN_DURATION, // Случайная длительность
        startY: Math.random() * (MAX_START_Y - MIN_START_Y) + MIN_START_Y, // Случайная начальная высота
      }));
      setEmojis(newEmojis);

      // Убираем эмодзи через указанное время
      const timeout = setTimeout(() => {
        setEmojis([]);
        onAnimationEnd(); // Уведомляем родительский компонент
      }, ANIMATION_TIMEOUT);

      // Очистка таймера при размонтировании компонента
      return () => clearTimeout(timeout);
    }
  }, [emoji, onAnimationEnd]);

  return (
    <>
      {/* Добавляем стили для анимации */}
      <style>
        {`
          @keyframes waveFloat {
            0% {
              transform: translateY(var(--startY)) translateX(0);
              opacity: 1;
            }
            50% {
              transform: translateY(calc(var(--startY) - 50vh)) translateX(${
                Math.random() * 40 - 20
              }px); // Волнообразное движение по X
            }
            ${FADE_OUT_PERCENT}% {
              opacity: 0; // Плавное затухание
            }
            100% {
              transform: translateY(calc(var(--startY) - 100vh)) translateX(${
                Math.random() * 40 - 20
              }px);
              opacity: 0; // Полное исчезновение
            }
          }
        `}
      </style>

      {/* Отображаем эмодзи */}
      {emojis.map((emojiData) => (
        <div
          key={emojiData.id}
          style={{
            position: "fixed",
            zIndex: 9999,
            bottom: `-${emojiData.startY}px`, // Начинаем движение за пределами нижней границы экрана
            left: emojiData.left,
            fontSize: "24px",
            animation: `waveFloat ${emojiData.duration}s linear ${emojiData.delay}s forwards`, // Применяем анимацию
            pointerEvents: "none", // Чтобы эмодзи не блокировали клики
            // Передаем начальную позицию по Y через CSS-переменную
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            "--startY": `${emojiData.startY}px`,
          }}
        >
          {emoji}
        </div>
      ))}
    </>
  );
};

export default EmojiAnimation;
