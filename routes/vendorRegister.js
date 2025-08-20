const express = require('express')
const vendorRegisterController = require('../controller/vendorRegisterController')
const router = express.Router()

router.post('/',vendorRegisterController.handleVendorRegister)

module.exports = router