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
        type:Boolean
    },
    bestseller: {
        type: Boolean
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