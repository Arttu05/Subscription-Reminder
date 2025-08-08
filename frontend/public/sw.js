self.addEventListener('push', (event) => {

    console.log(event.data)
    const notificationData = event.data.json()

    const title = notificationData.title
    const message = notificationData.message

    const options = {
        body: message,
        icon: "https://192.168.100.33:5173/icon.png"
    }

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
})