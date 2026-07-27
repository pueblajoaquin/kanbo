const prisma = require(`../prisma`);

async function createProject({name, description, userId}){
    const project = await prisma.project.create({
        data: {name, description},
    })


    const projectMember = await prisma.projectMember.create({
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





module.exports = {createProject}