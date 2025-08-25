const express = require('express');
const restaurantController = require('../controller/restaurantController');
const router = express.Router();
const path = require('path')


router.post('/add',restaurantController.addRestaurant)
router.get('/vendor/:id',restaurantController.getRestaurants)
router.put('/edit/:id',restaurantController.updateRestaurant)
router.route('/:id')
    .get(restaurantController.getRestaurant)
    .delete(restaurantController.deleteRestaurant)

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