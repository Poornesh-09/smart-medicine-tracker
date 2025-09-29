const axios = require('axios');

async function sendMedicineAlertEmail(toEmail, trustedName, patientName, medicineName, time) {
  const options = {
    method: 'POST',
    url: 'https://control.msg91.com/api/v5/email/send',
    headers: {
      'authkey': process.env.MSG91_AUTH_KEY,
      'content-type': 'application/json'
    },
    data: {
      to: [
        {
          email: toEmail,
          name: trustedName
        }
      ],
      from: {
        email: process.env.MSG91_FROM_EMAIL || 'noreply@yourdomain.com',
        name: 'Smart Medicine Tracker'
      },
      domain: process.env.MSG91_DOMAIN || 'yourdomain.com',
      template_id: process.env.MSG91_TEMPLATE_ID,
      variables: {
        TRUSTEDNAME: trustedName,
        PATIENTNAME: patientName,
        MEDICINENAME: medicineName,
        TIME: time
      }
    }
  };

  try {
    const response = await axios(options);
    console.log('Email sent successfully via MSG91:', response.data);
    return response.data;
  } catch (error) {
    console.error('Email sending failed via MSG91:', error.response?.data || error.message);
    throw error;
  }
}

module.exports = { sendMedicineAlertEmail };