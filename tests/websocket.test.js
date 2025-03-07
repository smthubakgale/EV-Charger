const WebSocket = require('ws');
const app = require('../app');
const server = require('http').createServer(app);
const wss = new WebSocket.Server({ server });

describe('WebSocket connection', () => {
  it('should establish a connection', async () => {
    const ws = new WebSocket('ws://localhost:3000/websockets');
    await new Promise((resolve) => {
      ws.on('open', () => {
        resolve();
      });
    });
    expect(ws.readyState).toBe(WebSocket.OPEN);
  });
});