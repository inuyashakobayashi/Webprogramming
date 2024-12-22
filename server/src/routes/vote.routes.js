const express = require('express');
const router = express.Router();
const controller = require('../controllers/vote.controller');
const {checkApiKey} = require('../middleware/checkApiKey')
// Debug-Log
console.log('Routes - Controller Import:', controller);

// Definiere Routes
router.post('/lack/:token', controller.addVote);
 router.get('/lack/:token', controller.getVote);
 router.put('/lack/:token', controller.updateVote);
 router.delete('/lack/:token', controller.deleteVote);

// router.post('/lock',checkApiKey,controller.createPollLock);
// router.get('/lock/:token',checkApiKey,controller.getPollStatistikByLock);
// router.put('/lock/:token',checkApiKey,controller.updatePollByLock);
// router.delete('/lock/:token',checkApiKey,controller.deletePollByLock);

module.exports = router;
