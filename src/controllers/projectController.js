const {createProject,deleteProject,getProjectById,getUserProject} = require('../services/projectService');

async function create(req, res){
    try{
        const {name,description} = req.body;
        const userId = req.userId
        if(!name){
            return res.status(400).json({error: 'name is required'});
        }

        const project = await createProject({name, description, userId});
        return res.status(201).json(project);

    }catch (error){
        console.error(error);
        return res.status(500).json({error: 'Internal server error'})
    }
}

async function deleteP(req,res) {
    try{
        const {id} = req.params;
        const userId = req.userId;
        await deleteProject(id,userId);
        res.status(200).json({message: 'Project deleted'})
    }catch(error){
        if(error.message === 'NOT_AN_OWNER'){
            return res.status(404).json({message: 'Project not found'});
        }
        console.error(error)
        return res.status(500).json({error:'Internal server error'});
    }
}

async function getAllProject(req, res){
    try{
        const {userId} = req.userId;
        const projects = await getUserProject(userId);
        return res.status(200).json(projects);
    }catch(error){
        console.error(error);
        return res.status(500).json({message: 'Internal server error'});
    }
}

async function getById(req,res){
    try{
        const {id} = req.params;
        const userId = req.userId;
        const project = await getProjectById(id, userId);
        return res.status(200).json({project})
    }catch(error){
        if(error.message === 'NOT_A_MEMBER'){
            return res.status(404).json({message: 'Project not found'});
        }
        console.error(error);
        return res.status(500).json({message:'Internal server error'});
    }
}

module.exports = {create,deleteP,getAllProject,getById}