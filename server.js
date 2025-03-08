const express = require('express');
const app = express();
const http = require('http').createServer(app);
const path = require('path');
const uuid = require('uuid');

const messages = [];
const clients = {};

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  const clientId = generateClientId(req);
  clients[clientId] = true;
  res.sendFile(__dirname + '/index.html');
});

app.get('/events', (req, res) => 
{
  const clientId = generateClientId(req);
  
  if (!clients[clientId]) {
    res.status(401).send('Unauthorized');
    return;
  }

  console.log(clients);

  if (messages.length === 0) {
    // Long polling: wait for 20 seconds before responding
    setTimeout(() => {
      res.json([]);
    }, 20000);
  } else {
    const messagesCopy = messages.slice();
    messages.length = 0; // Clear the messages array
    res.json(messagesCopy);
  }
});

app.post('/message', (req, res) => 
{
	
  const clientId = generateClientId(req);

  console.log(clients);
  console.log(clientId);
  
  if (!clients[clientId]) {
    res.status(401).send('Unauthorized');
    return;
  }

  const message = req.body.message;
  
  console.log(message);
  
  messages.push(message);
  res.status(200).send('Message sent!');
});

function generateClientId(req) {
  const ipAddress = req.ip;
  const browserName = req.headers['user-agent'];
  const deviceId = req.headers['device-id'];
  const namespace = 'd8f6db77-1312-4bac-8a93-2a042155301c'; //uuid.v4();
  
  //console.log(namespace);
  
  const clientId = uuid.v5(`${ipAddress}${browserName}${deviceId}`, namespace);
  return clientId;
}

const port = process.env.PORT || 3000;
http.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
