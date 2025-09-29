// const express = require('express');
// const router = express.Router();
// const auth = require('../middleware/auth'); // your auth middleware
// const TrustedMember = require('../models/TrustedMember');
// const { sendNotificationToTrusted } = require('../utils/notifications'); // your notification function

// // POST /api/notify-trusted
// router.post('/notify-trusted', auth, async (req, res) => {
//   try {
//     const { userId, medicineName, doseTime } = req.body;

//     const members = await TrustedMember.find({ userId }).limit(3);

//     members.forEach(member => {
//       sendNotificationToTrusted(
//         member.memberId,
//         `${medicineName} was not taken at ${doseTime}`
//       );
//     });

//     res.json({ success: true });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Failed to notify trusted members' });
//   }
// });

// module.exports = router;


// // routes/reminderRoutes.js
// const express = require('express');
// const router = express.Router();
// const auth = require('../middleware/auth');
// const TrustedMember = require('../models/TrustedMember');
// const { sendNotificationToTrusted } = require('../utils/notifications');
// const User = require('../models/User');

// router.post('/notify-trusted', auth, async (req, res) => {
//   try {
//     const { userId, medicineName, doseTime } = req.body;
//     console.log('--- /notify-trusted called ---');
//     console.log('userId:', userId, 'medicineName:', medicineName, 'doseTime:', doseTime);

//     const members = await TrustedMember.find({ user: userId }).limit(3);
//     if (!members.length) {
//       console.log('No trusted members found!');
//       return res.status(400).json({ success: false, error: 'No trusted members' });
//     }

//     const user = await User.findById(userId).select("name");
//     const patientName = user ? user.name : "your family member";

//     // send to each trusted member individually
//     for (const tm of members) {
//       console.log(`Sending alert to ${tm.name} (${tm.email})`);
//       await sendNotificationToTrusted(
//         tm.email,          // trusted member email
//         tm.name,           // trusted member name
//         medicineName,      // medicine name
//         doseTime,          // dose time
//         patientName        // patient name
//       );
//     }

//     console.log('sendNotificationToTrusted executed for all members');
//     res.json({ success: true });
//   } catch (err) {
//     console.error('Error in /notify-trusted:', err);
//     res.status(500).json({ success: false, error: err.message });
//   }
// });



// module.exports = router;


// // backend/routes/reminderRoutes.js
// const express = require('express');
// const router = express.Router();
// const auth = require('../middleware/auth');
// const TrustedMember = require('../models/TrustedMember');
// const User = require('../models/User');
// const { sendNotificationToTrusted } = require('../utils/notifications');

// router.post('/notify-trusted', auth, async (req, res) => {
//   try {
//     const { userId, medicineName, doseTime } = req.body;

//     const members = await TrustedMember.find({ user: userId }).limit(3);
//     if (!members.length) return res.status(400).json({ success: false, error: 'No trusted members' });

//     const user = await User.findById(userId).select("name");
//     const patientName = user?.name || "your family member";

//     for (const tm of members) {
//       await sendNotificationToTrusted(tm.email, tm.name, medicineName, doseTime, patientName);
//     }

//     res.json({ success: true });
//   } catch (err) {
//     console.error('Error in /notify-trusted:', err);
//     res.status(500).json({ success: false, error: err.message });
//   }
// });

// module.exports = router;


const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const TrustedMember = require('../models/TrustedMember');
const User = require('../models/User');
const { sendNotificationToTrusted } = require('../utils/notifications');
const { toObjectId } = require('../utils/objectIdHelper');

// Notify trusted members about missed medicine
router.post('/notify-trusted', auth, async (req, res) => {
  try {
    const { userId, medicineName, doseTime } = req.body;
    const members = await TrustedMember.find({ user: toObjectId(userId) }).limit(3);

    if (!members.length) return res.status(400).json({ success: false, error: 'No trusted members' });

    const user = await User.findById(toObjectId(userId)).select("name");
    const patientName = user ? user.name : "your family member";

    for (const tm of members) {
      await sendNotificationToTrusted(
        tm.email,
        tm.name,
        medicineName,
        doseTime,
        patientName,
        tm.mobile,
      );
    }

    res.json({ success: true });
  } catch (err) {
    console.error('Error in /notify-trusted:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
