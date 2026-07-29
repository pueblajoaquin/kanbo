const prisma = require('../prisma')

async function createTaskService ({ title, description, projectId, creatorId }) {
  const membership = await prisma.projectMembers.findFirst({
    where: { projectId, userId: creatorId }
  })

  if (!membership) {
    throw new Error('NOT_A_MEMBER')
  }

  const task = await prisma.task.create({
    data: { title, description, projectId, creatorId }
  })
  return task
}

async function getProjectTasksService (projectId, userId) {
  const membership = await prisma.projectMembers.findFirst({
    where: { projectId, userId }
  })
  if (!membership) {
    throw new Error('NOT_A_MEMBER')
  }
  const tasks = await prisma.task.findMany({
    where: { projectId }
  })
  return tasks
}

async function updateTaskStatusService (taskId, userId, status) {
  const task = await prisma.task.findUnique({
    where: { id: taskId }
  })
  if (!task) {
    throw new Error('TASK_NOT_FOUND')
  }

  const membership = await prisma.projectMembers.findFirst({
    where: { projectId: task.projectId, userId }
  })
  if (!membership) {
    throw new Error('NOT_A_MEMBER')
  }

  const updatedTask = await prisma.task.update({
    where: { id: taskId },
    data: { status }
  })

  return updatedTask
}

async function deleteTaskService (taskId, userId) {
  const task = await prisma.task.findUnique({ where: { id: taskId } })

  if (!task) {
    throw new Error('TASK_NOT_FOUND')
  }

  const isCreator = task.creatorId === userId

  const ownerMembership = await prisma.projectMembers.findFirst({
    where: { projectId: task.projectId, userId, role: 'owner' }
  })

  if (!isCreator && !ownerMembership) {
    throw new Error('NOT_AUTHORIZED')
  }

  await prisma.task.delete({ where: { id: taskId } })
}

module.exports = { createTaskService, getProjectTasksService, updateTaskStatusService, deleteTaskService }
