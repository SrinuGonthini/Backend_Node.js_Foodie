const User = require('../models/vendor')
const jwt = require('jsonwebtoken')

const handleRefreshToken = async (req,res) => {
    const cookies = req.cookies;
    if(!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt
    const vendor = await User.findOne({refreshToken}).exec();
    if(!vendor) return res.sendStatus(401);
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err,decoded) => {
            if(err || vendor._id.toString() !== decoded.id) return res.sendStatus(403);
            const accessToken = jwt.sign(
                {id: vendor._id},
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn: '1h'}
            )
            res.json({accessToken})
        }
    )
}

module.exports = { handleRefreshToken }