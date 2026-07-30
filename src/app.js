const express = require('express')
const path = require('path')
const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const projectRoutes = require('./routes/projectRoutes')
const taskRoutes = require('./routes/taskRoutes')
const swaggerUi = require('swagger-ui-express')
const swaggerSpec = require('./swagger')

const app = express()

app.use(express.json())
app.use(express.static(path.join(__dirname, '..', 'public')))
app.use('/auth', authRoutes)
app.use('/users', userRoutes)
app.use('/projects', projectRoutes)
app.use('/tasks', taskRoutes)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

module.exports = app
