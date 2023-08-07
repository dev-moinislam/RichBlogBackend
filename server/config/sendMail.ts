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
            <div style="width: 100%; font-family: Arial, sans-serif; ">
            <div style="max-width: 700px; background-color: #d4e9fc; margin: auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
        
                <h2 style="text-align: center; text-transform: uppercase; color: #0051a8; font-style:italic">
                    Welcome, <span style="color: green; font-weight: bold;">${username}</span>
                </h2>
        
                <p style="color: #444; text-align:center">
                    Congratulations! You're almost set to start using 
                    <span style="color: orange; font-weight: bold;">Rich Blog</span>.
                </p>
        
        
                <div style="width: 100%; margin-left:35%;">
                    <a href=${url} style="background: crimson; text-decoration: none; color: white; padding: 10px 20px; margin: 10px 0; text-align: center; border-radius: 5px;">
                        ${txt}
                    </a>
                </div>
                <p style="color: #444;text-align:center">
                    Just click the avobe button to validate your email address.
                </p>
                <hr/>
                <p style="color: #444;">
                    If the button doesn't work for any reason, you can also click on the link below:
                </p>
        
                <div style="color: #0051a8; text-decoration: underline;">
                    ${url}
                </div>
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