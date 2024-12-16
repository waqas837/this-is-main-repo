const Vendor = require('@models/vendor.schema.js');
const bcryptService = require('@services/bcrypt.service');
const tokenService = require('@services/token.service');

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const vendor = await Vendor.findOne({ email });

    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    if (!vendor.isVerified) {
      await Vendor.deleteOne({ _id: vendor._id });
      return res.status(403).json({ 
        message: 'Please sign up again.'
      });
    }

    const isPasswordValid = await bcryptService.comparePassword(password, vendor.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const { accessToken, refreshToken } = tokenService.generateTokens(vendor._id,'vendor');

    vendor.refreshToken = refreshToken;
    await vendor.save();

    res.status(200).json({
      message: 'Login successful',
      vendor: {
        id: vendor._id,
        name: vendor.name,
        email: vendor.email,
      },
      accessToken,
      refreshToken
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'An error occurred during login' });
  }
};

module.exports = { login };
