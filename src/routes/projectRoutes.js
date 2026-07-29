const express = require('express')
const { createProjectController, deleteProjectController, getUserProjectController, getProjectByIdController } = require('../controllers/projectController')
const { authenticate } = require('../middlewares/authMiddleware')
const { createTaskController, getProjectTasksController } = require('../controllers/taskController')

const router = express.Router()

/**
 * @openapi
 * /projects:
 *   post:
 *     summary: Create a new project
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Project created
 *       401:
 *         description: Missing or invalid token
 */
router.post('/', authenticate, createProjectController)

/**
 * @openapi
 * /projects:
 *   get:
 *     summary: List the authenticated user's projects
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of projects
 */
router.get('/', authenticate, getUserProjectController)

/**
 * @openapi
 * /projects/{id}:
 *   get:
 *     summary: Get a project by id
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Project data
 *       404:
 *         description: Project not found or user is not a member
 */
router.get('/:id', authenticate, getProjectByIdController)

/**
 * @openapi
 * /projects/{id}:
 *   delete:
 *     summary: Delete a project
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
 *         description: Project deleted
 *       404:
 *         description: Project not found or user is not the owner
 */
router.delete('/:id', authenticate, deleteProjectController)

/**
 * @openapi
 * /projects/{id}/tasks:
 *   post:
 *     summary: Create a task in a project
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
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Task created
 *       404:
 *         description: Project not found or user is not a member
 */
router.post('/:id/tasks', authenticate, createTaskController)

/**
 * @openapi
 * /projects/{id}/tasks:
 *   get:
 *     summary: List tasks of a project
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of tasks
 *       404:
 *         description: Project not found or user is not a member
 */
router.get('/:id/tasks', authenticate, getProjectTasksController)

module.exports = router
