const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('EV-Charger Server');
});

app.get('/test', (req, res) => {
  res.send('Test route');
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
