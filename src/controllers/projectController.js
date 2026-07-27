const {createProject} = require('../services/projectService');

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


module.exports = {create}