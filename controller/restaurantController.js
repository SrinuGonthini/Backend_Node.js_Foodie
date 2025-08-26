const Restaurant = require('../models/restaurant')
const Product = require('../models/product')
const User = require('../models/vendor')
const multer = require('multer')
const cloudinary = require('../config/cloudinary')
const fs = require('fs')

const upload = multer({ dest:'temp/' });

const addRestaurant = async (req,res) => {
    try{
        const { restaurantName,area,city,category,region,offer } = req.body
        const vendor = await User.findById(req.id)
        if(!vendor) return res.sendStatus(401);
        let imageUrl = ''
        let cloudinaryId = ''
        if(req.file){
            const result = await cloudinary.uploader.upload(req.file.path,{
                folder:'restaurants'
            })
            imageUrl=result.secure_url
            cloudinaryId=result.public_id
            fs.unlinkSync(req.file.path)
        }
        const result =await Restaurant.create({
            restaurantName,
            area,
            city,
            category,
            region,
            offer,
            image:imageUrl,
            cloudinaryId,
            vendor:vendor._id
        })
        vendor.restaurant.push(result)
        await vendor.save();
        res.status(201).json({message:`${restaurantName} restaurant added successfully`,restaurant:result})
    }catch(err){
        console.log(err)
        res.sendStatus(500)
    }  
}

const getRestaurants = async (req,res) =>{
    try{
        const vendorId = req.params.id
        const vendor = await User.findById(vendorId)
        if(!vendor) return res.sendStatus(404);
        const restaurant = await Restaurant.find({vendor:vendorId})
        res.json({vendor:vendor.user,restaurant})
    }catch(err){
        res.sendStatus(500)
    }
}

const getRestaurant = async (req,res) => {
    try{
        const restaurantId = req.params.id
        const restaurant = await Restaurant.findById(restaurantId)
        if(!restaurant) return res.sendStatus(404);
        res.json({restaurant})
    }catch(err){
        res.sendStatus(500)
    }
}
const updateRestaurant = async (req,res) => {
    try{
        const restaurantId = req.params.id
        const updates = req.body
        const restaurant = await Restaurant.findById(restaurantId)
        if(!restaurant) return res.sendStatus(404);
        if(req.file){
            if(restaurant.cloudinaryId){
                await cloudinary.uploader.destroy(restaurant.cloudinaryId)
            }
            const result = await cloudinary.uploader.upload(req.file.path,{
                folder:'restaurants'
            })
            updates.image = result.secure_url
            updates.cloudinaryId = result.public_id
            fs.unlinkSync(req.file.path)
        }
        restaurant.set(updates)
        await restaurant.save();
        res.json({restaurant})
    }catch(err){
        res.sendStatus(500)
    }
}

const deleteRestaurant = async (req,res) => {
    try{
        const restaurantid = req.params.id
        await Product.deleteMany({restaurant:restaurantid})
        const restaurant = await Restaurant.findByIdAndDelete(restaurantid)
        if(!restaurant) return res.sendStatus(404);

        await User.updateOne(
            { _id: restaurant.vendor },
            { $pull: { restaurant: restaurant._id } }
        );
        res.json('Restaurant delete successfully')
    }catch(err){
        res.sendStatus(500)
    }
}

module.exports = { addRestaurant:[upload.single('image'),addRestaurant],updateRestaurant:[upload.single('image'),updateRestaurant],getRestaurant,getRestaurants,deleteRestaurant}