const express = require('express');
const router = express.Router();

const notificationDumpController = require('../../controllers/notificationDump');

router.route('/')
    .get(notificationDumpController.get);

module.exports = router;