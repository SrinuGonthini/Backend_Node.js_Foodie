const User = require('../models/vendor')

const getAllVendors = async (req,res) => {
    const vendors = await User.find().populate('restaurant')
    res.json({vendors})
}

const getVendor = async (req,res) =>{
    const vendorId = req.params.id;
    const vendor = await User.findById(vendorId).populate('restaurant')
    if(!vendor) return res.sendStatus(404);
    res.json({vendor})
}

module.exports = {
    getAllVendors,
    getVendor
}