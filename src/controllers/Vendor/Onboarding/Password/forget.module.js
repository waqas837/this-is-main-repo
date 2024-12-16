const Vendor = require('@models/vendor.schema.js');
const crypto = require('crypto');
const emailService = require('@services/email.service');
const forgotPasswordTemplate = require('@templates/password.verify.js');

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const vendor = await Vendor.findOne({ email });

    if (!vendor) {
      return res.status(404).json({ message: 'No account with that email address exists.' });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');

    vendor.resetPasswordToken = resetToken;
    vendor.resetPasswordExpires = Date.now() + 600000;
    vendor.resetPasswordStatus = 'pending';

    await vendor.save();

    const resetUrl = `${process.env.BASE_URL}/api/vendor/forget/reset-password/${resetToken}`;

    const emailContent = forgotPasswordTemplate(resetUrl);

    await emailService.queueEmail(
      vendor.email,
      emailContent.subject,
      emailContent.html
    );

    res.status(200).json({ message: 'Password reset link sent to email address' });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'An error occurred while processing your request' });
  }
};


const validateResetToken = async (req, res) => {
  try {
    const { token } = req.params;
  
    const vendor = await Vendor.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });
  
    if (!vendor) {
      return res.status(400).json({ message: 'Password reset token is invalid or has expired' });
    }
    vendor.resetPasswordStatus = 'valid';
    await vendor.save();
  
    const encodedEmail = encodeURIComponent(vendor.email);
  
    res.redirect(`https://findmv.vercel.app/resetPassword?email=${encodedEmail}`);
  
  } catch (error) {
    console.error('Validate reset token error:', error);
    res.status(500).json({ message: 'An error occurred while validating the reset token' });
  }
};


module.exports = { forgotPassword, validateResetToken };
