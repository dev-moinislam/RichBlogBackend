const nodemailer=require('nodemailer')
import { OAuth2Client } from 'google-auth-library'


const OAUTH_PLAYGROUND = "https://developers.google.com/oauthplayground";

const CLIENT_ID = `${process.env.MAIL_CLIENT_ID}`;
const CLIENT_SECRET = `${process.env.MAIL_CLIENT_SECRET}`;
const REFRESH_TOKEN = `${process.env.MAIL_REFRESH_TOKEN}`;
const SENDER_MAIL = `${process.env.SENDER_EMAIL_ADDRESS}`;

// send mail
const sendEmail = async (to:string, url:string, txt:string, username:string) => {
  const oAuth2Client = new OAuth2Client(
    CLIENT_ID,
    CLIENT_SECRET,
    OAUTH_PLAYGROUND
  );

  oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

  try {
    const access_token = await oAuth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
        host: 'smtp.gmail.com', // Use the Gmail SMTP server
        port: 465, // SMTP port for secure connections
        secure: true, // Use SSL/TLS for secure connections
        auth: {
          type: 'OAuth2',
          user: SENDER_MAIL,
          clientId: CLIENT_ID,
          clientSecret: CLIENT_SECRET,
          refreshToken: REFRESH_TOKEN,
          accessToken: access_token,
        },
      });
      

    const mailOptions = {
      from: SENDER_MAIL,
      to: to,
      subject: "Rich Blog",
      html: `
      <div style="display: flex; justify-content: center; align-items: center; height: 100vh; width:100%">
        <div style="background-image: linear-gradient(to right, #3490dc, #9b5de5); padding: 2rem; border-radius: 0.5rem; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); height:200px;max-width:400px; text-align: center;">
          <h2 style="font-size: 2rem; font-weight: 600; color: white; margin-bottom: 1rem;">Welcome, ${username}</h2>
          <p style="color: white; margin-bottom: 1.5rem;">Congratulations on creating your account. We're thrilled to have you as a member of our <span style="color:purple">Rich Blog</span></p>
          <a href=${url} style="background-color: #38a169; color: white; padding: 0.5rem 1rem; border-radius: 0.25rem; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); cursor: pointer;text-decoration:none;">${txt}</a>
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

export default sendEmail