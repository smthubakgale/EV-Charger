const messageInput = document.getElementById('message');
const sendButton = document.getElementById('send');
const messagesList = document.getElementById('messages');

let eventSource = new EventSource('https://ev-charger-ashy.vercel.app/events');

function attachEventListeners() {
  eventSource.onmessage = (event) => {
    const messageItem = document.createElement('li');
    messageItem.textContent = event.data;
    messagesList.appendChild(messageItem);
  };

  eventSource.onerror = (e) => {
    console.log('EventSource connection closed' , e);
    //eventSource.close();
    //eventSource = new EventSource('https://ev-charger-ashy.vercel.app/events');
    //attachEventListeners();
  };
}

attachEventListeners();

sendButton.addEventListener('click', () => {
  const message = messageInput.value;
  fetch('https://ev-charger-ashy.vercel.app/message', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ message })
  });
  messageInput.value = '';
});