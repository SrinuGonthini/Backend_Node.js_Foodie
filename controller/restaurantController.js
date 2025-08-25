
const Restaurant = require('../models/restaurant')
const Product = require('../models/product')
const User = require('../models/vendor')
const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'uploads/');
    },
    filename: function(req,file,cb){
        cb(null,Date.now()+ path.extname(file.originalname));
    }
})

const upload = multer({ storage });

const addRestaurant = async (req,res) => {
    try{
        const { restaurantName,area,city,category,region,offer } = req.body
        const image = req.file?req.file.filename:undefined
        const vendor = await User.findById(req.id)
        if(!vendor) return res.sendStatus(401);
        const result =await Restaurant.create({
            restaurantName,
            area,
            city,
            category,
            region,
            offer,
            image,
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
        const image = req.file ? req.file.filename : undefined;
        if (image) updates.image = image
        const restaurant = await Restaurant.findById(restaurantId)
        if(!restaurant) return res.sendStatus(404);
        restaurant.set(updates)
        if(image) restaurant.image = image
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