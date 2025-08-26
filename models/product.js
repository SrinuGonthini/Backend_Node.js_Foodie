const mongoose = require('mongoose');
const cloudinary = require('../config/cloudinary')
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
    cloudinaryId: {
        type: String
    },
    restaurant: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Restaurant'
        }
    ]
})

productSchema.post('findOneAndDelete',async (doc) => {
    if(doc.cloudinaryId){
        try{
            await cloudinary.uploader.destroy(doc.cloudinaryId)
            console.log('Deleted image',doc.cloudinaryId)
        }catch(err){
                console.error('Failed to delete image:', err);
        }
    }
})

module.exports = mongoose.model('Product',productSchema)