const Product = require('../models/product')
const Restaurant = require('../models/restaurant')
const multer = require('multer')

const storage = multer.diskStorage({
    destination: function(req,file,cb) {
        cb(null,'uploads/')
    },
    filename: function(req,file,cb) {
        cb(null,Date.now() + '-' + file.originalname)
    }
})

const upload = multer({storage});

const addProduct = async (req,res) => {
    const {productName,price,category,bestseller,description} = req.body
    const image = req.file?req.file.filename:undefined;
    const restaurantId = req.params.id
    const restaurant = await Restaurant.findById(restaurantId)
    if(!restaurant) return res.sendStatus(404);
    const result = await Product.create({
        productName,
        price,
        category,
        bestseller,
        description,
        image,
        restaurant: restaurant._id
    })
    restaurant.products.push(result)
    await restaurant.save();
    res.status(201).json({message:`${productName} added successfully`})
}

const getProducts = async (req,res) => {
    try{
        const restaurantId = req.params.id;
        const restaurant = await Restaurant.findById(restaurantId)
        if(!restaurant) return res.sendStatus(404);
        const products = await Product.find({restaurant: restaurantId})
        res.json({restaurantName:restaurant.restaurantName,products})
    }catch(err){
        res.sendStatus(500)
    }
}

const deleteProduct = async (req,res) => {
    try{
        const productId = req.params.id
        const product = await Product.findByIdAndDelete(productId)
        if(!product) return res.sendStatus(404);
        res.json('product delete successfully')
    }catch(err){
        res.sendStatus(500)
    }
}

module.exports = {addProduct:[upload.single('image'),addProduct],getProducts,deleteProduct}