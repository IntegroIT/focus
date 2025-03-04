import React, { useState, useEffect } from "react";

function Not() {
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null
  );
  const [scheduledTime, setScheduledTime] = useState<Date | null>(null);

  useEffect(() => {
    // Проверка поддержки Push API
    if ("serviceWorker" in navigator && "PushManager" in window) {
      navigator.serviceWorker
        .register("serviceWorker.js")
        .then((registration) => {
          // Запрос разрешения на Push-уведомления
          Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
              // Создание подписки
              registration.pushManager
                .subscribe({
                  userVisibleOnly: true,
                  applicationServerKey:
                    "BIflI4IjEVBLLcdc449GT1So_yeb8DfqKFu8diUq_oAErUIMSPae284rnRQAhqxE_MrkCPfyRdet3_RusqM6VEQ", // Ваш публичный ключ VAPID
                })
                .then((subscription) => {
                  setSubscription(subscription);
                })
                .catch((error) => {
                  console.error(
                    "Error subscribing to push notifications:",
                    error
                  );
                });
            }
          });
        })
        .catch((error) => {
          console.error("Error registering service worker:", error);
        });
    }
  }, []);

  // Отправка ключа подписки и времени на сервер
  const sendSubscriptionToServer = async () => {
    if (subscription && scheduledTime) {
      try {
        const response = await fetch("/api/subscribe", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            subscription: subscription,
            scheduledTime: scheduledTime.getTime(),
          }),
        });

        if (response.ok) {
          console.log(
            "Subscription and scheduled time sent to server successfully!"
          );
        } else {
          console.error(
            "Error sending subscription to server:",
            response.status
          );
        }
      } catch (error) {
        console.error("Error sending subscription to server:", error);
      }
    }
  };

  // Функция для изменения времени отправки
  const handleScheduledTimeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setScheduledTime(new Date(event.target.value));
  };

  // Кнопка для отправки ключа подписки и времени
  const handleSendSubscription = () => {
    sendSubscriptionToServer();
  };

  return (
    <div>
      <input type="datetime-local" onChange={handleScheduledTimeChange} />
      <button onClick={handleSendSubscription}>Отправить</button>
    </div>
  );
}

export default Not;
