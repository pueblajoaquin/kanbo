const express = require('express');
const {create, deleteP, getAllProject,getById} = require('../controllers/projectController');
const {authenticate} = require('../middlewares/authMiddleware');


const router = express.Router();

router.post('/',authenticate,create);
router.get('/',authenticate,getAllProject);
router.get('/:id',authenticate,getById);
router.delete('/:id',authenticate,deleteP)

module.exports = router;