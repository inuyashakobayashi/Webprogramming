const express = require('express');
const router = express.Router();
const controller = require('../controllers/poll.controller');

// Debug-Log
console.log('Routes - Controller Import:', controller);

// Definiere Routes
router.post('/lack', controller.createPollLack);
router.get('/lack/:token', controller.getPollStatistik);
router.put('/lack/:token', controller.updatePoll);
router.delete('/lack/:token', controller.deletePoll);

module.exports = router;