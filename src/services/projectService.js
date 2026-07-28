const prisma = require(`../prisma`);

async function createProjectService({name, description, userId}){
    const project = await prisma.project.create({
        data: {name, description},
    })


    const projectMember = await prisma.projectMembers.create({
        data: {
            userId: userId,
            projectId: project.id,
            role: 'owner'
        }
    })

    return {
        id : project.id,
        name : project.name,
        description : project.description,
        ownerId : userId
    }
}

async function getUserProjectService(userId){
    const memberships = await prisma.projectMembers.findMany({
        where: {userId},
        include: {project: true}
    })

    return memberships.map((m) => m.project);
}

async function getProjectByIdService(projectId, userId){
    const membership = await prisma.projectMembers.findFirst({
        where: {projectId, userId}
    });

    if(!membership){
        throw new Error('NOT_A_MEMBER');
    }

    const project = await prisma.project.findUnique({
        where : {id: projectId}
    })

    return project;
}

async function deleteProjectService(projectId,userId){
    const membership = await prisma.projectMembers.findFirst({
        where: {projectId, userId, role : 'owner'}
    });

    if(!membership){
        throw new Error('NOT_AN_OWNER');
    }
    
    await prisma.project.delete({where: {id: projectId}})
}



module.exports = {createProjectService, getUserProjectService, getProjectByIdService, deleteProjectService}