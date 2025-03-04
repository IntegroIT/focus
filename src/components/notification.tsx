import React, { useState, useEffect } from "react";

const Alert: React.FC = () => {
  const [notificationPermission, setNotificationPermission] =
    useState<NotificationPermission | null>(null);

  useEffect(() => {
    // Проверка поддержки Notification API
    if (!("Notification" in window)) {
      console.error("Браузер не поддерживает Notification API.");
      return;
    }

    // Запрос разрешения на отправку уведомлений
    Notification.requestPermission().then((permission) => {
      setNotificationPermission(permission);
      console.log("Разрешение на уведомления:", permission);
    });
  }, []);

  const sendNotification = () => {
    console.log("Вызов функции sendNotification");
    if (notificationPermission === "granted") {
      // Создание уведомления
      const notification = new Notification("Сообщение из приложения", {
        body: "Это уведомление было отправлено через setTimeout!",
        // icon: 'path/to/your/icon.png',
        dir: "ltr",
        lang: "ru",
        tag: "my-notification",
        // renotify: true,
        requireInteraction: false,
        silent: false,
      });
      console.log("Уведомление отправлено:", notification);

      // Закрытие уведомления через 5 секунд
      setTimeout(() => {
        notification.close();
      }, 5000);
    } else {
      console.error("Пользователь запретил отправку уведомлений.");
      // alert("Пользователь запретил отправку уведомлений.");
    }
  };

  return (
    <div>
      <button onClick={sendNotification}>Отправить уведомление</button>
    </div>
  );
};

export default Alert;
