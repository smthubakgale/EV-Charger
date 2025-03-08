const http = require('http');
const express = require('express');
const app = express();

const clients = {};
let clientId = 0;

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
  let body = '';
  req.on('data', (chunk) => {
    body += chunk.toString();
  });
  req.on('end', () => {
    const message = JSON.parse(body).message;
    for (const client in clients) {
      clients[client].write(`event: message\n`);
      clients[client].write(`data: ${message}\n\n`);
    }
    res.status(200).send('Message sent!');
  });
});

const server = http.createServer(app);
server.listen(3000, () => {
  console.log('Server listening on port 3000');
});