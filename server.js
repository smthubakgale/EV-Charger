const express = require('express');
const app = express();
const http = require('http').createServer(app);

const clients = {};
let clientId = 0;

app.use(express.json());

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

  req.on('close', () => {
    delete clients[id];
  });
});

app.post('/message', (req, res) => {
  const message = req.body.message;
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