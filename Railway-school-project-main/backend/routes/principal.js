const express = require('express');
const router = express.Router();
const principalController = require('../controllers/principal');

// Routes for Principal Approval
router.get('/pending-users', principalController.getPendingUsers);
router.post('/decide-user', principalController.handleUserDecision);

// 🔥 THIS LINE IS THE MOST IMPORTANT:
module.exports = router;