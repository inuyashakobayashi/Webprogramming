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
module.exports ={
    addUser
};