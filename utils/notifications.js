// // utils/notifications.js
// const nodemailer = require('nodemailer');

// // Configure transporter
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS
//   }
// });

// /**
//  * Send medicine alert email to trusted members
//  * @param {string[]} memberEmails - array of trusted member emails
//  * @param {string} message - message to send
//  */
// async function sendNotificationToTrusted(memberEmails, message) {
//   try {
//     console.log('sendNotificationToTrusted called with:', memberEmails, message);

//     for (const email of memberEmails) {
//       try {
//         console.log(`Sending email to: ${email}`);
//         await transporter.sendMail({
//           from: `"Medicine Reminder" <${process.env.EMAIL_USER}>`,
//           to: email,
//           subject: "Medicine Alert",
//           text: message
//         });
//         console.log(`Email successfully sent to: ${email}`);
//       } catch (err) {
//         console.error(`Failed to send email to ${email}:`, err);
//       }
//     }
//   } catch (err) {
//     console.error('sendNotificationToTrusted outer error:', err);
//   }
// }



// module.exports = { sendNotificationToTrusted };

// // utils/notifications.js
// const nodemailer = require('nodemailer');

// // Configure transporter
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS
//   }
// });

// /**
//  * Send medicine alert email to trusted members
//  * @param {string[]} memberEmails - array of trusted member emails
//  * @param {string} medicineName - medicine name
//  * @param {string} doseTime - medicine time
//  * @param {string} userName - name of the user
//  */
// async function sendNotificationToTrusted(memberEmails, medicineName, doseTime, userName) {
//   try {
//     for (const email of memberEmails) {
//       try {
//         const htmlMessage = `
//           <div style="font-family: Arial, sans-serif; padding: 10px; color: #333;">
//             <h2 style="color: #e63946;">Medicine Alert 🚨</h2>
//             <p>Hello <b>Trusted Member</b>,</p>
//             <p>We wanted to let you know that <b>${userName}</b> missed taking their medicine:</p>
//             <p style="font-size: 16px;">
//               💊 <b>${medicineName}</b> was not taken at <b>${doseTime}</b>.
//             </p>
//             <p>Please remind them gently to stay on track with their medicines.</p>
//             <br/>
//             <p style="font-size: 13px; color: #888;">-- Smart Medicine Tracker</p>
//           </div>
//         `;

//         await transporter.sendMail({
//           from: `"Medicine Reminder" <${process.env.EMAIL_USER}>`,
//           to: email,
//           subject: "⚠️ Medicine Alert",
//           text: `${medicineName} was not taken at ${doseTime}`, // fallback plain text
//           html: htmlMessage
//         });

//         console.log(`Email successfully sent to: ${email}`);
//       } catch (err) {
//         console.error(`Failed to send email to ${email}:`, err);
//       }
//     }
//   } catch (err) {
//     console.error('sendNotificationToTrusted outer error:', err);
//   }
// }

// module.exports = { sendNotificationToTrusted };

// const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// /**
//  * Send medicine alert email to one trusted member
//  */
// async function sendNotificationToTrusted(toEmail, trustedName, medicineName, time, patientName) {
//   try {
//     const mailOptions = {
//       from: `"Smart Medicine Tracker" <${process.env.EMAIL_USER}>`,
//       to: toEmail,
//       subject: "🚨 Medicine Alert",
//       html: `
//         <p><b>Medicine Alert 🚨</b></p>
//         <p>Hello <b>${trustedName}</b>,</p>

//         <p>We wanted to let you know that <b>${patientName}</b> missed taking their medicine:</p>

//         <p>💊 <b>${medicineName}</b> was not taken at <b>${time}</b>.</p>

//         <p>Please remind them gently to stay on track with their medicines.</p>

//         <p>-- Smart Medicine Tracker</p>
//       `,
//     };

//     await transporter.sendMail(mailOptions);
//     console.log(`✅ Alert sent to ${trustedName} (${toEmail}) about ${patientName}`);
//   } catch (err) {
//     console.error("❌ Failed to send alert:", err);
//   }
// }

// module.exports = { sendNotificationToTrusted };

// const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// /**
//  * Send medicine alert email to one trusted member
//  */
// async function sendNotificationToTrusted(toEmail, trustedName, medicineName, time, patientName) {
//   try {
//     const mailOptions = {
//       from: `"Smart Medicine Tracker" <${process.env.EMAIL_USER}>`,
//       to: toEmail,
//       subject: "🚨 Medicine Alert - Gentle Reminder Needed",
//       html: `
//         <!DOCTYPE html>
//         <html lang="en">
//         <head>
//           <meta charset="UTF-8">
//           <meta name="viewport" content="width=device-width, initial-scale=1.0">
//           <title>Medicine Alert - Smart Medicine Tracker</title>
//         </head>
//         <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa; line-height: 1.6;">
//           <table role="presentation" style="width: 100%; border-collapse: collapse;">
//             <tr>
//               <td style="padding: 40px 20px;">
//                 <!-- Main Container -->
//                 <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; box-shadow: 0 8px 32px rgba(0,0,0,0.1); overflow: hidden;">
                  
//                   <!-- Alert Header -->
//                   <tr>
//                     <td style="background: linear-gradient(135deg, #ff7675 0%, #fd79a8 100%); padding: 30px; text-align: center;">
//                       <div style="background-color: rgba(255,255,255,0.2); width: 70px; height: 70px; border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center; font-size: 32px;">
//                         🚨
//                       </div>
//                       <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600; letter-spacing: -0.5px;">
//                         Medicine Alert
//                       </h1>
//                       <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 14px;">
//                         A gentle reminder is needed
//                       </p>
//                     </td>
//                   </tr>
                  
//                   <!-- Alert Content -->
//                   <tr>
//                     <td style="padding: 40px 30px;">
//                       <div style="color: #2d3436; font-size: 16px; line-height: 1.8;">
//                         <p style="margin: 0 0 20px 0; font-size: 18px;">
//                           Hello <strong style="color: #fd79a8; font-weight: 600;">${trustedName}</strong>,
//                         </p>
                        
//                         <p style="margin: 0 0 25px 0;">
//                           We wanted to let you know that <strong style="color: #6c5ce7; font-weight: 600;">${patientName}</strong> may need a gentle reminder about their medication.
//                         </p>
                        
//                         <!-- Medicine Details Card -->
//                         <div style="background: linear-gradient(135deg, #fff5f5 0%, #ffeaa7 50%, #fff5f5 100%); border: 2px solid #ff7675; border-radius: 12px; padding: 25px; margin: 25px 0; position: relative;">
//                           <div style="text-align: center; margin-bottom: 20px;">
//                             <div style="background-color: #ff7675; color: white; width: 60px; height: 60px; border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center; font-size: 24px; box-shadow: 0 4px 12px rgba(255,118,117,0.3);">
//                               💊
//                             </div>
//                             <h3 style="color: #2d3436; margin: 0; font-size: 20px; font-weight: 600;">
//                               Missed Medication
//                             </h3>
//                           </div>
                          
//                           <table role="presentation" style="width: 100%; background-color: rgba(255,255,255,0.8); border-radius: 8px; padding: 15px;">
//                             <tr>
//                               <td style="padding: 8px 0; border-bottom: 1px solid rgba(255,118,117,0.2);">
//                                 <strong style="color: #636e72; font-size: 14px;">Medicine:</strong>
//                               </td>
//                               <td style="padding: 8px 0; border-bottom: 1px solid rgba(255,118,117,0.2); text-align: right;">
//                                 <span style="color: #2d3436; font-weight: 600; font-size: 16px;">${medicineName}</span>
//                               </td>
//                             </tr>
//                             <tr>
//                               <td style="padding: 8px 0;">
//                                 <strong style="color: #636e72; font-size: 14px;">Scheduled Time:</strong>
//                               </td>
//                               <td style="padding: 8px 0; text-align: right;">
//                                 <span style="color: #2d3436; font-weight: 600; font-size: 16px;">${time}</span>
//                               </td>
//                             </tr>
//                           </table>
//                         </div>
                        
//                         <!-- Care Message -->
//                         <div style="background-color: #e8f4fd; border-left: 4px solid #74b9ff; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0;">
//                           <div style="display: flex; align-items: center; margin-bottom: 10px;">
//                             <span style="font-size: 20px; margin-right: 10px;">💙</span>
//                             <h4 style="color: #0984e3; margin: 0; font-size: 16px; font-weight: 600;">
//                               Your caring support matters
//                             </h4>
//                           </div>
//                           <p style="margin: 0; color: #2d3436; font-size: 14px; line-height: 1.6;">
//                             Please reach out to <strong>${patientName}</strong> with a gentle reminder. Your support helps them stay on track with their health journey.
//                           </p>
//                         </div>
//                       </div>
//                     </td>
//                   </tr>
                  
//                   <!-- Quick Actions -->
//                   <tr>
//                     <td style="padding: 0 30px 30px 30px;">
//                       <h3 style="color: #2d3436; margin: 0 0 20px 0; font-size: 18px; font-weight: 600; text-align: center;">
//                         Helpful Reminders
//                       </h3>
                      
//                       <table role="presentation" style="width: 100%;">
//                         <tr>
//                           <td style="width: 50%; padding: 15px; vertical-align: top;">
//                             <div style="background: linear-gradient(135deg, #a8e6cf 0%, #88d8a3 100%); padding: 20px; border-radius: 12px; text-align: center; height: 120px; display: flex; flex-direction: column; justify-content: center;">
//                               <div style="font-size: 32px; margin-bottom: 10px;">📱</div>
//                               <h4 style="color: #2d3436; margin: 0 0 8px 0; font-size: 14px; font-weight: 600;">
//                                 Send a Message
//                               </h4>
//                               <p style="color: #555; margin: 0; font-size: 12px; line-height: 1.4;">
//                                 A gentle text or call can make all the difference
//                               </p>
//                             </div>
//                           </td>
//                           <td style="width: 50%; padding: 15px; vertical-align: top;">
//                             <div style="background: linear-gradient(135deg, #ffd3a5 0%, #fd9853 100%); padding: 20px; border-radius: 12px; text-align: center; height: 120px; display: flex; flex-direction: column; justify-content: center;">
//                               <div style="font-size: 32px; margin-bottom: 10px;">🤗</div>
//                               <h4 style="color: #2d3436; margin: 0 0 8px 0; font-size: 14px; font-weight: 600;">
//                                 Show Support
//                               </h4>
//                               <p style="color: #555; margin: 0; font-size: 12px; line-height: 1.4;">
//                                 Your care and encouragement mean everything
//                               </p>
//                             </div>
//                           </td>
//                         </tr>
//                       </table>
//                     </td>
//                   </tr>
                  
//                   <!-- Footer -->
//                   <tr>
//                     <td style="background: linear-gradient(135deg, #636e72 0%, #2d3436 100%); padding: 25px 30px; text-align: center;">
//                       <p style="color: #ffffff; margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">
//                         Thank you for being a caring support system
//                       </p>
//                       <p style="color: rgba(255,255,255,0.8); margin: 0 0 15px 0; font-size: 14px;">
//                         — Smart Medicine Tracker Team
//                       </p>
                      
//                       <div style="border-top: 1px solid rgba(255,255,255,0.2); padding-top: 15px; margin-top: 15px;">
//                         <p style="color: rgba(255,255,255,0.6); margin: 0; font-size: 12px; line-height: 1.5;">
//                           This alert was sent because you are a trusted contact for ${patientName}.<br>
//                           Together, we're making healthcare more connected and caring.
//                         </p>
//                       </div>
//                     </td>
//                   </tr>
                  
//                 </table>
//               </td>
//             </tr>
//           </table>
//         </body>
//         </html>
//       `,
//     };

//     await transporter.sendMail(mailOptions);
//     console.log(`✅ Beautiful alert sent to ${trustedName} (${toEmail}) about ${patientName}`);
//   } catch (err) {
//     console.error("❌ Failed to send alert:", err);
//   }
// }

// module.exports = { sendNotificationToTrusted };
const nodemailer = require("nodemailer");
const twilio = require("twilio");

// Email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Twilio client
const twilioClient = new twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
const twilioNumber = process.env.TWILIO_NUMBER;
const twilioWhatsAppNumber = process.env.TWILIO_WHATSAPP_NUMBER || "whatsapp:+14155238886";

/**
 * Send medicine alert to trusted member (email + SMS)
 * @param {string} toEmail - Trusted member email
 * @param {string} trustedName - Trusted member name
 * @param {string} medicineName - Missed medicine
 * @param {string} time - Scheduled time
 * @param {string} patientName - Name of the patient
 * @param {string} mobile - Trusted member mobile number (with country code, e.g., +91XXXXXXXXXX)
 */
async function sendNotificationToTrusted(toEmail, trustedName, medicineName, time, patientName, mobile) {
  try {
    // -------- EMAIL --------
    const mailOptions = {
      from: `"Smart Medicine Tracker" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: "🚨 Medicine Alert - Gentle Reminder Needed",
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Medicine Alert - Smart Medicine Tracker</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa; line-height: 1.6;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 40px 20px;">
                <!-- Main Container -->
                <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; box-shadow: 0 8px 32px rgba(0,0,0,0.1); overflow: hidden;">
                  
                  <!-- Alert Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #ff7675 0%, #fd79a8 100%); padding: 30px; text-align: center;">
                      <div style="background-color: rgba(255,255,255,0.2); width: 70px; height: 70px; border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center; font-size: 32px;">
                        🚨
                      </div>
                      <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600; letter-spacing: -0.5px;">
                        Medicine Alert
                      </h1>
                      <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 14px;">
                        A gentle reminder is needed
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Alert Content -->
                  <tr>
                    <td style="padding: 40px 30px;">
                      <div style="color: #2d3436; font-size: 16px; line-height: 1.8;">
                        <p style="margin: 0 0 20px 0; font-size: 18px;">
                          Hello <strong style="color: #fd79a8; font-weight: 600;">${trustedName}</strong>,
                        </p>
                        
                        <p style="margin: 0 0 25px 0;">
                          We wanted to let you know that <strong style="color: #6c5ce7; font-weight: 600;">${patientName}</strong> may need a gentle reminder about their medication.
                        </p>
                        
                        <!-- Medicine Details Card -->
                        <div style="background: linear-gradient(135deg, #fff5f5 0%, #ffeaa7 50%, #fff5f5 100%); border: 2px solid #ff7675; border-radius: 12px; padding: 25px; margin: 25px 0; position: relative;">
                          <div style="text-align: center; margin-bottom: 20px;">
                            <div style="background-color: #ff7675; color: white; width: 60px; height: 60px; border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center; font-size: 24px; box-shadow: 0 4px 12px rgba(255,118,117,0.3);">
                              💊
                            </div>
                            <h3 style="color: #2d3436; margin: 0; font-size: 20px; font-weight: 600;">
                              Missed Medication
                            </h3>
                          </div>
                          
                          <table role="presentation" style="width: 100%; background-color: rgba(255,255,255,0.8); border-radius: 8px; padding: 15px;">
                            <tr>
                              <td style="padding: 8px 0; border-bottom: 1px solid rgba(255,118,117,0.2);">
                                <strong style="color: #636e72; font-size: 14px;">Medicine:</strong>
                              </td>
                              <td style="padding: 8px 0; border-bottom: 1px solid rgba(255,118,117,0.2); text-align: right;">
                                <span style="color: #2d3436; font-weight: 600; font-size: 16px;">${medicineName}</span>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 8px 0;">
                                <strong style="color: #636e72; font-size: 14px;">Scheduled Time:</strong>
                              </td>
                              <td style="padding: 8px 0; text-align: right;">
                                <span style="color: #2d3436; font-weight: 600; font-size: 16px;">${time}</span>
                              </td>
                            </tr>
                          </table>
                        </div>
                        
                        <!-- Care Message -->
                        <div style="background-color: #e8f4fd; border-left: 4px solid #74b9ff; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0;">
                          <div style="display: flex; align-items: center; margin-bottom: 10px;">
                            <span style="font-size: 20px; margin-right: 10px;">💙</span>
                            <h4 style="color: #0984e3; margin: 0; font-size: 16px; font-weight: 600;">
                              Your caring support matters
                            </h4>
                          </div>
                          <p style="margin: 0; color: #2d3436; font-size: 14px; line-height: 1.6;">
                            Please reach out to <strong>${patientName}</strong> with a gentle reminder. Your support helps them stay on track with their health journey.
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                  
                  <!-- Quick Actions -->
                  <tr>
                    <td style="padding: 0 30px 30px 30px;">
                      <h3 style="color: #2d3436; margin: 0 0 20px 0; font-size: 18px; font-weight: 600; text-align: center;">
                        Helpful Reminders
                      </h3>
                      
                      <table role="presentation" style="width: 100%;">
                        <tr>
                          <td style="width: 50%; padding: 15px; vertical-align: top;">
                            <div style="background: linear-gradient(135deg, #a8e6cf 0%, #88d8a3 100%); padding: 20px; border-radius: 12px; text-align: center; height: 120px; display: flex; flex-direction: column; justify-content: center;">
                              <div style="font-size: 32px; margin-bottom: 10px;">📱</div>
                              <h4 style="color: #2d3436; margin: 0 0 8px 0; font-size: 14px; font-weight: 600;">
                                Send a Message
                              </h4>
                              <p style="color: #555; margin: 0; font-size: 12px; line-height: 1.4;">
                                A gentle text or call can make all the difference
                              </p>
                            </div>
                          </td>
                          <td style="width: 50%; padding: 15px; vertical-align: top;">
                            <div style="background: linear-gradient(135deg, #ffd3a5 0%, #fd9853 100%); padding: 20px; border-radius: 12px; text-align: center; height: 120px; display: flex; flex-direction: column; justify-content: center;">
                              <div style="font-size: 32px; margin-bottom: 10px;">🤗</div>
                              <h4 style="color: #2d3436; margin: 0 0 8px 0; font-size: 14px; font-weight: 600;">
                                Show Support
                              </h4>
                              <p style="color: #555; margin: 0; font-size: 12px; line-height: 1.4;">
                                Your care and encouragement mean everything
                              </p>
                            </div>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #636e72 0%, #2d3436 100%); padding: 25px 30px; text-align: center;">
                      <p style="color: #ffffff; margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">
                        Thank you for being a caring support system
                      </p>
                      <p style="color: rgba(255,255,255,0.8); margin: 0 0 15px 0; font-size: 14px;">
                        — Smart Medicine Tracker Team
                      </p>
                      
                      <div style="border-top: 1px solid rgba(255,255,255,0.2); padding-top: 15px; margin-top: 15px;">
                        <p style="color: rgba(255,255,255,0.6); margin: 0; font-size: 12px; line-height: 1.5;">
                          This alert was sent because you are a trusted contact for ${patientName}.<br>
                          Together, we're making healthcare more connected and caring.
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
    console.log(`✅ Email sent to ${trustedName} (${toEmail}) about ${patientName}`);

    // -------- SMS via Twilio --------
//     if (mobile) {
//       const smsMessage = `🚨 Medicine Alert: ${patientName} missed ${medicineName} scheduled at ${time}. Please remind them gently.`;
//       try {
//         await twilioClient.messages.create({
//           body: smsMessage,
//           from: twilioNumber,
//           to: mobile,
//         });
//         console.log(`✅ SMS sent to ${trustedName} (${mobile}) about ${patientName}`);
//       } catch (err) {
//         console.error(`❌ Failed to send SMS to ${mobile}:`, err.message);
//       }
//     } else {
//       console.log(`⚠️ No mobile number provided for SMS to ${trustedName}`);
//     }
//   } catch (err) {
//     console.error("❌ Failed to send alert:", err);
//   }
// }
// -------- SMS via Twilio --------
  if (mobile) {
    // Ensure proper format (India)
       mobile = mobile.replace(/\s+/g, "").replace(/-/g, "");
      if (!mobile.startsWith("+")) {
        if (mobile.length === 10) mobile = "+91" + mobile;
      }
      const smsMessage = `🚨 Medicine Alert: ${patientName} missed ${medicineName} scheduled at ${time}. Please remind them gently.`;

      // -------- SMS --------
      try {
        await twilioClient.messages.create({
          body: smsMessage,
          from: twilioNumber,
          to: mobile,
        });
        console.log(`✅ SMS sent to ${trustedName} (${mobile}) about ${patientName}`);
      } catch (err) {
        console.error(`❌ Failed to send SMS to ${mobile}:`, err.message);
      }

      // -------- WhatsApp --------
      try {
        await twilioClient.messages.create({
          body: smsMessage,
          from: twilioWhatsAppNumber, // correct variable name
          to: `whatsapp:${mobile}`, // include country code
        });
        console.log(
          `✅ WhatsApp message sent to ${trustedName} (${mobile}) about ${patientName}`
        );
      } catch (err) {
        console.error(
          `❌ Failed to send WhatsApp message to ${mobile}:`,
          err.message
        );
      }
    } else {
      console.log(`⚠️ No mobile number provided for SMS/WhatsApp to ${trustedName}`);
    }
  } catch (err) {
    console.error("❌ Failed to send alert:", err);
  }
}

module.exports = { sendNotificationToTrusted };
