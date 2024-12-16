const BillingInfo = require('@models/billingInfo.schema.js');


const createBillingInfo = async (req, res) => {
    try {
        const vendorId = req.user.userId;
        const {
            invoiceName,
            trnNo,
            addressLine1,
            addressLine2,
            city,
            area,
            poBox,
            country
        } = req.body;


        const billingInfo = new BillingInfo({
            vendorId,
            invoiceName,
            trnNo,
            addressLine1,
            addressLine2,
            city,
            area,
            poBox,
            country
        });

        await billingInfo.save();

        return res.status(201).json({ success: true, message: 'Billing information saved successfully', billingInfo });
    } catch (error) {
        console.error('Error saving billing information:', error);
        return res.status(500).json({ success: false, message: 'An error occurred while saving billing information', error: error.message });
    }
};

module.exports = { createBillingInfo };
