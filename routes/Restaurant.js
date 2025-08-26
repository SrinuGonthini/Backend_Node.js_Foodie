const express = require('express');
const restaurantController = require('../controller/restaurantController');
const router = express.Router();

router.post('/add',restaurantController.addRestaurant)
router.get('/vendor/:id',restaurantController.getRestaurants)
router.put('/edit/:id',restaurantController.updateRestaurant)
router.route('/:id')
    .get(restaurantController.getRestaurant)
    .delete(restaurantController.deleteRestaurant)


module.exports = router