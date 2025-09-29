// // reminderScheduler.js
// const Medicine = require("../models/Medicine");
// const TrustedMember = require("../models/TrustedMember");
// const { sendNotificationToTrusted } = require("../utils/notifications");

// async function checkMissedMedicines() {
//   const now = new Date();

//   // 2 minutes ago
//   const twoMinutesAgo = new Date(now.getTime() - 2 * 60 * 1000);
//   // 5 minutes ago (safety window)
//   const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

//   // Find medicines whose doseTime is in the last 5 mins but not taken
//   const missed = await Medicine.find({
//     taken: false,
//     doseTime: { $gte: fiveMinutesAgo, $lte: twoMinutesAgo }
//   });

//   for (const med of missed) {
//     const trustedMembers = await TrustedMember.find({ user: med.user });
//     if (!trustedMembers.length) {
//       console.log("No trusted members found!");
//       continue;
//     }

//     const emails = trustedMembers.map(m => m.email);
//     const message = `${med.medicineName} was not taken at ${med.doseTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
//     console.log(`Sending notification for ${med.medicineName} to trusted members:`, emails);

//     await sendNotificationToTrusted(emails, message);
//   }
// }

// module.exports = { checkMissedMedicines };

// // reminderScheduler.js
// const Medicine = require("../models/Medicine");
// const TrustedMember = require("../models/TrustedMember");
// const { sendNotificationToTrusted } = require("../utils/notifications");

// async function checkMissedMedicines() {
//   const now = new Date();

//   const twoMinutesAgo = new Date(now.getTime() - 2 * 60 * 1000);
//   const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

//   // Find medicines whose doseTime is in the last 5 mins but not taken
//   const missed = await Medicine.find({
//     taken: false,
//     doseTime: { $gte: fiveMinutesAgo, $lte: twoMinutesAgo }
//   });

//   for (const med of missed) {
//     const trustedMembers = await TrustedMember.find({ user: med.user });
//     if (!trustedMembers.length) {
//       console.log("No trusted members found!");
//       continue;
//     }

//     for (const member of trustedMembers) {
//       const message = `
// Hello ${member.name || "Trusted Member"},

// We wanted to let you know that ${
//         med.userName || "your family member"
//       } missed their scheduled dose of **${med.medicineName}** at **${med.doseTime.toLocaleTimeString([], {
//         hour: "2-digit",
//         minute: "2-digit",
//       })}**.

// Please check in with them and make sure everything is okay.  
// Your support really helps them stay healthy. 💖  

// – Smart Medicine Tracker
// `;

//       console.log(
//         `Sending notification for ${med.medicineName} to: ${member.email}`
//       );

//       await sendNotificationToTrusted([member.email], message);
//     }
//   }
// }

// module.exports = { checkMissedMedicines };
// scheduler/reminderScheduler.js
// const mongoose = require("mongoose"); // ensure mongoose is imported
// const Medicine = require("../models/Medicine");
// const TrustedMember = require("../models/TrustedMember");
// const User = require("../models/User");
// const { sendNotificationToTrusted } = require("../utils/notifications");
// async function checkMissedMedicines() {
//   const now = new Date();
//   console.log("⏰ Running checkMissedMedicines at", now.toLocaleTimeString());

//   // 2 minutes ago
//   const twoMinutesAgo = new Date(now.getTime() - 2 * 60 * 1000);
//   // 5 minutes ago (safety window)
//   const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

//   // Find medicines whose doseTime is in the last 5 mins but not taken
//   const missed = await Medicine.find({
//     taken: false,
//     doseTime: { $gte: fiveMinutesAgo, $lte: twoMinutesAgo }
//   });

//   console.log(`Found ${missed.length} missed medicines`);

//   for (const med of missed) {
//     console.log("Processing medicine:", med.medicineName, "for userId:", med.user);

//     // Find trusted members
//     const trustedMembers = await TrustedMember.find({ user: med.user });
//     console.log(`Found ${trustedMembers.length} trusted members`);

//     if (!trustedMembers.length) continue;

//     // Fetch patient/user name safely using ObjectId
//     const patient = await User.findById(mongoose.Types.ObjectId(med.user)).select("name");
//     const patientName = patient ? patient.name : "your family member";

//     const formattedTime = med.doseTime.toLocaleTimeString([], {
//       hour: "2-digit",
//       minute: "2-digit"
//     });

//     // Send alert to each trusted member
//     for (const tm of trustedMembers) {
//       console.log(`Sending alert to ${tm.name} (${tm.email}) for medicine ${med.medicineName} at ${formattedTime}, patientName=${patientName}`);
//       await sendNotificationToTrusted(
//         tm.email,          // trusted member email
//         tm.name,           // trusted member name
//         med.medicineName,  // medicine name
//         formattedTime,     // dose time
//         patientName,       // patient name
//          med.shape,       // medicine shape
//          med.color
//       );
//     }
//   }

//   console.log("✅ checkMissedMedicines run completed");
// }

// module.exports = { checkMissedMedicines };


// // --- FILE: server/scheduler/reminderScheduler.js ---
// // Scheduler adapted for your Medicine schema with doses[]
// const cron = require("node-cron");
// const mongoose = require("mongoose");
// const Medicine = require("../models/Medicine");
// const TrustedMember = require("../models/TrustedMember");
// const User = require("../models/User");
// const Notification = require("../models/Notification");
// const { sendNotificationToTrusted } = require("../utils/notifications");

// const GRACE_MINUTES = Number(process.env.GRACE_MINUTES || 5);

// // parse "HH:MM" into {hour, minute}
// function parseTime24(str) {
//   if (!str || typeof str !== "string") return null;
//   const parts = str.split(":");
//   if (parts.length < 2) return null;
//   const h = parseInt(parts[0], 10);
//   const m = parseInt(parts[1], 10);
//   if (Number.isNaN(h) || Number.isNaN(m)) return null;
//   return { hour: h, minute: m };
// }

// // build a Date (local) for given day and time (day is a Date object)
// function buildDateForDay(dayDate, hour, minute) {
//   const d = new Date(dayDate);
//   d.setHours(hour, minute, 0, 0);
//   return d;
// }

// // decide whether a medicine dose is scheduled for "dateToCheck" based on frequency.
// // For now supports 'once' and 'daily'. Extend for weekly using daysOfWeek array.
// function isDoseScheduledForDate(med, doseEntry, dateToCheck) {
//   const freq = med.frequency || "daily";
//   if (freq === "once") {
//     if (!med.startDate) return false;
//     const sd = new Date(med.startDate);
//     // same day check (ignore time)
//     return sd.toDateString() === dateToCheck.toDateString();
//   }
//   if (freq === "daily") return true;
//   if (freq === "weekly") {
//     // daysOfWeek expected like ["Mon","Tue"] or full names — adjust depending on how you store
//     if (!Array.isArray(med.daysOfWeek) || med.daysOfWeek.length === 0) return true;
//     const dow = dateToCheck.toLocaleDateString(undefined, { weekday: "short" }); // "Mon"
//     return med.daysOfWeek.includes(dow);
//   }
//   // fallback: assume daily
//   return true;
// }

// // main check function
// async function checkMissedMedicines() {
//   const now = new Date();
//   const cutoff = new Date(now.getTime() - GRACE_MINUTES * 60 * 1000);
//   console.log("⏰ checkMissedMedicines running at", now.toISOString(), "cutoff:", cutoff.toISOString());

//   try {
//     // Find medicines for which some dose entry is not notified (so candidates)
//     const meds = await Medicine.find({ "doses.notified": false }).lean();
//     console.log("Found medicines with un-notified doses:", meds.length);

//     for (const med of meds) {
//       try {
//         const patientId = med.userId || med.user || med.userId || med.patient; // defensive
//         if (!patientId) {
//           console.warn("Medicine missing userId, skipping:", med._id);
//           continue;
//         }

//         // load trusted members monitoring this patient
//         const trustedMembers = await TrustedMember.find({
//           $or: [
//             { monitoredUsers: patientId },
//             { user: patientId },
//             { userId: patientId },
//             { patient: patientId }
//           ]
//         }).lean();

//         if (!trustedMembers || trustedMembers.length === 0) {
//           console.log("No trusted members for patient:", patientId, "med:", med._id);
//           continue;
//         }

//         // For each dose entry in med.doses
//         for (let doseIndex = 0; doseIndex < (med.doses || []).length; doseIndex++) {
//           const doseEntry = med.doses[doseIndex];
//           if (!doseEntry) continue;
//           if (doseEntry.notified) continue; // already notified

//           const timeObj = parseTime24(doseEntry.time24);
//           if (!timeObj) {
//             console.warn("Invalid dose.time24 for med:", med._id, "doseIndex:", doseIndex, "value:", doseEntry.time24);
//             continue;
//           }

//           // Decide which date to check: for 'once' we check startDate, otherwise check today
//           // If you want to check multiple dates you can expand this loop (e.g., check yesterday if late)
//           const dateToCheck = new Date(); // today
//           if (med.frequency === "once" && med.startDate) {
//             // use startDate's day
//             dateToCheck.setTime(new Date(med.startDate).getTime());
//           }

//           // Is this dose scheduled for that date?
//           if (!isDoseScheduledForDate(med, doseEntry, dateToCheck)) {
//             continue;
//           }

//           // Build scheduled DateTime for the dose on that day
//           const scheduledDate = buildDateForDay(dateToCheck, timeObj.hour, timeObj.minute);

//           // If scheduledDate > cutoff => it's not yet missed
//           if (scheduledDate > cutoff) {
//             // not missed yet
//             continue;
//           }

//           // Now we consider it missed -> create notification for each trusted member
//           const patient = await User.findById(patientId).select("name").lean();
//           const patientName = patient ? patient.name : "your family member";

//           const medName = med.name || med.medicineName || med.title || "medicine";
//           const formattedTime = scheduledDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

//           for (const tm of trustedMembers) {
//             try {
//               // duplicate prevention (same trusted, same med, same scheduledDate in last 24h)
//               const exists = await Notification.findOne({
//                 trustedId: tm._id,
//                 userId: patientId,
//                 medicineId: med._id,
//                 doseTime: scheduledDate,
//                 createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
//               });

//               if (exists) {
//                 console.log("Skipping duplicate notification:", { trusted: tm._id.toString(), med: med._id.toString(), scheduledDate: scheduledDate.toISOString() });
//                 continue;
//               }

//               const message = `${patientName} missed ${medName} scheduled at ${formattedTime}`;

//               const newNotification = await Notification.create({
//                 trustedId: tm._id,
//                 userId: patientId,
//                 medicineId: med._id,
//                 medicineName: medName,
//                 doseTime: scheduledDate,
//                 message,
//                 isRead: false
//               });

//               console.log("Saved Notification:", newNotification._id.toString(), "for trusted:", tm.email);

//               // mark dose as notified (atomic update: set the specific doses.$.notified = true)
//               // We update the medicine document to set the particular array element's notified=true
//               await Medicine.updateOne(
//                 { _id: med._id, "doses.time24": doseEntry.time24, "doses.notified": false }, // narrow selector
//                 { $set: { "doses.$.notified": true } }
//               );

//               // send email (best-effort)
//               try {
//                 await sendNotificationToTrusted(
//                   tm.email,
//                   tm.name || "Trusted member",
//                   medName,
//                   formattedTime,
//                   patientName
//                 );
//               } catch (e) {
//                 console.warn("sendNotificationToTrusted failed:", e && e.message);
//               }
//             } catch (tmErr) {
//               console.error("Error creating notification for trusted:", tm._id, tmErr);
//             }
//           } // end trustedMembers loop
//         } // end doses loop
//       } catch (medErr) {
//         console.error("Error processing medicine:", med._id, medErr);
//       }
//     } // end meds loop
//   } catch (err) {
//     console.error("checkMissedMedicines failed:", err);
//   }

//   console.log("✅ checkMissedMedicines run completed");
// }

// // schedule runs every minute
// function scheduleMissedChecker() {
//   console.log("Scheduling missed medicines checker (runs every minute)");
//   cron.schedule("* * * * *", () => {
//     checkMissedMedicines().catch(e => console.error("checkMissedMedicines top fail:", e));
//   });
// }

// module.exports = { checkMissedMedicines, scheduleMissedChecker };



// const cron = require("node-cron");
// const mongoose = require("mongoose");
// const Medicine = require("../models/Medicine");
// const TrustedMember = require("../models/TrustedMember");
// const User = require("../models/User");
// const Notification = require("../models/Notification");
// const MedicineStatus = require("../models/MedicineStatus");
// const { sendNotificationToTrusted } = require("../utils/notifications");

// const GRACE_MINUTES = Number(process.env.GRACE_MINUTES || 5);

// // parse "HH:MM" into {hour, minute}
// function parseTime24(str) {
//   if (!str || typeof str !== "string") return null;
//   const parts = str.split(":");
//   if (parts.length < 2) return null;
//   const h = parseInt(parts[0], 10);
//   const m = parseInt(parts[1], 10);
//   if (Number.isNaN(h) || Number.isNaN(m)) return null;
//   return { hour: h, minute: m };
// }

// // build a Date (local) for given day and time (day is a Date object)
// function buildDateForDay(dayDate, hour, minute) {
//   const d = new Date(dayDate);
//   d.setHours(hour, minute, 0, 0);
//   return d;
// }

// // decide whether a medicine dose is scheduled for "dateToCheck" based on frequency.
// function isDoseScheduledForDate(med, doseEntry, dateToCheck) {
//   const freq = med.frequency || "daily";
//   if (freq === "once") {
//     if (!med.startDate) return false;
//     const sd = new Date(med.startDate);
//     return sd.toDateString() === dateToCheck.toDateString();
//   }
//   if (freq === "daily") return true;
//   if (freq === "weekly") {
//     if (!Array.isArray(med.daysOfWeek) || med.daysOfWeek.length === 0) return true;
//     // use short weekday ("Mon") to match typical storage; adjust if you store full names
//     const dow = dateToCheck.toLocaleDateString(undefined, { weekday: "short" });
//     return med.daysOfWeek.includes(dow);
//   }
//   return true;
// }

// async function checkMissedMedicines() {
//   const now = new Date();
//   const cutoff = new Date(now.getTime() - GRACE_MINUTES * 60 * 1000);
//   console.log("⏰ checkMissedMedicines running at", now.toISOString(), "cutoff:", cutoff.toISOString());

//   try {
//     // Find medicines where some dose has not been notified yet
//     const meds = await Medicine.find({ "doses.notified": false }).lean();
//     console.log("Found medicines with un-notified doses:", meds.length);

//     for (const med of meds) {
//       try {
//         const patientId = med.userId || med.user || med.patient || med.patientId;
//         if (!patientId) {
//           console.warn("Skipping medicine without patientId:", med._id);
//           continue;
//         }

//         // find trusted members monitoring this patient
//         const trustedMembers = await TrustedMember.find({
//           $or: [
//             { monitoredUsers: patientId },
//             { user: patientId },
//             { userId: patientId },
//             { patient: patientId },
//             { patientId: patientId }
//           ]
//         }).lean();

//         if (!trustedMembers || trustedMembers.length === 0) {
//           console.log("No trusted members for patient:", patientId.toString(), "med:", med._id.toString());
//           continue;
//         }

//         // loop doses
//         for (const doseEntry of med.doses || []) {
//           if (!doseEntry) continue;
//           if (doseEntry.notified) continue; // already handled

//           const timeObj = parseTime24(doseEntry.time24);
//           if (!timeObj) {
//             console.warn("Invalid dose.time24:", doseEntry.time24, "for med:", med._id.toString());
//             continue;
//           }

//           // choose date to check
//           const dateToCheck = new Date();
//           if (med.frequency === "once" && med.startDate) {
//             dateToCheck.setTime(new Date(med.startDate).getTime());
//           }

//           if (!isDoseScheduledForDate(med, doseEntry, dateToCheck)) continue;

//           const scheduledDate = buildDateForDay(dateToCheck, timeObj.hour, timeObj.minute);

//           // if scheduledDate is after cutoff, not missed yet
//           if (scheduledDate > cutoff) continue;

//           // Missed: ensure MedicineStatus marking 'not_taken' (but do not overwrite 'taken')
//           try {
//             const doseTimeKey = String(doseEntry.time24); // "HH:MM"
//             const statusQuery = {
//                userId: new mongoose.Types.ObjectId(patientId),
//               medicineId: new mongoose.Types.ObjectId(med._id),
//               doseTime: doseTimeKey
//             };

//             // Use $setOnInsert for status so we don't overwrite an existing 'taken' value
//             const statusUpdate = {
//               $setOnInsert: {
//                 medicineName: med.name || med.medicineName || "medicine",
//                 status: "not_taken",
//                 timestamp: new Date()
//               }
//             };

//             const statusDoc = await MedicineStatus.findOneAndUpdate(statusQuery, statusUpdate, { upsert: true, new: true, setDefaultsOnInsert: true });
//             if (statusDoc) {
//               console.log("MedicineStatus upserted/found:", statusDoc._id ? statusDoc._id.toString() : "(existing)", "status:", statusDoc.status);
//             }
//           } catch (statusErr) {
//             console.error("Failed upserting MedicineStatus for missed dose:", med._id.toString(), statusErr);
//             // continue - we can still try notifications but keep note in logs
//           }

//           // prepare message and formatted time
//           const patient = await User.findById(patientId).select("name").lean();
//           const patientName = patient ? patient.name : "your family member";
//           const medName = med.name || med.medicineName || med.title || "medicine";
//           const formattedTime = scheduledDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

//           // notify each trusted member (create Notification + send email)
//           for (const tm of trustedMembers) {
//             try {
//               // duplicate prevention for Notification (same trustedId, med, scheduledDate in last 24h)
//               const exists = await Notification.findOne({
//                 trustedId: tm._id,
//                 userId: patientId,
//                 medicineId: med._id,
//                 doseTime: scheduledDate,
//                 createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
//               });

//               if (exists) {
//                 console.log("Skipping duplicate notification for trusted:", tm._id.toString(), "med:", med._id.toString());
//                 continue;
//               }

//               const message = `${patientName} missed ${medName} scheduled at ${formattedTime}`;

//               const newNotification = await Notification.create({
//                 trustedId: tm._id,
//                 userId: patientId,
//                 medicineId: med._id,
//                 medicineName: medName,
//                 doseTime: scheduledDate,
//                 message,
//                 isRead: false
//               });

//               console.log("Saved Notification:", newNotification._id.toString(), "for trusted:", tm.email);

//               // send email (best-effort). If email succeeds, set notified flags
//               try {
//                 await sendNotificationToTrusted(
//                   tm.email,
//                   tm.name || "Trusted member",
//                   medName,
//                   formattedTime,
//                   patientName
//                 );

//                 // mark MedicineStatus.notified = true (do not change status)
//                 try {
//                   await MedicineStatus.findOneAndUpdate(
//                     {
//                       userId: mongoose.Types.ObjectId(patientId),
//                       medicineId: mongoose.Types.ObjectId(med._id),
//                       doseTime: String(doseEntry.time24)
//                     },
//                     { $set: { notified: true } }
//                   );
//                 } catch (msErr) {
//                   console.warn("Failed to set MedicineStatus.notified:", msErr && msErr.message);
//                 }

//                 // mark the dose as notified on Medicine doc so it's not reprocessed by scheduler
//                 try {
//                   await Medicine.updateOne(
//                     { _id: med._id, "doses.time24": doseEntry.time24, "doses.notified": false },
//                     { $set: { "doses.$.notified": true } }
//                   );
//                 } catch (updErr) {
//                   console.warn("Failed to update Medicine.doses.notified:", updErr && updErr.message);
//                 }
//               } catch (mailErr) {
//                 console.warn("sendNotificationToTrusted failed (will retry later):", mailErr && mailErr.message);
//                 // Do NOT change status to 'taken' here. Leave status 'not_taken' and notified possibly false.
//               }

//             } catch (tmErr) {
//               console.error("Error creating notification for trusted member:", tm._id ? tm._id.toString() : tm, tmErr);
//             }
//           } // end trustedMembers loop

//         } // end doses loop
//       } catch (medErr) {
//         console.error("Error processing medicine:", med._id ? med._id.toString() : med, medErr);
//       }
//     } // end meds loop
//   } catch (err) {
//     console.error("checkMissedMedicines failed:", err);
//   }

//   console.log("✅ checkMissedMedicines run completed");
// }

// // schedule to run every minute
// function scheduleMissedChecker() {
//   console.log("Scheduling missed medicines checker (runs every minute)");
//   cron.schedule("* * * * *", () => {
//     checkMissedMedicines().catch(e => console.error("checkMissedMedicines top fail:", e));
//   });
// }

// module.exports = { checkMissedMedicines, scheduleMissedChecker };

const cron = require("node-cron");
const mongoose = require("mongoose");
const Medicine = require("../models/Medicine");
const TrustedMember = require("../models/TrustedMember");
const User = require("../models/User");
const Notification = require("../models/Notification");
const MedicineStatus = require("../models/MedicineStatus");
const { sendNotificationToTrusted } = require("../utils/notifications");
const { toObjectId } = require("../utils/objectIdHelper");

const GRACE_MINUTES = Number(process.env.GRACE_MINUTES || 5);

function parseTime24(str) {
  if (!str || typeof str !== "string") return null;
  const parts = str.split(":");
  if (parts.length < 2) return null;
  const h = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  return { hour: h, minute: m };
}

function buildDateForDay(dayDate, hour, minute) {
  const d = new Date(dayDate);
  d.setHours(hour, minute, 0, 0);
  return d;
}

function isDoseScheduledForDate(med, doseEntry, dateToCheck) {
  const freq = med.frequency || "daily";
  if (freq === "once") {
    if (!med.startDate) return false;
    const sd = new Date(med.startDate);
    return sd.toDateString() === dateToCheck.toDateString();
  }
  if (freq === "daily") return true;
  if (freq === "weekly") {
    if (!Array.isArray(med.daysOfWeek) || med.daysOfWeek.length === 0) return true;
    const dow = dateToCheck.toLocaleDateString(undefined, { weekday: "short" });
    return med.daysOfWeek.includes(dow);
  }
  return true;
}

async function checkMissedMedicines() {
  const now = new Date();
  const cutoff = new Date(now.getTime() - GRACE_MINUTES * 60 * 1000);

  try {
    const meds = await Medicine.find({ "doses.notified": false }).lean();

    for (const med of meds) {
      const patientId = med.userId;
      if (!patientId) continue;

      const trustedMembers = await TrustedMember.find({
        $or: [
          { monitoredUsers: patientId },
          { user: patientId },
          { userId: patientId },
          { patient: patientId },
          { patientId: patientId }
        ]
      }).lean();

      if (!trustedMembers.length) continue;

      for (const doseEntry of med.doses || []) {
        if (!doseEntry || doseEntry.notified) continue;

        const timeObj = parseTime24(doseEntry.time24);
        if (!timeObj) continue;

        const dateToCheck = new Date();
        if (med.frequency === "once" && med.startDate) dateToCheck.setTime(new Date(med.startDate).getTime());
        if (!isDoseScheduledForDate(med, doseEntry, dateToCheck)) continue;

        const scheduledDate = buildDateForDay(dateToCheck, timeObj.hour, timeObj.minute);
        if (scheduledDate > cutoff) continue;

        // Upsert MedicineStatus
        try {
          const statusQuery = {
            userId: toObjectId(patientId),
            medicineId: toObjectId(med._id),
            doseTime: String(doseEntry.time24)
          };

          const statusUpdate = {
            $setOnInsert: {
              medicineName: med.name || "medicine",
              status: "not_taken",
              timestamp: new Date()
            }
          };

          await MedicineStatus.findOneAndUpdate(statusQuery, statusUpdate, { upsert: true, new: true, setDefaultsOnInsert: true });
        } catch (err) {
          console.error("Failed upserting MedicineStatus:", err);
        }

        const patient = await User.findById(toObjectId(patientId)).select("name").lean();
        const patientName = patient ? patient.name : "your family member";
        const medName = med.name || "medicine";
        const formattedTime = scheduledDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

        for (const tm of trustedMembers) {
          try {
            const exists = await Notification.findOne({
              trustedId: toObjectId(tm._id),
              userId: toObjectId(patientId),
              medicineId: toObjectId(med._id),
              doseTime: scheduledDate,
              createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
            });
            if (exists) continue;

            const message = `${patientName} missed ${medName} scheduled at ${formattedTime}`;
            await Notification.create({
              trustedId: toObjectId(tm._id),
              userId: toObjectId(patientId),
              medicineId: toObjectId(med._id),
              medicineName: medName,
              doseTime: scheduledDate,
              message,
              isRead: false
            });

            await sendNotificationToTrusted(tm.email, tm.name || "Trusted member", medName, formattedTime, patientName);

            // mark notified true
            await MedicineStatus.findOneAndUpdate(
              {
                userId: toObjectId(patientId),
                medicineId: toObjectId(med._id),
                doseTime: String(doseEntry.time24)
              },
              { $set: { notified: true } }
            );

            await Medicine.updateOne(
              { _id: toObjectId(med._id), "doses.time24": doseEntry.time24, "doses.notified": false },
              { $set: { "doses.$.notified": true } }
            );

          } catch (err) {
            console.error("Error notifying trusted member:", err);
          }
        }
      }
    }
  } catch (err) {
    console.error("checkMissedMedicines failed:", err);
  }
  console.log("✅ checkMissedMedicines completed");
}

// Schedule every minute
function scheduleMissedChecker() {
  cron.schedule("* * * * *", () => {
    checkMissedMedicines().catch(e => console.error("checkMissedMedicines top fail:", e));
  });
}

module.exports = { checkMissedMedicines, scheduleMissedChecker };


