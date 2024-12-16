
const Hotel = require('../../models/hotel-schema');
const Vendor = require('../../models/vendor.schema');

// POST /api/hotels/create
exports.createHotel = async (req, res) => {
    try {
        console.log('Request body:', req.body);

        const { userId } = req.body;
        console.log("User ID:", userId);
        const user = await Vendor.findById(userId);
        console.log("User:", user);

        if (!user) {
            // console.log('User not found');
            return res.status(404).json({ error: 'User not found' });
        }

        // Additional logs before creating the hotel
        console.log('Creating hotel with data:', req.body);

        // Create a new Hotel document
        const newHotel = new Hotel(req.body);


        // Save the new hotel document
        await newHotel.save();
        console.log('Hotel created successfully:', newHotel);

        // Respond with success
        res.status(201).json({ success: true, message: 'Hotel created successfully', hotel: newHotel });
    } catch (err) {
        console.error('Error creating hotel:', err);
        res.status(500).json({ error: 'Server error', details: err.message });
    }
};
