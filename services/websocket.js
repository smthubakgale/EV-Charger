exports.handleConnection = (socket) => {
  console.log('New connection established');

  socket.on('disconnect', () => {
    console.log('Connection disconnected');
  });

  socket.on('message', (message) => {
    console.log(`Received message: ${message}`);
  });
};