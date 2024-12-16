const PaymentDetails = require('@models/paymentDetail.schema.js');
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Vendor = require('@models/vendor.schema.js');

const createPayment = async (req, res) => {
  const { token, email, cardHolderName, savedForFuture } = req.body;
  let vendorId =  req.user.userId;

  try {
    if (!vendorId) {
      return res.status(401).json({ error: 'Unauthorized: Vendor not found' });
    }

    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }

    console.log('Creating customer with email:', email);
    const customer = await stripe.customers.create({
      email: email,
    });

    let paymentMethod;
    if (savedForFuture) {
      console.log('Creating payment method with token:', token);
      paymentMethod = await stripe.paymentMethods.create({
        type: 'card',
        card: {
          token: token,
        },
      });

      console.log('Attaching payment method to customer');
      await stripe.paymentMethods.attach(paymentMethod.id, {
        customer: customer.id,
      });
    }

    console.log('Creating payment intent');
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 100, // You might want to make this dynamic
      currency: 'usd',
      customer: customer.id,
      payment_method: paymentMethod ? paymentMethod.id : undefined,
      capture_method: 'manual',
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never'
      }
    });

    console.log('Confirming payment intent');
    await stripe.paymentIntents.confirm(paymentIntent.id);

    console.log('Capturing payment');
    const capturedPayment = await stripe.paymentIntents.capture(paymentIntent.id);

    const paymentDetails = new PaymentDetails({
      userId: vendorId,
      cardHolderName: cardHolderName,
      savedForFuture: savedForFuture,
      customerId: customer.id,
      paymentMethodId: paymentMethod ? paymentMethod.id : undefined,
    });

    await paymentDetails.save();

    vendor.PaymentId = paymentDetails._id;
    await vendor.save();

    console.log('Payment details saved:', paymentDetails);

    console.log('Creating refund');
    const refund = await stripe.refunds.create({
      payment_intent: capturedPayment.id,
    });

    res.status(201).json({ message: 'Payment details saved successfully.' });
  } catch (error) {
    console.error('Error processing payment:', error);

    if (error.type === 'StripeCardError') {
      let errorMessage = error.message;
      switch (error.code) {
        case 'card_declined':
          errorMessage = 'Your card was declined. Please check your card details or try a different card.';
          break;
        case 'incorrect_cvc':
          errorMessage = 'The CVC code you entered is incorrect.';
          break;
        case 'expired_card':
          errorMessage = 'Your card has expired.';
          break;
        default:
          errorMessage = 'There was an issue with your card. Please try again.';
      }
      res.status(400).json({ error: errorMessage });
    } else if (error.type === 'StripeInvalidRequestError') {
      if (error.param === 'token') {
        res.status(400).json({ error: 'The provided token is invalid or has expired. Please try again with a new card.' });
      } else {
        res.status(400).json({ error: 'The payment details provided are invalid. Please try again.' });
      }
    } else {
      res.status(500).json({ error: 'An internal server error occurred. Please try again later.' });
    }
  }
};

const GetPayment = async (req, res) => {
    const userId = req.user.userId;
  
    try {
      const paymentMethod = await PaymentDetails.findOne({ userId: userId });
  
      if (paymentMethod) {
        res.status(200).json({
          success: true,
          message: 'Payment method retrieved successfully',
          paymentMethod,
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'No payment method found for this user',
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'An error occurred while retrieving the payment method',
        error: error.message,
      });
    }
  };
module.exports = { createPayment,GetPayment };
