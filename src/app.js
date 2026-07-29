const express = require('express')
const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const projectRoutes = require('./routes/projectRoutes')
const taskRoutes = require('./routes/taskRoutes')
const { authenticate } = require('./middlewares/authMiddleware')

const app = express()

app.use(express.json())
app.use('/auth', authRoutes)
app.use('/users', userRoutes)
app.use('/projects', projectRoutes)
app.use('/tasks', taskRoutes)

module.exports = app
