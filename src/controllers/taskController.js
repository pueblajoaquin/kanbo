const { createTaskService, getProjectTasksService, updateTaskStatusService, deleteTaskService } = require('../services/taskService')

async function createTaskController (req, res) {
  try {
    const { id: projectId } = req.params
    const { title, description } = req.body

    if (!title) {
      return res.status(400).json({ message: 'title is required' })
    }

    const task = await createTaskService({ title, description, projectId, creatorId: req.userId })
    return res.status(201).json(task)
  } catch (error) {
    if (error.message === 'NOT_A_MEMBER') {
      return res.status(404).json({ message: 'Project not found' })
    }
    console.error(error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

async function getProjectTasksController (req, res) {
  try {
    const { id: projectId } = req.params
    const tasks = await getProjectTasksService(projectId, req.userId)
    return res.status(200).json(tasks)
  } catch (error) {
    if (error.message === 'NOT_A_MEMBER') {
      return res.status(404).json({ error: 'Project not found' })
    }
    console.error(error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

async function updateTaskStatusController (req, res) {
  try {
    const { id: taskId } = req.params
    const { status } = req.body

    const task = await updateTaskStatusService(taskId, req.userId, status)
    return res.status(200).json(task)
  } catch (error) {
    if (error.message === 'TASK_NOT_FOUND') {
      return res.status(404).json({ error: 'Task not found' })
    }
    if (error.message === 'NOT_A_MEMBER') {
      return res.status(404).json({ error: 'Task not found' })
    }
    console.error(error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

async function deleteTaskController (req, res) {
  try {
    const { id: taskId } = req.params
    await deleteTaskService(taskId, req.userId)
    return res.status(204).send()
  } catch (error) {
    if (error.message === 'TASK_NOT_FOUND' || error.message === 'NOT_AUTHORIZED') {
      return res.status(404).json({ error: 'Task not found' })
    }
    console.error(error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

module.exports = { createTaskController, getProjectTasksController, updateTaskStatusController, deleteTaskController }
