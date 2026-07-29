const express = require('express')
const { registerUserController, loginUserController } = require('../controllers/authController')

const router = express.Router()

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created
 *       400:
 *         description: Invalid input or email already in use
 */
router.post('/register', registerUserController)

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Log in with email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Returns a JWT token and the user's data
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', loginUserController)

module.exports = router
