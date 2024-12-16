const mongoose = require('mongoose');

const BillingInfoSchema = new mongoose.Schema({
    vendorId: {
        type: String,

    },
    invoiceName: {
        type: String,
        trim: true
    },
    trnNo: {
        type: String,
        trim: true
    },
    addressLine1: {
        type: String,
        trim: true
    },
    addressLine2: {
        type: String,
        trim: true
    },
    city: {
        type: String,
        trim: true
    },
    area: {
        type: String,
        trim: true
    },
    poBox: {
        type: String,
        trim: true
    },
    country: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

const BillingInfo = mongoose.model('BillingInfo', BillingInfoSchema);

module.exports = BillingInfo;
