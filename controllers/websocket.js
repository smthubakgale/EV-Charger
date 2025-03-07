const websocketService = require('../services/websocket');

exports.handleConnection = (socket) => {
  websocketService.handleConnection(socket);
};