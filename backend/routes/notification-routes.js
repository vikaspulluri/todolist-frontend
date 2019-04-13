const express = require('express');
const router = express.Router();

const {decodeToken, checkUser} = require('../middleware/check-auth');
const validateRequest = require('../middleware/validate-request');
const notificationController = require('../controllers/notification-controller');

router.post('/add', decodeToken,
                    checkUser,
                    validateRequest('NC-AN-1', 'message', 'sender', 'type', 'status', 'receivers'),
                    notificationController.addNotification)

module.exports = router;