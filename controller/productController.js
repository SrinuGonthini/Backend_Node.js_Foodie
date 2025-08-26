const Product = require('../models/product')
const Restaurant = require('../models/restaurant')
const cloudinary = require('../config/cloudinary')
const multer = require('multer')
const fs = require('fs')



const upload = multer({dest:'temp/'});

const addProduct = async (req,res) => {
    const {productName,price,category,bestseller,description} = req.body
    const restaurantId = req.params.id
    const restaurant = await Restaurant.findById(restaurantId)
    if(!restaurant) return res.sendStatus(404);
    let imageUrl = ''
    let cloudinaryId = ''
    if(req.file){
        const result = await cloudinary.uploader.upload(req.file.path,{
            folder:'products'
        })
        imageUrl = result.secure_url
        cloudinaryId = result.public_id
        fs.unlinkSync(req.file.path)
    }
    const result = await Product.create({
        productName,
        price,
        category,
        bestseller,
        description,
        image: imageUrl,
        cloudinaryId,
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
        const product = await Product.findById(productId)
        if(!product) return res.sendStatus(404);
        if(req.file){
            if(product.cloudinaryId){
            await cloudinary.uploader.destroy(product.cloudinaryId)
        }
        const result = await cloudinary.uploader.upload(req.file.path,{
            folder:'products'
        })
        updates.image = result.secure_url
        updates.cloudinaryId = result.public_id
        fs.unlinkSync(req.file.path)
        }
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