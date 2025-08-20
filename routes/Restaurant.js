const express = require('express');
const restaurantController = require('../controller/restaurantController');
const router = express.Router();
const path = require('path')


router.post('/',restaurantController.addRestaurant)

router.route('/:id')
    .get(restaurantController.getRestaurants)
    .delete(restaurantController.deleteRestaurant)

router.get('/uploads/:imageName',(req,res)=>{
    const imageName = req.params.imageName
    res.headersSent('Content-Type','image/jpeg')
    res.sendFile(path.join(__dirname,'..','uploads',imageName))
})

module.exports = router