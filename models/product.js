const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new Schema({
    productName: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    category: {
        type:[
            {
                type: String,
                enum: ['veg','non-veg']
            }
        ]
    },
    bestseller: {
        type: String
    },
    description: {
        type: String
    },
    image: {
        type:String
    },
    restaurant: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Restaurant'
        }
    ]
})

module.exports = mongoose.model('Product',productSchema)