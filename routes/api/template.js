const express = require('express');
const router = express.Router();

const templateController = require('../../controllers/template');

router.route('/name/:name')
    .get(templateController.getByName);

router.route('/')
    .get(templateController.get)
    .post(templateController.create)
    .put(templateController.updateByName)
    .delete(templateController.deleteByName);

module.exports = router;