// src/routes/poll.routes.js
const express = require('express');
const router = express.Router();

// Debug-Import
const pollController = require('../controllers/poll.controller');
console.log('Controller Import:', pollController);  // Prüft ob Import funktioniert

router.post('/lack', pollController.createPollLack);
router.get('/lack/:token', pollController.getPollStatistik);

module.exports = router;