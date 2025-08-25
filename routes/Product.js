const express = require('express')
const productController = require('../controller/productController')
const router = express.Router()
const path = require('path')

router.post('/:id',productController.addProduct)
router.get('/all/:id',productController.getProducts)
router.put('/edit/:id',productController.updateProduct)
router.route('/product/:id')
    .get(productController.getProduct)
    .delete(productController.deleteProduct)

router.get('/uploads/:imageName', (req, res) => {
  const imageName = req.params.imageName;
  const options = {
    root: path.join(__dirname, '..', 'uploads'),
    headers: { 'Content-Type': 'image/jpeg' }
  };

  res.sendFile(imageName, options, (err) => {
    if (err) {
      console.error('Error sending file:', err);
      res.status(err.status || 500).end();
    }
  });
});

module.exports = router