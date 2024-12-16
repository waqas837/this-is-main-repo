// src/controllers/authController.js
const Vendor = require('@models/vendor.schema.js');
const emailService = require('@services/email.service');
const bcryptService = require('@services/bcrypt.service');
const tokenService = require('@services/token.service');
const verifyEmailTemplate = require('@templates/email.verify.js');
require('dotenv').config();

const signup = async (req, res) => {
  try {
    const { email, name, password } = req.body;

    const existingVendor = await Vendor.findOne({ email });
    if (existingVendor) {

      if (existingVendor.isVerified === false) {
        await existingVendor.deleteOne({ email })
      }
      else {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    const hashedPassword = await bcryptService.hashPassword(password);

    const newVendor = new Vendor({
      email,
      name,
      password: hashedPassword,
    });

    const { accessToken, refreshToken } = tokenService.generateTokens(newVendor._id,'vendor');

    newVendor.refreshToken = refreshToken;

    await newVendor.save();

    const verificationLink = `${process.env.BASE_URL}/api/vendor/auth/verify-email/${accessToken}`;

    const { subject, html } = verifyEmailTemplate(verificationLink);
    await emailService.queueEmail(email, subject, html);

    res.status(201).json({
      message: 'Vendor registered successfully. Please check your email to verify your account.'
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Error registering vendor' });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const payload = tokenService.verifyAccessToken(token);
    if (!payload) {
      return res.status(400).json({ message: 'Invalid or expired verification link' });
    }

    const vendor = await Vendor.findById(payload.userId);
    if (!vendor) {
      res.redirect('https://findmv.vercel.app/resend');
    }

    if (vendor.isVerified) {
      return res.status(400).json({ message: 'Email already verified' });
    }

    vendor.isVerified = true;
    await vendor.save();

    res.redirect('https://findmv.vercel.app/success');
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ message: 'Error verifying email' });
  }
};

module.exports = { signup, verifyEmail };
