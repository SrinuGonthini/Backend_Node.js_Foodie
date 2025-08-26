const express = require('express')
const productController = require('../controller/productController')
const router = express.Router()

router.post('/:id',productController.addProduct)
router.get('/all/:id',productController.getProducts)
router.put('/edit/:id',productController.updateProduct)
router.route('/product/:id')
    .get(productController.getProduct)
    .delete(productController.deleteProduct)

module.exports = router