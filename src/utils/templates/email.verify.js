const verifyEmailTemplate = (verificationLink) => {
  const logoUrl = 'https://firebasestorage.googleapis.com/v0/b/tempproject-4cb9b.appspot.com/o/FMV_LogoWhite_1.jpg?alt=media';

  return {
    subject: "Welcome to FindMyVenue - Verify Your Email",
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; margin: 0; padding: 0;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
          <tr>
            <td style="padding: 40px 20px; text-align: center; background-color: #FE4747;">
              <img src="${logoUrl}" alt="FindMyVenue Logo" style="max-width: 200px; height: auto;">
            </td>
          </tr>
          <tr>
            <td style="padding: 30px;">
              <h1 style="color: #FE4747; text-align: center; margin-bottom: 30px; font-size: 28px;">Welcome to FindMyVenue!</h1>
              <div style="background-color: #f9f9f9; border-radius: 5px; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                <p style="font-size: 16px; margin-bottom: 20px; text-align: center; color: #555;">Thank you for joining FindMyVenue. We're excited to have you on board!</p>
                <p style="font-size: 16px; margin-bottom: 20px; text-align: center; color: #555;">To get started, please verify your email address by clicking the button below:</p>
                <div style="text-align: center; margin-bottom: 30px;">
                  <a href="${verificationLink}" style="display: inline-block; background-color: #FE4747; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">Verify Email</a>
                </div>
                <table width="100%" cellpadding="10" cellspacing="0" style="border-collapse: separate; border-spacing: 0 10px;">
                  <tr>
                    <td style="background-color: #FFE5E5; padding: 12px; border-radius: 5px 0 0 5px; font-weight: bold; width: 40%;">Important:</td>
                    <td style="background-color: #ffffff; padding: 12px; border-radius: 0 5px 5px 0; border: 1px solid #FFE5E5;">This link will expire in 24 hours for security reasons.</td>
                  </tr>
                </table>
                <p style="font-size: 14px; margin-top: 30px; text-align: center; color: #555;">If you're having trouble clicking the button, copy and paste the URL below into your web browser:</p>
                <p style="font-size: 14px; text-align: center; color: #555; word-break: break-all;">${verificationLink}</p>
                <p style="font-size: 14px; margin-top: 30px; text-align: center; color: #555;">If you didn't create an account with us, please ignore this email.</p>
              </div>
            </td>
          </tr>
          <tr>
            <td style="background-color: #FE4747; color: white; text-align: center; padding: 20px;">
              <p style="margin: 0; font-size: 14px;">&copy; 2024 FindMyVenue. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  };
};

module.exports = verifyEmailTemplate;
