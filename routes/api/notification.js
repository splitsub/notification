const express = require('express');
const router = express.Router();

const notificationController = require('../../controllers/notification');

router.route('/')
    .post(notificationController.notification);

module.exports = router;