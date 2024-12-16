const mongoose = require('mongoose');

const venueTypeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    isAvailable: {
        type: Boolean,
        default: false,
    },
    count: {
        type: Number,
        default: 0,
        min: 0,
    },
});

const venuesSchema = new mongoose.Schema({
    vendorId: {
        type: String,
        required: true,
    },
    typeOfVenues: {
        type: String,
        enum: ['individual', 'multiple'],
        required: true,
    },
    restaurants: {
        withAlcohol: {
            type: Number,
            default: 0,
            min: 0,
        },
        withoutAlcohol: {
            type: Number,
            default: 0,
            min: 0,
        },
    },
    venueTypes: {
        type: Map,
        of: venueTypeSchema,
    },

    locationSame: {
        type: String,
        enum: ['yes', 'no'],
        default: 'no'
    },
    group: {
        type: String,
        enum: ['yes', 'no'],
        default: 'no'
    },
    groupName: {
        type: String,
    },
    arePartofestabishment: {
        type: String,
        enum: ['yes', 'no'],
        default: 'no'
    },
    paymentId: {
        type: String,
    },
});

venuesSchema.virtual('totalRestaurants').get(function () {
    return this.restaurants.withAlcohol + this.restaurants.withoutAlcohol;
});

const VenuesSchema = mongoose.model('VenuesSchema', venuesSchema);
module.exports = VenuesSchema;
