const venueSubmissionTemplate = (name, email, phoneNumber, venueName) => {
  const logoUrl = 'https://firebasestorage.googleapis.com/v0/b/tempproject-4cb9b.appspot.com/o/FMV_LogoWhite_1.jpg?alt=media';

  return {
    subject: "New Venue Submission",
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Venue Submission</title>
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
              <h1 style="color: #FE4747; text-align: center; margin-bottom: 30px; font-size: 28px;">New Venue Submission</h1>
              <div style="background-color: #f9f9f9; border-radius: 5px; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                <p style="font-size: 16px; margin-bottom: 20px; text-align: center; color: #555;">A new venue has been submitted for review. Details are as follows:</p>
                <table width="100%" cellpadding="10" cellspacing="0" style="border-collapse: separate; border-spacing: 0 10px;">
                  <tr>
                    <td style="background-color: #FFE5E5; padding: 12px; border-radius: 5px 0 0 5px; font-weight: bold; width: 40%;">Name:</td>
                    <td style="background-color: #ffffff; padding: 12px; border-radius: 0 5px 5px 0; border: 1px solid #FFE5E5;">${name}</td>
                  </tr>
                  <tr>
                    <td style="background-color: #FFE5E5; padding: 12px; border-radius: 5px 0 0 5px; font-weight: bold;">Email:</td>
                    <td style="background-color: #ffffff; padding: 12px; border-radius: 0 5px 5px 0; border: 1px solid #FFE5E5;">${email}</td>
                  </tr>
                  <tr>
                    <td style="background-color: #FFE5E5; padding: 12px; border-radius: 5px 0 0 5px; font-weight: bold;">Phone Number:</td>
                    <td style="background-color: #ffffff; padding: 12px; border-radius: 0 5px 5px 0; border: 1px solid #FFE5E5;">${phoneNumber}</td>
                  </tr>
                  <tr>
                    <td style="background-color: #FFE5E5; padding: 12px; border-radius: 5px 0 0 5px; font-weight: bold;">Venue Name:</td>
                    <td style="background-color: #ffffff; padding: 12px; border-radius: 0 5px 5px 0; border: 1px solid #FFE5E5;">${venueName}</td>
                  </tr>
                </table>
                <p style="font-size: 16px; margin-top: 30px; text-align: center; color: #555;">Please review this submission at your earliest convenience.</p>
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

module.exports = venueSubmissionTemplate;
