const mongoose = require('mongoose')
const {Schema} = mongoose;

const restaurantSchema = new Schema({
    restaurantName: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    area: {
        type: String,
        required: true,
        trim: true
    },
    category:{
            type: [
            {
                type: String,
                enum: ['veg','non-veg']
            }
        ]
    },
    region: {
            type: [
            {
                type: String,
                enum: ['South-Indian','North-Indian','Chinese','Bakery']
            }
        ]
    },
    offer: {
        type: String
    },
    image: {
        type: String,
    },
    vendor:[{
        type: Schema.Types.ObjectId,
        ref: 'Vendor'   
    }],
    products:[{
        type: Schema.Types.ObjectId,
        ref: 'Product'
    }]
})

module.exports = mongoose.model('Restaurant',restaurantSchema)