const express = require('express')
const router = express.Router()
const vendorController = require('../../controller/vendorController')

router.get('/',vendorController.getAllVendors)
router.get('/:id',vendorController.getVendor)

module.exports = router