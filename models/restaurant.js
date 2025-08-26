const mongoose = require('mongoose');
const cloudinary = require('../config/cloudinary')
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
        type: String
    },
    cloudinaryId: {
        type: String
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
    if(doc.cloudinaryId){
        try{
            await cloudinary.uploader.destroy(doc.cloudinaryId)
            console.log('Deleted Image', doc.cloudinaryId)
        }catch(err){
            console.error('Failed to delete image:', err);
        }
    }
})

module.exports = mongoose.model('Restaurant',restaurantSchema)