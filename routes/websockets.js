const express = require('express');
const router = express.Router();
const websocketController = require('../controllers/websocket');

router.get('/websockets', websocketController.index);

module.exports = router;