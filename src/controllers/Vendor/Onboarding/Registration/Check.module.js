const Vendor = require('@models/vendor.schema.js');
const tokenService = require('@services/token.service');

const checkController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Please provide email' });
    }

    const vendor = await Vendor.findOne({ email });

    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    if (password) {
      if (vendor.resetPasswordStatus === 'valid') {
        const { accessToken, refreshToken } = tokenService.generateTokens(vendor._id, 'vendor');

        vendor.refreshToken = refreshToken;
        await vendor.save();

        return res.status(200).json({
          verified: true,
          vendor: {
            id: vendor._id,
            name: vendor.name,
            email: vendor.email,
          },
          accessToken,
          refreshToken
        });
      } else {
        return res.status(200).json({ verified: false });
      }
    } else {
      if (vendor.isVerified) {
        const { accessToken, refreshToken } = tokenService.generateTokens(vendor._id, 'vendor');

        vendor.refreshToken = refreshToken;
        await vendor.save();

        return res.status(200).json({
          verified: true,
          vendor: {
            id: vendor._id,
            name: vendor.name,
            email: vendor.email,
          },
          accessToken,
          refreshToken
        });
      } else {
        return res.status(200).json({ verified: false });
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { checkController };
