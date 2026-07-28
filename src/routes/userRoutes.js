const express = require('express');
const {getUserByIdController} = require('../controllers/userController');
const {authenticate} = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/me',authenticate,getUserByIdController);

module.exports = router;