const express = require('express')
const productController = require('../controller/productController')
const router = express.Router()
const path = require('path')

router.route('/:id')
    .post(productController.addProduct)
    .get(productController.getProducts)
    .delete(productController.deleteProduct)

router.get('/uploads/:imageName',(req,res)=>{
    const imageName = req.params.imageName
    res.headersSent('Content-Type','image/jpeg')
    res.sendFile(path.join(__dirname,'..','uploads',imageName))
})

module.exports = router