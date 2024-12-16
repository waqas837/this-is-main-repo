const mongoose = require('mongoose');
const { Schema } = mongoose;

/**
 * Schema for storing basic details about the hotel.
 */
const BasicDetailsSchema = new Schema({
    hotelName: {
        type: String,
        trim: true
    },
    hotelDescription: {
        type: String,
        trim: true
    },
    hotelWebsite: {
        type: String,
        trim: true
    },
    hotelRating: {
        type: String,
        trim: true
    },
    hotelChain: {
        type: String,
        trim: true
    },
    hotelBrand: {
        type: String,
        trim: true
    },
    selectedTags: {
        types: [{ type: String, trim: true }],
        views: [{ type: String, trim: true }],
        styles: {
            traditional: [{ type: String, trim: true }],
            modern: [{ type: String, trim: true }],
            eclectic: [{ type: String, trim: true }],
            cultural: [{ type: String, trim: true }]
        }
    }
});

/**
 * Schema for storing additional details about the hotel.
 */
const AdditionalDetailsSchema = new Schema({
    isSustainable: {
        type: Boolean,
        default: false
    },
    hotelBuiltYear: {
        type: Date
    },
    lastRenovatedYear: {
        type: Date
    },
    selectedEventTypes: [{
        type: String
    }],
    awards: [
        { type: String }
    ],
    tradeLicenseFile: {
        type: String,
        trim: true
    }
});

/**
 * Schema for storing location details about the hotel.
 */
const LocationDetailsSchema = new Schema({
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
        default: 'United Arab Emirates',
        trim: true
    },
    mapLocation: {
        type: String,
        trim: true
    },
    mapLink: {
        type: String,
        trim: true
    },
    accessibilityFeatures: {
        airportShuttle: {
            type: Boolean,
            default: false
        },
        metro: {
            type: Boolean,
            default: false
        },
        taxi: {
            type: Boolean,
            default: false
        },
        bus: {
            type: Boolean,
            default: false
        }
    },
    parkingAvailable: {
        type: Boolean,
        default: false
    },
    valetParking: {
        type: Boolean,
        default: false
    }
});

/**
 * Main schema for storing hotel details.
 * Combines basic details, additional details, location details, and adds userId.
 */
const HotelSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    overview: {
        basicDetails: BasicDetailsSchema,
        additionalDetails: AdditionalDetailsSchema,
        locationDetails: LocationDetailsSchema
    },
    accommodation: {
        accommodations: {
            type: Number,
            default: 0
        }
    },
    pricing: {
        basePrice: {
            type: String,
            trim: true
        },
        mentionSeasons: {
            type: Boolean,
            default: false
        },
        highDemandMonths: [{
            type: String,
            trim: true
        }],
        midDemandMonths: [{
            type: String,
            trim: true
        }],
        lowDemandMonths: [{
            type: String,
            trim: true
        }]
    },
    offerPackage: [{
        type: Schema.Types.Mixed
    }],
    amenities: {
        roomFeatures: {
            type: Schema.Types.Mixed
        },
        businessFeatures: {
            type: Schema.Types.Mixed
        },
        recreationalFeatures: {
            type: Schema.Types.Mixed
        }
    },
    photoVideo: {
        images: [{
            type: String,
            trim: true
        }],
        videos: [{
            type: String,
            trim: true
        }],
        videoLinks: [{
            type: String,
            trim: true
        }]
    }
});

/**
 * Creating the model from the schema.
 */
const Hotel = mongoose.model('Hotel', HotelSchema);

module.exports = Hotel;
