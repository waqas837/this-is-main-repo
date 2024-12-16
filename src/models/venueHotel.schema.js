
const mongoose = require('mongoose');

const hotelvenueSchema = new mongoose.Schema({
    vendorID: {
        type: String,
    },
    StayAlong: {
        type: String,
        enum:['yes','no'],
        default:'no'
    },
    RestaurantsWithAlcohol: {
        type: Number,
        default:0
    },
    RestaurantsWithoutAlcohol: {
        type: Number,
        default:0
    },
    VenuesCount:{
        type:Number,
        default:0
    },
    PaymentId:{
        type:String,
    }
});

const HotelVenue = mongoose.model('HotelVenue', hotelvenueSchema);
module.exports = HotelVenue;
