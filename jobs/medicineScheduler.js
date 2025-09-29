const cron = require("node-cron");
const Medicine = require("../models/Medicine");

// 🗑️ Auto-delete expired one-time medicines
cron.schedule("0 0 * * *", async () => {
  const today = new Date();
  try {
    const result = await Medicine.deleteMany({
      frequency: "once",
      startDate: { $lt: today }
    });
    if (result.deletedCount > 0) {
      console.log(`🗑️ Deleted ${result.deletedCount} expired one-time medicines`);
    }
  } catch (err) {
    console.error("❌ Error deleting expired medicines:", err);
  }
});

// ⏰ Send reminders every minute
cron.schedule("* * * * *", async () => {
  const now = new Date();
  const hhmm = now.toTimeString().slice(0,5); // "HH:MM"
  const todayName = now.toLocaleDateString("en-US", { weekday: "long" });

  try {
    // Daily
    const dailyMeds = await Medicine.find({
      frequency: "daily",
      "doses.time24": hhmm
    });

    // Weekly
    const weeklyMeds = await Medicine.find({
      frequency: "weekly",
      daysOfWeek: todayName,
      "doses.time24": hhmm
    });

    // One-time (today only)
    const oneTimeMeds = await Medicine.find({
      frequency: "once",
      startDate: { $eq: new Date(now.toDateString()) },
      "doses.time24": hhmm
    });

    const allMeds = [...dailyMeds, ...weeklyMeds, ...oneTimeMeds];

    allMeds.forEach(med => {
      console.log(`⏰ Reminder: Take ${med.name} at ${hhmm}`);
      // TODO: send notification/email to user & trusted persons
    });

  } catch (err) {
    console.error("❌ Error checking medicines:", err);
  }
});
