const express = require('express');
const app = express();
const http = require('http').createServer(app);
const path = require('path');

const clients = {};
let clientId = 0;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/events', (req, res) => {
  const id = clientId++;
  clients[id] = res;

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });

  // Send heartbeat messages every 20 seconds
  const heartbeatInterval = setInterval(() => {
    res.write(`event: heartbeat\n`);
    res.write(`data: \n\n`);
  }, 20000);

  console.log("A");
  req.on('close', () => {
    delete clients[id];
    clearInterval(heartbeatInterval);
	
	console.log("Exiting " + id);
  });
});

app.post('/message', (req, res) => {
  const message = req.body.message;
  
  console.log(message);
  
  for (const client in clients) {
    clients[client].write(`event: message\n`);
    clients[client].write(`data: ${message}\n\n`);
  }
  res.status(200).send('Message sent!');
});

const port = process.env.PORT || 3000;
http.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});