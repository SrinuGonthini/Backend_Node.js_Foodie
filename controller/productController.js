const Product = require('../models/product')
const Restaurant = require('../models/restaurant')
const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: function(req,file,cb) {
        cb(null,'uploads/')
    },
    filename: function(req,file,cb) {
        cb(null,Date.now() + path.extname(file.originalname))
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

const getProduct = async (req,res) => {
    try{
        const productId = req.params.id
        const product = await Product.findById(productId)
        if(!product) return res.sendStatus(404);
        res.json({product})
    }catch(err){
        res.sendStatus(500)
    }
}

const updateProduct = async (req,res) => {
    try{
        const productId = req.params.id
        const updates = req.body
        const image = req.file ? req.file.filename : undefined
        if(image) updates.image = image
        const product = await Product.findById(productId)
        if(!product) return res.sendStatus(404);
        product.set(updates)
        await product.save()
        res.json({product})
    }catch(err){
        res.sendStatus(500)
    }
}

const deleteProduct = async (req,res) => {
    try{
        const productId = req.params.id
        const product = await Product.findByIdAndDelete(productId)
        if(!product) return res.sendStatus(404);
        await Restaurant.updateOne(
            {_id:product.restaurant},
            {$pull:{products:product._id}}
        )
        res.json('product delete successfully')
    }catch(err){
        res.sendStatus(500)
    }
}

module.exports = {addProduct:[upload.single('image'),addProduct],updateProduct:[upload.single('image'),updateProduct],getProducts,deleteProduct,getProduct}