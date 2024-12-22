const Poll = require('../models/poll.model');
const crypto = require('crypto');
const User = require('../models/user.model')

const addUser = async(req,res) => {
    const {name,password} = req.body;
    const user =  new User({
        name,
        password
    })
    await user.save()
   const ApiKey = crypto.randomBytes(32).toString('hex');
   return res.status(200).json({ApiKey});
    
}
const addKey = async(req,res)=>{
    try {
        const{name,password} = req.body;
        const user = User.findOne({'name':name,'password':password})
        if(!user){
             return res.status(404).json({
                        code: 404,
                        message: "Poll not found"
                    });
        }

          const ApiKey = crypto.randomBytes(32).toString('hex');
   return res.status(200).json({ApiKey});
    } catch (error) {
        
    }
}

const findUserByName = async(req, res) => {
    try {
        const name = req.params.username;
        const user = await User.findOne({ name: name });
        
        if (!user) {
            return res.status(404).json({
                code: 404,
                message: "User not found"
            });
        }

        // Korrektes Response-Format
        return res.status(200).json({
            name: user.name,
            lock: true  // oder user.lock, falls das in deinem Schema existiert
        });

    } catch (error) {
        return res.status(500).json({
            code: 500,
            message: error.message
        });
    }
};
module.exports ={
    addUser,
    addKey,
    findUserByName
};