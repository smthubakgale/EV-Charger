const messageInput = document.getElementById('message');
const sendButton = document.getElementById('send');
const messagesList = document.getElementById('messages');

fetchMessages();

function fetchMessages() {
  fetch(`https://ev-charger-ashy.vercel.app/events`)
    .then((response) => response.json())
    .then((messages) => {
		
	  console.log(messages);
		
      messages.forEach((message) => {
        const messageItem = document.createElement('li');
        messageItem.textContent = message;
        messagesList.appendChild(messageItem);
      });
      // Long polling: fetch messages again after 1 second
      //setTimeout(fetchMessages, 1000);
    });
}

sendButton.addEventListener('click', () => {
  const message = messageInput.value;
  fetch('https://ev-charger-ashy.vercel.app/message', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ clientId, message })
  });
  messageInput.value = '';
});