// EmailService.js

const SibApiV3Sdk = require('sib-api-v3-sdk');
const queueService = require('@services/queue.service');
require('dotenv').config();

class EmailService {
  constructor() {
    this.defaultClient = SibApiV3Sdk.ApiClient.instance;
    this.apiKey = this.defaultClient.authentications['api-key'];
    this.apiKey.apiKey = process.env.SENDINBLUE_API_KEY;
    this.apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    this.sender = { email: process.env.SENDER };
    this.queueName = 'email_queue';

    // Start processing the email queue
    this.startProcessingQueue();
  }

  async queueEmail(to, subject, html) {
    const startTime = Date.now();
    try {
      await queueService.addToQueue(this.queueName, { to, subject, html });
      const endTime = Date.now();
      console.log(`Email queued for ${to} in ${endTime - startTime}ms`);
    } catch (error) {
      console.error(`Error queueing email for ${to}:`, error);
      throw error; // Propagate the error to be handled by the caller
    }
  }

  async sendEmail(to, subject, html, retries = 3) {
    try {
      const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
      sendSmtpEmail.subject = subject;
      sendSmtpEmail.htmlContent = html;
      sendSmtpEmail.sender = this.sender;
      sendSmtpEmail.to = [{ email: to }];

      const result = await this.apiInstance.sendTransacEmail(sendSmtpEmail);
      console.log('Email sent successfully:', result);
    } catch (error) {
      console.error('Error sending email:', error);
      if (retries > 0) {
        console.log(`Retrying... (${retries} attempts left)`);
        await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for 5 seconds before retrying
        return this.sendEmail(to, subject, html, retries - 1);
      }
      throw error;
    }
  }

  async processEmailQueue() {
    try {
      await queueService.processQueue(this.queueName, async (emailData) => {
        try {
          await this.sendEmail(emailData.to, emailData.subject, emailData.html);
        } catch (error) {
          console.error('Failed to send email, re-queueing:', error);
          await this.queueEmail(emailData.to, emailData.subject, emailData.html);
        }
      });
    } catch (error) {
      console.error('Error processing email queue:', error);
      setTimeout(() => this.processEmailQueue(), 5000);
    }
  }

  startProcessingQueue() {
    // this.processEmailQueue().catch(error => {
    //   console.error('Failed to start processing email queue:', error);
    //   setTimeout(() => this.startProcessingQueue(), 5000);
    // });
  }
}

module.exports = new EmailService();
