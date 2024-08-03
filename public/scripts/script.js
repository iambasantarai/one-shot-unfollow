const notification = document.getElementById('info');
const close = document.getElementById('close');

const hideNotification = () => {
  notification.style.display = 'none';
};

setTimeout(hideNotification, 3000);

close.addEventListener('click', hideNotification);
