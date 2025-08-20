const express = require('express')
const refreshTokenController = require('../controller/refreshTokenController')
const router = express.Router()

router.get('/',refreshTokenController.handleRefreshToken)

module.exports = router