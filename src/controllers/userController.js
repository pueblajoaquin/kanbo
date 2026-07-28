const {getUserByIdService} = require ('../services/authService')

async function getUserByIdController(req, res){
    try{
        const user = await getUserByIdService(req.userId);
        return res.status(200).json(user);
    }catch(error){
        if (error.message === 'USER_NOT_FOUND'){
            return res.status(404).json({error: 'User not found'})
        }
        console.error(error);
        return res.status(500).json({error:'Internal server error'});
    }
}

module.exports = {getUserByIdController};