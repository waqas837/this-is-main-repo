const mongoose = require('mongoose');

const CouponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        trim: true,
    },
    discount: {
        type: Number,
        required: true
    },
    expirationDate: {
        type: Date,
    },
    isActive: {
        type: Boolean,
        default: true
    },
    usedBy: [{
        type: String,
        default: []
    }]
}, {
    timestamps: true
});

const Coupon = mongoose.model('Coupon', CouponSchema);

module.exports = Coupon;
