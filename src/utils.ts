export const changeBottom = () => {
  const innerHeight = window.innerHeight;
  const visualViewport = window.visualViewport?.height;
  if (visualViewport && innerHeight - visualViewport > 100)
    return innerHeight - visualViewport;
  else return 0;
};

export const changeHeight = () => {
  const innerHeight = window.innerHeight;
  const visualViewport = window.visualViewport?.height;
  if (visualViewport && innerHeight - visualViewport > 100)
    return innerHeight - visualViewport;
  else return 0;
};

// import { handleResize, updateBodyHeight } from "./updateBodyHeight";

// Функция для обновления высоты body
const updateBodyHeight = () => {
  const innerHeight = window.innerHeight;
  const visualViewportHeight = window.visualViewport?.height || innerHeight;

  // Определяем, открыта ли клавиатура (разница > 100px)
  const isKeyboardOpen = Math.abs(innerHeight - visualViewportHeight) > 100;

  // Устанавливаем высоту body
  document.body.style.height = isKeyboardOpen
    ? `${visualViewportHeight}px`
    : `${innerHeight}px`;

  // Для отладки (можно удалить)
  console.log(
    `innerHeight: ${innerHeight}, visualViewport: ${visualViewportHeight}`
  );
  // alert(`innerHeight: ${innerHeight}, visualViewport: ${visualViewportHeight}`);
};

// Оптимизация: throttle для частых событий
let isUpdating = false;
export const handleResize = () => {
  if (!isUpdating) {
    isUpdating = true;
    requestAnimationFrame(() => {
      updateBodyHeight();
      isUpdating = false;
    });
  }
};

// Инициализация при загрузке
document.addEventListener("DOMContentLoaded", () => {
  // Первоначальная установка высоты
  updateBodyHeight();

  // Подписка на события
  window.addEventListener("resize", handleResize);

  // Для мобильных устройств (клавиатура)
  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", handleResize);
  }
});

// Отписка (если используется в SPA, например, React/React)
export const cleanupResizeListeners = () => {
  window.removeEventListener("resize", handleResize);
  if (window.visualViewport) {
    window.visualViewport.removeEventListener("resize", handleResize);
  }
};
