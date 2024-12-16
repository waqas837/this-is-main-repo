const PaymentDetails = require('@models/paymentDetail.schema.js');
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Vendor = require('@models/vendor.schema.js');


const Checkpayment = async (req, res) => {
    const { token, email, cardHolderName, savedForFuture, amount, description } = req.body;
    let vendorId = req.user.userId;

    try {
        if (!vendorId) {
            return res.status(401).json({ error: 'Unauthorized: Vendor not found' });
        }

        const vendor = await Vendor.findById(vendorId);
        if (!vendor) {
            return res.status(404).json({ error: 'Vendor not found' });
        }

        console.log('Creating customer:');
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            success_url: `${process.env.BASE_URL}/api/vendor/payment-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.BASE_URL}/api/vendor/payment-failed?session_id={CHECKOUT_SESSION_ID}`,
            customer_email: email,
            client_reference_id: vendorId,
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        unit_amount: amount*100,
                        product_data: {
                            name: cardHolderName,
                            description: description,
                            images: ['https://firebasestorage.googleapis.com/v0/b/tempproject-4cb9b.appspot.com/o/FMV_LogoWhite_1.jpg?alt=media'],
                        }
                    },
                    quantity: 1,
                }
            ]
        });

        const paymentDetails = new PaymentDetails({
            userId: vendorId,
            cardHolderName: cardHolderName,
            savedForFuture: savedForFuture,
            sessionId: session.id
        });

        await paymentDetails.save();

        return res.status(200).json({ success: true, message: 'Payment successfully created', session });
    } catch (err) {
        console.error('Error processing payment:', err);

        let errorMessage = 'An error occurred while processing the payment.';
        if (err.type === 'StripeCardError') {
            errorMessage = 'Your card was declined. Please check your card details or try a different card.';
        } else if (err.type === 'RateLimitError') {
            errorMessage = 'Too many requests made to the API too quickly.';
        } else if (err.type === 'StripeInvalidRequestError') {
            errorMessage = 'Invalid parameters were supplied to Stripe\'s API.';
        } else if (err.type === 'StripeAPIError') {
            errorMessage = 'An error occurred internally with Stripe\'s API.';
        } else if (err.type === 'StripeConnectionError') {
            errorMessage = 'Some kind of error occurred during the HTTPS communication.';
        } else if (err.type === 'StripeAuthenticationError') {
            errorMessage = 'You may have provided incorrect API keys.';
        }

        return res.status(500).json({ success: false, message: errorMessage, error: err.message });
    }
};



const PaymentSuccess = async (req, res) => {
    try {
        const { session_id } = req.query;

        if (!session_id) {
            return res.status(400).json({ success: false, message: 'Session ID is missing' });
        }

        const session = await stripe.checkout.sessions.retrieve(session_id);

        if (!session) {
            return res.status(404).json({ success: false, message: 'Session not found' });
        }

        // const setupIntentId = session.setup_intent;
        // const setupIntent = await stripe.setupIntents.retrieve(setupIntentId);

        const paymentDetails = await PaymentDetails.findOne({ sessionId: session_id });

        if (!paymentDetails) {
            return res.status(404).json({ success: false, message: 'Payment details not found' });
        }

        
            // const paymentMethodId = setupIntent.payment_method;
            // const customerId = setupIntent.customer;

            paymentDetails.status = 'paid';
            // paymentDetails.paymentMethodId = paymentMethodId;
            // paymentDetails.customerId = customerId;
            await paymentDetails.save();


            res.redirect('https://findmv.vercel.app/payment-success');
        } catch (err) {
        console.error('Error handling payment success:', err);
        return res.status(500).json({ success: false, message: 'An error occurred while processing the payment success', error: err.message });
    }
};



const PaymentFailed = async (req, res) => {
    try {
        const { session_id } = req.query;

        if (!session_id) {
            return res.status(400).json({ success: false, message: 'Session ID is missing' });
        }

        const session = await stripe.checkout.sessions.retrieve(session_id);

        if (!session) {
            return res.status(404).json({ success: false, message: 'Session not found' });
        }

        console.log(`Payment failed for session: ${session_id}`);

        const paymentDetails = await PaymentDetails.findOne({ sessionId: session_id });
        if (paymentDetails) {
            paymentDetails.status = 'failed';
            await paymentDetails.save();
        }

        res.redirect('https://findmv.vercel.app/payment-failed');
    } catch (err) {
        console.error('Error handling payment failure:', err);
        return res.status(500).json({ success: false, message: 'An error occurred while processing the payment failure', error: err.message });
    }
};


module.exports = { Checkpayment,PaymentSuccess,PaymentFailed };
