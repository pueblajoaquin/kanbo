const express = require('express')
const { updateTaskStatusController, deleteTaskController } = require('../controllers/taskController')
const { authenticate } = require('../middlewares/authMiddleware')
const router = express.Router()

/**
 * @openapi
 * /tasks/{id}:
 *   patch:
 *     summary: Update a task's status
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, in_progress, done]
 *     responses:
 *       200:
 *         description: Task updated
 *       404:
 *         description: Task not found or user is not a project member
 */
router.patch('/:id', authenticate, updateTaskStatusController)

/**
 * @openapi
 * /tasks/{id}:
 *   delete:
 *     summary: Delete a task
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Task deleted
 *       404:
 *         description: Task not found, or user is neither its creator nor the project owner
 */
router.delete('/:id', authenticate, deleteTaskController)

module.exports = router
