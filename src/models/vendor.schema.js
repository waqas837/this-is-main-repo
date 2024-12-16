
const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  profilePic: {
    type: String,
  },
  refreshToken: {
    type: String
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpires: {
    type: Date
  },
  resetPasswordStatus: {
    type: String,
    default: 'pending'
  },
  venueType: {
    type: String,
    enum: ['hotelstayVenue', 'Venues']
  },
  HotelVenueId: {
    type: String
  },
  VenuesId: {
    type: String
  },
  PaymentId: {
    type: String,
  },
}, {
  timestamps: true
});

const Vendor = mongoose.model('Vendor', vendorSchema);

module.exports = Vendor;
