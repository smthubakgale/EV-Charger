const express = require('express');
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const websocketController = require('./controllers/websocket');

const app = express();

app.use(express.static('public'));

io.on('connection', (socket) => {
  websocketController.handleConnection(socket);
});

http.listen(3000, () => {
  console.log('Server listening on port 3000');
});
