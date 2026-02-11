const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');

// POST /api/upload
router.post('/', uploadController.uploadMiddleware, uploadController.uploadFile);

module.exports = router;
