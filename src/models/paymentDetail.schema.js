const mongoose = require('mongoose');

const paymentDetailsSchema = new mongoose.Schema({
  userId: {
    type: String,

  },
  cardHolderName: {
    type: String,
  },
  savedForFuture: {
    type: Boolean,
    default: false
  },
  customerId: {
    type: String,
  },
  status: {
    type: String,
    default:'unpaid'
  },
  paymentMethodId: {
    type: String
  },
  sessionId: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const PaymentDetails = mongoose.model('PaymentDetails', paymentDetailsSchema);

module.exports = PaymentDetails;
