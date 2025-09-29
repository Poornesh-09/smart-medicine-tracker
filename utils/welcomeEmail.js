// const nodemailer = require("nodemailer");

// const sendWelcomeEmail = async (toEmail, trustedName, userName) => {
//   try {
//     const transporter = nodemailer.createTransport({
//       service: "gmail", // or smtp
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     const mailOptions = {
//       from: `"Smart Medicine Tracker" <${process.env.EMAIL_USER}>`,
//       to: toEmail,
//       subject: "🌸 Welcome to the Smart Medicine Tracker Family!",
//       html: `
//         <p>Hello <b>${trustedName}</b>,</p>

//         <p>We’re happy to let you know that <b>${userName}</b> has added you as a trusted family member in the <b>Smart Medicine Tracker</b>.</p>

//         <p>As a trusted person, you’ll receive gentle reminders and updates about <b>${userName}’s</b> medicines to help ensure their health and well-being.</p>

//         <p>💖 Thank you for being a part of their care journey!</p>

//         <p>Best regards,<br>
//         Smart Medicine Tracker Team</p>
//       `,
//     };

//     await transporter.sendMail(mailOptions);
//     console.log("✅ Welcome email sent successfully");
//   } catch (error) {
//     console.error("❌ Failed to send welcome email:", error);
//   }
// };

// module.exports = { sendWelcomeEmail };

const nodemailer = require("nodemailer");

const sendWelcomeEmail = async (toEmail, trustedName, userName) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail", // or smtp
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Smart Medicine Tracker" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: "🌸 Welcome to the Smart Medicine Tracker Family!",
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Smart Medicine Tracker</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa; line-height: 1.6;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 40px 20px;">
                <!-- Main Container -->
                <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; box-shadow: 0 8px 32px rgba(0,0,0,0.1); overflow: hidden;">
                  
                  <!-- Header with Gradient -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                      <div style="background-color: rgba(255,255,255,0.2); width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; font-size: 36px;">
                        💊
                      </div>
                      <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600; letter-spacing: -0.5px;">
                        Smart Medicine Tracker
                      </h1>
                      <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">
                        Healthcare made simple and connected
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Welcome Message -->
                  <tr>
                    <td style="padding: 40px 30px;">
                      <div style="background: linear-gradient(135deg, #ffeaa7 0%, #fab1a0 100%); padding: 20px; border-radius: 12px; margin-bottom: 30px; text-align: center;">
                        <h2 style="color: #2d3436; margin: 0 0 10px 0; font-size: 24px; font-weight: 600;">
                          🌸 Welcome to Our Family!
                        </h2>
                        <p style="color: #636e72; margin: 0; font-size: 16px;">
                          You've been invited to join someone's care journey
                        </p>
                      </div>
                      
                      <div style="color: #2d3436; font-size: 16px; line-height: 1.8;">
                        <p style="margin: 0 0 20px 0;">
                          Hello <strong style="color: #6c5ce7; font-weight: 600;">${trustedName}</strong>,
                        </p>
                        
                        <p style="margin: 0 0 20px 0;">
                          We're delighted to inform you that <strong style="color: #6c5ce7; font-weight: 600;">${userName}</strong> has added you as a trusted family member in the <strong>Smart Medicine Tracker</strong> platform.
                        </p>
                        
                        <div style="background-color: #f8f9fa; border-left: 4px solid #6c5ce7; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0;">
                          <p style="margin: 0; color: #2d3436; font-style: italic;">
                            As a trusted person, you'll receive gentle reminders and updates about <strong>${userName}'s</strong> medications to help ensure their health and well-being.
                          </p>
                        </div>
                        
                        <div style="text-align: center; margin: 30px 0;">
                          <div style="background: linear-gradient(135deg, #fd79a8 0%, #fdcb6e 100%); padding: 20px; border-radius: 12px; display: inline-block;">
                            <span style="font-size: 24px; margin-right: 10px;">💖</span>
                            <span style="color: #2d3436; font-weight: 600; font-size: 18px;">
                              Thank you for being part of their care journey!
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                  
                  <!-- Features Section -->
                  <tr>
                    <td style="padding: 0 30px 30px 30px;">
                      <h3 style="color: #2d3436; margin: 0 0 20px 0; font-size: 20px; font-weight: 600; text-align: center;">
                        What You Can Expect
                      </h3>
                      
                      <table role="presentation" style="width: 100%;">
                        <tr>
                          <td style="width: 33.33%; padding: 15px; text-align: center; vertical-align: top;">
                            <div style="background-color: #e8f4fd; width: 50px; height: 50px; border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center; font-size: 20px;">
                              🔔
                            </div>
                            <h4 style="color: #2d3436; margin: 0 0 8px 0; font-size: 14px; font-weight: 600;">
                              Smart Reminders
                            </h4>
                            <p style="color: #636e72; margin: 0; font-size: 12px; line-height: 1.4;">
                              Gentle notifications about medication schedules
                            </p>
                          </td>
                          <td style="width: 33.33%; padding: 15px; text-align: center; vertical-align: top;">
                            <div style="background-color: #e8f5e8; width: 50px; height: 50px; border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center; font-size: 20px;">
                              📊
                            </div>
                            <h4 style="color: #2d3436; margin: 0 0 8px 0; font-size: 14px; font-weight: 600;">
                              Health Updates
                            </h4>
                            <p style="color: #636e72; margin: 0; font-size: 12px; line-height: 1.4;">
                              Regular progress reports and insights
                            </p>
                          </td>
                          <td style="width: 33.33%; padding: 15px; text-align: center; vertical-align: top;">
                            <div style="background-color: #fef3e8; width: 50px; height: 50px; border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center; font-size: 20px;">
                              🤝
                            </div>
                            <h4 style="color: #2d3436; margin: 0 0 8px 0; font-size: 14px; font-weight: 600;">
                              Connected Care
                            </h4>
                            <p style="color: #636e72; margin: 0; font-size: 12px; line-height: 1.4;">
                              Stay connected to their wellness journey
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%); padding: 30px; text-align: center;">
                      <p style="color: #ffffff; margin: 0 0 15px 0; font-size: 16px; font-weight: 600;">
                        Best regards,
                      </p>
                      <p style="color: rgba(255,255,255,0.9); margin: 0 0 20px 0; font-size: 14px;">
                        The Smart Medicine Tracker Team
                      </p>
                      
                      <div style="border-top: 1px solid rgba(255,255,255,0.2); padding-top: 20px; margin-top: 20px;">
                        <p style="color: rgba(255,255,255,0.7); margin: 0; font-size: 12px; line-height: 1.5;">
                          This email was sent because you were added as a trusted contact.<br>
                          Smart Medicine Tracker - Making healthcare connected and caring.
                        </p>
                      </div>
                    </td>
                  </tr>
                  
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Beautiful welcome email sent successfully");
  } catch (error) {
    console.error("❌ Failed to send welcome email:", error);
  }
};

module.exports = { sendWelcomeEmail };
