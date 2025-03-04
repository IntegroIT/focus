self.addEventListener("push", function (event) {
  const data = event.data.json();
  console.log("[Service Worker] Push data:", data);

  const notification = new Notification(data.title, {
    body: data.body,
    icon: "/your-icon.png",
  });

  notification.addEventListener("click", function () {
    clients.openWindow("/"); // Перенаправление на главную страницу
  });
});
