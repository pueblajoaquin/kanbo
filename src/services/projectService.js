const prisma = require('../prisma')

async function createProjectService({ name, description, userId }) {
  const project = await prisma.project.create({
    data: { name, description }
  })

  const projectMember = await prisma.projectMembers.create({
    data: {
      userId,
      projectId: project.id,
      role: 'owner'
    }
  })

  return {
    id: project.id,
    name: project.name,
    description: project.description,
    ownerId: userId
  }
}

async function getUserProjectService(userId) {
  const memberships = await prisma.projectMembers.findMany({
    where: { userId },
    include: { project: true }
  })

  return memberships.map((m) => m.project)
}

async function getProjectByIdService(projectId, userId) {
  const membership = await prisma.projectMembers.findFirst({
    where: { projectId, userId }
  })

  if (!membership) {
    throw new Error('NOT_A_MEMBER')
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId }
  })

  return project
}

async function deleteProjectService(projectId, userId) {
  const membership = await prisma.projectMembers.findFirst({
    where: { projectId, userId, role: 'owner' }
  })

  if (!membership) {
    throw new Error('NOT_AN_OWNER')
  }

  await prisma.project.delete({ where: { id: projectId } })
}

async function addMembersService(projectId, ownerId, email) {
  const ownerMembership = await prisma.projectMembers.findFirst({
    where: { projectId, userId: ownerId, role: 'owner' }
  })

  if (!ownerMembership) {
    throw new Error('NOT_AN_MEMBER')
  }

  const userToInvite = await prisma.user.findUnique({
    where: { email }
  })

  if (!userToInvite) {
    throw new Error('USER_NOT_FOUND')
  }

  const existingMembership = await prisma.projectMembers.findFirst({
    where: ({ projectId, userId: userToInvite.id })
  })

  if (existingMembership) {
    throw new Error('ALREADY_A_MEMBER')
  }

  const membership = await prisma.projectMembers.create({
    data: {
      projectId,
      userId: userToInvite.id,
      role: 'collaborator'
    }
  })

  return membership
}

async function getProjectMembersService(projectId, userId) {
  const membership = await prisma.projectMembers.findFirst({
    where: { projectId, userId }
  })

  if (!membership) {
    throw new Error('NOT_A_MEMBER')
  }

  const members = await prisma.projectMembers.findMany({
    where: { projectId },
    include: { user: true }
  })

  return members.map((m) => ({
    id: m.userId,
    name: m.user.name,
    email: m.user.email,
    role: m.role
  }))
}

module.exports = { createProjectService, getUserProjectService, getProjectByIdService, deleteProjectService, addMembersService, getProjectMembersService }
