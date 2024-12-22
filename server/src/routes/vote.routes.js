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

router.post('/lock/:token', checkApiKey, controller.addVote);
router.get('/lock/:token', checkApiKey, controller.getVote);
router.put('/lock/:token', checkApiKey, controller.updateVote);
router.delete('/lock/:token', checkApiKey, controller.deleteVote);

module.exports = router;
