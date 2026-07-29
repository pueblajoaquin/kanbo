const express = require('express')
const { createProjectController, deleteProjectController, getUserProjectController, getProjectByIdController } = require('../controllers/projectController')
const { authenticate } = require('../middlewares/authMiddleware')
const { createTaskController, getProjectTasksController } = require('../controllers/taskController')

const router = express.Router()

router.post('/', authenticate, createProjectController)
router.get('/', authenticate, getUserProjectController)
router.get('/:id', authenticate, getProjectByIdController)
router.delete('/:id', authenticate, deleteProjectController)

router.post('/:id/tasks', authenticate, createTaskController)
router.get('/:id/tasks', authenticate, getProjectTasksController)

module.exports = router
