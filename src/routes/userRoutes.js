const express = require('express')
const { getUserByIdController } = require('../controllers/userController')
const { authenticate } = require('../middlewares/authMiddleware')

const router = express.Router()

/**
 * @openapi
 * /users/me:
 *   get:
 *     summary: Get the authenticated user's profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 *       401:
 *         description: Missing or invalid token
 */
router.get('/me', authenticate, getUserByIdController)

module.exports = router
