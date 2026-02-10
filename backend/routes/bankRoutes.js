const express = require('express');
const router = express.Router();
const bankController = require('../controllers/bankController');

router.post('/validate', bankController.validateBankAccount);

module.exports = router;
