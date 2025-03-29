import { useState, useEffect } from "react";

export const getKeyboardHeight = (): number => {
  // 1. Проверяем, что это мобильное устройство (на десктопах клавиатура не перекрывает экран)
  const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent);
  if (!isMobile) return 0;

  // 2. Получаем размеры экрана
  const isIOS = /iPhone|iPad/i.test(navigator.userAgent);
  const screenHeight = isIOS ? window.outerHeight : window.screen.height;
  const viewportHeight = window.innerHeight;

  // 3. Вычисляем разницу (это и будет высота клавиатуры)
  const keyboardHeight = screenHeight - viewportHeight;

  // 4. Возвращаем 0, если разница незначительна (клавиатура закрыта)
  return keyboardHeight > 50 ? keyboardHeight : 0;
};

export const useKeyboardHeight = (): number => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const handleFocus = () => {
      setTimeout(() => {
        setKeyboardHeight(getKeyboardHeight());
      }, 300);
    };

    const handleBlur = () => {
      setKeyboardHeight(0); // Сбрасываем высоту при потере фокуса
    };

    const inputs = Array.from(
      document.querySelectorAll('input, textarea, [contenteditable="true"]')
    );

    inputs.forEach((input) => {
      input.addEventListener("focus", handleFocus);
      input.addEventListener("blur", handleBlur);
    });

    return () => {
      inputs.forEach((input) => {
        input.removeEventListener("focus", handleFocus);
        input.removeEventListener("blur", handleBlur);
      });
    };
  }, []);

  return keyboardHeight;
};
