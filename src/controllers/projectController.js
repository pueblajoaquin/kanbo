const { createProjectService, deleteProjectService, getProjectByIdService, getUserProjectService, addMembersService, getProjectMembersService } = require('../services/projectService')

async function createProjectController(req, res) {
  try {
    const { name, description } = req.body
    const userId = req.userId
    if (!name) {
      return res.status(400).json({ error: 'name is required' })
    }

    const project = await createProjectService({ name, description, userId })
    return res.status(201).json(project)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

async function deleteProjectController(req, res) {
  try {
    const { id } = req.params
    const userId = req.userId
    await deleteProjectService(id, userId)
    res.status(200).json({ message: 'Project deleted' })
  } catch (error) {
    if (error.message === 'NOT_AN_OWNER') {
      return res.status(404).json({ message: 'Project not found' })
    }
    console.error(error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

async function getUserProjectController(req, res) {
  try {
    const userId = req.userId
    const projects = await getUserProjectService(userId)
    return res.status(200).json(projects)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

async function getProjectByIdController(req, res) {
  try {
    const { id } = req.params
    const userId = req.userId
    const project = await getProjectByIdService(id, userId)
    return res.status(200).json({ project })
  } catch (error) {
    if (error.message === 'NOT_A_MEMBER') {
      return res.status(404).json({ message: 'Project not found' })
    }
    console.error(error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

async function addMembersController(req, res) {
  try {
    const { id: projectId } = req.params;
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ message: 'email is required' })
    }

    const membership = await addMembersService(projectId, req.userId, email)

    return res.status(201).json(membership)
  } catch (error) {
    if (error.message == 'NOT_AN_OWNER') {
      return res.status(404).json({ message: 'Project not found' })
    }
    if (error.message == 'USER_NOT_FOUND') {
      return res.status(404).json({ message: 'User not found' })
    }
    if (error.message == 'ALREADY_A_MEMBER') {
      return res.status(400).json({ message: 'User is already a member' })
    }

    console.error(error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

async function getProjectMembersController(req, res) {
  try {
    const { id: projectId } = req.params;
    const members = await getProjectMembersService(projectId, req.userId)
    return res.status(200).json(members)
  } catch {
    if (error.message === 'NOT_A_MEMBER') {
      return res.status(404).json({ message: 'Project not found' })
    }
    console.error(error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

module.exports = { createProjectController, deleteProjectController, getUserProjectController, getProjectByIdController, addMembersController, getProjectMembersController }
