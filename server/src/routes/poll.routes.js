const express = require('express');
const router = express.Router();
const controller = require('../controllers/poll.controller');
const {checkApiKey} = require('../middleware/checkApiKey')
// Debug-Log
console.log('Routes - Controller Import:', controller);

// Definiere Routes
router.post('/lack', controller.createPollLack);
router.get('/lack/:token', controller.getPollStatistik);
router.put('/lack/:token', controller.updatePoll);
router.delete('/lack/:token', controller.deletePoll);

router.post('/lock',checkApiKey,controller.createPollLock);
router.get('/lock/:token',checkApiKey,controller.getPollStatistikByLock);
router.put('/lock/:token',checkApiKey,controller.updatePollByLock);
router.delete('/lock/:token',checkApiKey,controller.deletePollByLock);

module.exports = router;