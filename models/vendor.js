const mongoose = require('mongoose');
const { Schema } = mongoose;

const vendorSchema = new Schema({
    username:{
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    refreshToken: {
        type: String,
        default: ''
    },
    restaurant: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Restaurant'
        }
    ]
})

module.exports = mongoose.model('Vendor',vendorSchema)