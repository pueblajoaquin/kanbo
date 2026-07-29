const express = require('express')
const { updateTaskStatusController, deleteTaskController } = require('../controllers/taskController')
const { authenticate } = require('../middlewares/authMiddleware')
const router = express.Router()

router.patch('/:id', authenticate, updateTaskStatusController)
router.delete('/:id', authenticate, deleteTaskController)

module.exports = router
