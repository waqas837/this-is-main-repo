const HotelVenue = require('@models/venueHotel.schema.js');
const VenuesSchema = require('@models/venues.schema.js');
const Payment = require('@models/payment.schema.js');
const Vendor = require('@models/vendor.schema.js');

const addVenue = async (req, res) => {
    try {
        const { type, coupon, ...venueData } = req.body;
        const vendorId = req.user.userId;

        if (!type) {
            return res.status(400).json({ error: 'Type is required' });
        }

        let subscriptionStartDate;
        let subscriptionEndDate;

        if (coupon === '6MonthsCoupon') {
            subscriptionStartDate = new Date();
            subscriptionEndDate = new Date();
            subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 6);
        }

        const payment = new Payment({
            vendorId,
            typeOfVenue: type,
            totalAmount: venueData.totalAmount,
            discountedAmount: venueData.discountedAmount,
            paymentId: venueData.paymentId,
            coupon,
            subscriptionStartDate,
            subscriptionEndDate
        });

        await payment.save();

        let venue;
        if (type === 'HotelStayandVenue') {
            venue = new HotelVenue({
                vendorID: vendorId,
                StayAlong: venueData.StayAlong,
                RestaurantsWithAlcohol: venueData.RestaurantsWithAlcohol,
                RestaurantsWithoutAlcohol: venueData.RestaurantsWithoutAlcohol,
                VenuesCount: venueData.VenuesCount,
                PaymentId: payment._id
            });

            await venue.save();

            await Vendor.updateOne({ _id: vendorId }, { HotelVenueId: venue._id });

            return res.status(201).json({ message: 'Hotel venue added successfully', venue });

        } else if (type === 'Venues') {
            if (!venueData.typeOfVenues) {
                return res.status(400).json({ error: 'typeOfVenues is required for Venues type' });
            }

            const venueSchema = {
                vendorId,
                typeOfVenues: venueData.typeOfVenues,
                restaurants: {
                    withAlcohol: venueData.RestaurantsWithAlcohol || 0,
                    withoutAlcohol: venueData.RestaurantsWithoutAlcohol || 0
                },
                locationSame: venueData.locationSame,
                group: venueData.group,
                arePartofestabishment: venueData.arePartofestabishment,
                paymentId: payment._id
            };

            if (venueData.typeOfVenues === 'individual') {
                if (!venueData.venueName) {
                    return res.status(400).json({ error: 'Venue name is required for individual type' });
                }

                venueSchema.venueTypes = new Map();
                venueSchema.venueTypes.set(venueData.venueName, {
                    name: venueData.venueName,
                    isAvailable: true,
                    count: venueData.count || 1
                });
            }

            if (venueData.group === 'yes') {
                if (!venueData.groupName) {
                    return res.status(400).json({ error: 'Group name is required when group is yes' });
                }
                venueSchema.groupName = venueData.groupName;
            }

            venue = new VenuesSchema(venueSchema);
            await venue.save();

            await Vendor.updateOne({ _id: vendorId }, { VenuesId: venue._id });

            return res.status(201).json({ message: 'Venue added successfully', venue });

        } else {
            return res.status(400).json({ error: 'Invalid type' });
        }

    } catch (error) {
        console.error('Error adding venue:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { addVenue };
