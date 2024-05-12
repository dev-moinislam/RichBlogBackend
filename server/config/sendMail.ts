const nodemailer = require("nodemailer");
import { OAuth2Client } from "google-auth-library";

const OAUTH_PLAYGROUND = "https://developers.google.com/oauthplayground";

const CLIENT_ID = `${process.env.MAIL_CLIENT_ID}`;
const CLIENT_SECRET = `${process.env.MAIL_CLIENT_SECRET}`;
const REFRESH_TOKEN = `${process.env.MAIL_REFRESH_TOKEN}`;
const SENDER_MAIL = `${process.env.SENDER_EMAIL_ADDRESS}`;

// send mail
const sendEmail = async (to: string, url: string, txt: string) => {
  const oAuth2Client = new OAuth2Client(
    CLIENT_ID,
    CLIENT_SECRET,
    OAUTH_PLAYGROUND
  );

  oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

  try {
    const access_token = await oAuth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: SENDER_MAIL,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        access_token,
      },
    });

    const mailOptions = {
      from: SENDER_MAIL,
      to: to,
      subject: "Rich Blog",
      html: `
      <div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
      <h2 style="text-align: center; text-transform: uppercase; color: teal;">Welcome to the DevAT channel</h2>
      <p>Congratulations! You're almost set to start using Rich Blog. Just click the button below to validate your email address.</p>
      
      <div style="text-align: center; margin-top: 30px;">
          <a href="${url}" style="background: crimson; text-decoration: none; color: white; padding: 15px 40px; display: inline-block; border-radius: 5px; font-size: 18px;">${txt}</a>
      </div>
  
      <p>If the button doesn't work for any reason, you can also click on the link below:</p>
      
      <div style="text-align: center;">
          <a href="${url}" style="text-decoration: none; color: teal; font-size: 16px;">${url}</a>
      </div>
  </div>
  
            `,
    };

    const result = await transport.sendMail(mailOptions);
    return result;
  } catch (err) {
    console.log(err);
  }
};

export default sendEmail;