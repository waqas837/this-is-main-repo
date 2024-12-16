// controllers/emailController.js

const emailService = require('@services/email.service');
const venueSubmissionTemplate = require('@templates/venue.register.js');

 const submitEmail= async (req, res)=> {
    try {
      const { name, email, phoneNumber, venueName } = req.body;

      if (!name || !email || !phoneNumber || !venueName) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const { subject, html } = venueSubmissionTemplate(name, email, phoneNumber, venueName);

      await emailService.queueEmail(process.env.TO_EMAIL, subject, html);

      res.status(200).json({ message: 'Email send successfully' });
    } catch (error) {
      console.error('Error submitting email:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }


module.exports = {submitEmail};
