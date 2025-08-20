const User = require('../models/vendor')

const handleVendorLogout = async(req,res) => {
    const cookies = req.cookies;
    if(!cookies?.jwt) return res.sendStatus(204);
    const refreshToken = cookies.jwt
    const vendor = await User.findOne({refreshToken}).exec();
    if(!vendor){
        res.clearCookie('jwt',{httpOnly:true})
        res.sendStatus(401)
    }
    vendor.refreshToken = '';
    const result = await vendor.save();

    res.clearCookie('jwt',{httpOnly:true})
    res.sendStatus(204);
}

module.exports = { handleVendorLogout }