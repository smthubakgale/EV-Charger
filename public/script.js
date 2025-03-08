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
      setTimeout(fetchMessages, 1000);
    });
}

sendButton.addEventListener('click', () => {
  const message = messageInput.value;
  fetch(`https://ev-charger-ashy.vercel.app/message?message=${message}`)
    .then((response) => {
      if (response.ok) {
        console.log('Message sent successfully!');
      } else {
        console.log('Failed to send message.');
      }
    })
    .catch((error) => {
      console.error('Error sending message:', error);
    });
  messageInput.value = '';
});