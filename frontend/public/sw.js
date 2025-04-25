self.addEventListener('push', (event) => {

    const notificationData = JSON.parse(event.data)

    const title = notificationData.title
    const message = notificationData.message

    const options = {
        body: message,
        icon: "http://192.168.100.33:5173/icon.svg"
    }

    self.registration.showNotification(title,options)
})