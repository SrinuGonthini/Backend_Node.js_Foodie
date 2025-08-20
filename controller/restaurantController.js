const Restaurant = require('../models/restaurant')
const User = require('../models/vendor')
const multer = require('multer')

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'uploads/');
    },
    filename: function(req,file,cb){
        cb(null,Date.now()+ '-' +file.originalname);
    }
})

const upload = multer({ storage });

const addRestaurant = async (req,res) => {
    try{
        const { restaurantName,area,category,region,offer } = req.body
        const image = req.file?req.file.filename:undefined
        const vendor = await User.findById(req.id)
        if(!vendor) return res.sendStatus(401);
        const result =await Restaurant.create({
            restaurantName,
            area,
            category,
            region,
            offer,
            image,
            vendor:vendor._id
        })
        vendor.restaurant.push(result)
        await vendor.save();
        res.status(201).json({message:`${restaurantName} restaurant added successfully`})
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

const deleteRestaurant = async (req,res) => {
    try{
        const restaurantid = req.params.id
        const restaurant = await Restaurant.findByIdAndDelete(restaurantid)
        if(!restaurant) return res.sendStatus(400);
        res.json('Restaurant delete successfully')
    }catch(err){
        res.sendStatus(500)
    }
}

module.exports = { addRestaurant:[upload.single('image'),addRestaurant],getRestaurants,deleteRestaurant }