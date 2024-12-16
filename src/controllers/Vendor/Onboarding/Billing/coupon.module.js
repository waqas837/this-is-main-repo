const Coupon = require('@models/coupon.schema.js');

const createCoupon = async (req, res) => {
    try {
        const { code, discount, expirationDate } = req.body;

        const existingCoupon = await Coupon.findOne({ code });
        if (existingCoupon) {
            return res.status(400).json({ success: false, message: 'Coupon code already exists' });
        }

        const coupon = new Coupon({
            code,
            discount,
            expirationDate,
            isActive: true,
            usedBy: []
        });

        await coupon.save();

        return res.status(201).json({ success: true, message: 'Coupon created successfully', coupon });
    } catch (error) {
        console.error('Error creating coupon:', error);
        return res.status(500).json({ success: false, message: 'An error occurred while creating the coupon', error: error.message });
    }
};

const validateCoupon = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { code } = req.body;

        const coupon = await Coupon.findOne({ code });

        if (!coupon) {
            return res.status(400).json({ success: false, valid: false, message: 'Invalid coupon code' });
        }

        const currentDate = new Date();
        if (coupon.expirationDate && coupon.expirationDate < currentDate) {
            return res.status(400).json({ success: false, valid: false, message: 'Coupon has expired' });
        }

        if (!coupon.isActive) {
            return res.status(400).json({ success: false, valid: false, message: 'Coupon is not active' });
        }

        if (coupon.usedBy.includes(userId)) {
            return res.status(400).json({ success: false, valid: false, message: 'Coupon already used by this user' });
        }

        coupon.usedBy.push(userId);
        await coupon.save();

        return res.status(200).json({ success: true, valid: true, discount: coupon.discount, message: 'Coupon applied successfully' });
    } catch (error) {
        console.error('Error validating coupon:', error);
        return res.status(500).json({ success: false, valid: false, message: 'An error occurred while validating the coupon', error: error.message });
    }
};


module.exports = { createCoupon,validateCoupon };
