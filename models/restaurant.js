const mongoose = require('mongoose');
const fsPromise = require('fs').promises;
const path = require('path')
const {Schema} = mongoose;

const restaurantSchema = new Schema({
    restaurantName: {
        type: String,
        required: true,
        trim: true
    },
    area: {
        type: String,
        required: true,
        trim: true
    },
    city: {
        type: String,
        required: true,
        trim: true
    },
    category:{
                type: [String],
                enum: ['veg','non-veg']
    },
    region: {
                type: [String],
                enum: ['South-Indian','North-Indian','Chinese','Bakery']
    },
    offer: {
        type: String
    },
    image: {
        type: String,
    },
    vendor:{
        type: Schema.Types.ObjectId,
        ref: 'Vendor'   
    },
    products:[{
        type: Schema.Types.ObjectId,
        ref: 'Product'
    }]
})

restaurantSchema.index(
    {restaurantName:1,area:1,city:1,vendor:1},
    {unique:true}
)
restaurantSchema.post('findOneAndDelete',async (doc) =>{
    if(doc&&doc.image){
        const imagePath = path.join(__dirname,'..','uploads',doc.image);
        try{
            await fsPromise.unlink(imagePath)
            console.log('Deleted Image', imagePath)
        }catch(err){
            if (err.code === 'ENOENT') {
                console.warn('Image file not found, skipping deletion:', imagePath);
            } else {
                console.error('Failed to delete image:', err);
            }
        }
    }
})

module.exports = mongoose.model('Restaurant',restaurantSchema)