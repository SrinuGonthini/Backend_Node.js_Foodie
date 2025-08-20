const express = require('express')
const vendorLoginController = require('../controller/vendorLoginController')
const router = express.Router()

router.post('/',vendorLoginController.handleVendorLogin)

module.exports = router