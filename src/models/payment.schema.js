const mongoose = require('mongoose');

const pricingSchema = new mongoose.Schema({
    venueCategory: {
        type: String,
    },
    feePerVenue: {
        type: Number,
    },
    additionalPricing: {
        type: Map,
        of: new mongoose.Schema({
            description: {
                type: String,
            },
            amount: {
                type: Number,
            }
        })
    },
    discountedPrice: {
        type: Number,
    }
});

const paymentSchema = new mongoose.Schema({
    vendorId: {
        type: String,
    },
    typeOfVenue: {
        type: String,
        enum: ['HotelStayandVenue', 'Venues'],
    },
    venueDetails: {
        type: Map,
        of: pricingSchema,
    },
    totalAmount: {
        type: Number,
    },
    discountedAmount: {
        type: Number,
    },
    paymentId: {
        type: String,
    },
    coupon: {
        type: String,
    },
    subscriptionStartDate: {
        type: Date,
    },
    subscriptionEndDate: {
        type: Date,
    },
});

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;