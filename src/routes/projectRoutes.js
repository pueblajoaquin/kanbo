const express = require('express');
const {create} = require('../controllers/projectController');
const {authenticate} = require('../middlewares/authMiddleware');


const router = express.Router();

router.post('/project',authenticate,create);

module.exports = router;