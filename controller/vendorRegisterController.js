const User = require('../models/vendor')
const bcrypt = require('bcrypt')

const handleVendorRegister = async(req,res) => {
    const {user,email,pwd} = req.body
    if(!user || !email || !pwd) return res.status(400).json({message:'username, email and password are required'})
    const duplicate = await User.findOne({ email:email }).exec();
    if(duplicate) return res.sendStatus(409)
    try{
        const hashedpwd = await bcrypt.hash(pwd,10)
        const result = await User.create({
            username:user,
            email:email,
            password : hashedpwd
        })
        res.status(201).json({message:`${user} was Registered`})
    }catch(err){
        res.status(500).json({error:'Internal error'})
    }
}

module.exports = { handleVendorRegister }