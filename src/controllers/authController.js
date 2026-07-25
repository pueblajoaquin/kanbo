const {registerUser, loginUser} = require('../services/authService');

async function register(req, res){
    try{
        const {name, email, password} = req.body;
        
        if(!name || !email || !password){
            return res.status(400).json({ error: 'name, email and password are required'});
        }

        const user = await registerUser({ name, email, password});
        return res.status(201).json(user);
    }catch (error){
        if (error.message == "EMAIL_ALREADY_IN_USE"){
            return res.status(400).json({error: 'Email already in use'});
        }
        console.error(error);
        return res.status(500).json({error: 'Internal server error'});
    }
}

async function login(req, res){
    try{
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(400).json({error:'email and password are required'})
        }

        const result = await loginUser({email,password});
        return res.status(200).json(result);
    }catch(error){
        if (error.message == 'INVALID_CREDENTIALS'){
            return res.status(401).json({error: 'Invalid email or password'});
        }
        console.log(error);
        return res.status(500).json({error: 'Internal server error'});
    }
}


module.exports = {register, login};