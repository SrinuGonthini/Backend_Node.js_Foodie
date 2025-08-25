const User = require('../models/vendor')
const Restaurant = require('../models/restaurant')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const handleVendorLogin = async(req,res) => {
    const {email,pwd} = req.body
    if(!email || ! pwd) return res.status(400).json({message:'email and password are required'})
    try{
        const vendor = await User.findOne({email:email}).exec();
        if(!vendor) return res.sendStatus(401)
        const match = await bcrypt.compare(pwd,vendor.password)
        if(match){
            const accessToken = jwt.sign(
                {id : vendor._id},
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn : '1h'}
            )
            const refreshToken = jwt.sign(
                {id : vendor._id},
                process.env.REFRESH_TOKEN_SECRET,
                {expiresIn : '1d'}
            );
            vendor.refreshToken = refreshToken;
            const result =await vendor.save();

            const existingRestaurant = await Restaurant.findOne({ vendor: vendor._id }).exec();


            res.cookie('jwt',refreshToken,{httpOnly:true,maxAge:24*60*60*1000})
            res.status(200).json({ accessToken,result:{
                id:result._id,
                user:result.username,
                email:result.email
            },restaurant: existingRestaurant || null })
        }else{
            res.sendStatus(401)
        }
    }catch(err){
        res.sendStatus(500)
    }
}

module.exports = { handleVendorLogin }