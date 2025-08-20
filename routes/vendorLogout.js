const express = require('express');
const vendorLogoutController = require('../controller/vendorLogoutContoller');
const router = express.Router();

router.get('/',vendorLogoutController.handleVendorLogout)

module.exports = router