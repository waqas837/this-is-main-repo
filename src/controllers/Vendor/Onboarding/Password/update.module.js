const Vendor = require('@models/vendor.schema.js');
const bcryptService = require('@services/bcrypt.service');

const updatePassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const vendor = await Vendor.findOne({
      email,
      resetPasswordExpires: { $gt: Date.now() },
      resetPasswordStatus: 'valid'
    });

    if (!vendor) {
      return res.status(400).json({ message: 'Invalid or expired password reset token' });
    }

    const hashedPassword = await bcryptService.hashPassword(password);

    vendor.password = hashedPassword;
    vendor.resetPasswordToken = undefined;
    vendor.resetPasswordExpires = undefined;
    vendor.resetPasswordStatus = 'used';

    await vendor.save();

    res.status(200).json({ message: 'Password has been updated successfully' });

  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({ message: 'An error occurred while updating the password' });
  }
};

module.exports = { updatePassword };
