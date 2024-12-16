const HotelVenue = require('@models/venueHotel.schema.js');
const VenuesSchema = require('@models/venues.schema.js');
const Vendor = require('@models/vendor.schema.js');
const Payment = require('@models/payment.schema.js');

const getVenues = async (req, res) => {
    try {
        const vendorId = req.user.userId;

        const vendor = await Vendor.findOne({ _id: vendorId });

        if (!vendor) {
            return res.status(404).json({ error: 'Vendor not found' });
        }

        let venueDetails = {};
        console.log(await HotelVenue.find())
        console.log(vendor.HotelVenueId)
        console.log(vendor.VenuesId)
        if (vendor.HotelVenueId) {
            const hotelVenue = await HotelVenue.findOne({ _id: vendor.HotelVenueId });
            if (hotelVenue) {
                venueDetails.hotelVenue = hotelVenue;
            }
        }

        if (vendor.VenuesId) {
            const venues = await VenuesSchema.findOne({ _id: vendor.VenuesId });
            if (venues) {
                venueDetails.venues = venues;
            }
        }

        const payment = await Payment.findOne({ vendorId });

        if (!payment) {
            return res.status(404).json({ error: 'Payment details not found' });
        }

        const response = {
            venueDetails,
            paymentDetails: payment
        };

        return res.status(200).json(response);

    } catch (error) {
        console.error('Error getting venues:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { getVenues };
