const express = require('express');
const WebSocket = require('ws');
const { createServer } = require('@vercel/node');

const app = express();

app.get('/', (req, res) => {
  res.send('EV-Charger Server');
});

const wss = new WebSocket.Server({ noServer: true });

wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', (message) => {
    console.log(`Received message: ${message}`);
    ws.send(`Server response: ${message}`);
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

const server = createServer(app, (req, res, head) => {
  wss.handleUpgrade(req, req.socket, head, (ws) => {
    wss.emit('connection', ws, req);
  });
});

module.exports = server;