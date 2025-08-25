const mongoose = require('mongoose');
const fsPromise = require('fs').promises;
const path = require('path')
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

productSchema.post('findOneAndDelete',async (doc) => {
    if(doc && doc.image){
        const imagePath = path.join(__dirname,'..','uploads',doc.image);
        try{
            await fsPromise.unlink(imagePath)
            console.log('Deleted image',imagePath)
        }catch(err){
            if (err.code === 'ENOENT') {
                console.warn('Image file not found, skipping deletion:', imagePath);
            } else {
                console.error('Failed to delete image:', err);
            }
        }
    }
})

module.exports = mongoose.model('Product',productSchema)