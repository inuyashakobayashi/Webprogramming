const express = require('express');
const router = express.Router();
const controller = require('../controllers/user.controller');
const {checkApiKey} = require('../middleware/checkApiKey')
// Debug-Log
console.log('Routes - Controller Import:', controller);

// Definiere Routes
router.post('/', controller.addUser);
router.post('/key',controller.addKey);
router.get('/:username',controller.findUserByName);
router.delete('/:username',checkApiKey,controller.deleteUserByName);



module.exports = router;
