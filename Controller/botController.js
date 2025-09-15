// botController.js
const Medicine = require("../models/Medicine"); // your Reminder schema

// Simple NLP function
function getIntent(query) {
  const lower = query.toLowerCase();
  if (lower.includes("what") && lower.includes("reminder")) return "LIST_ALL";
  if (lower.includes("next") || lower.includes("upcoming")) return "NEXT";
  if (lower.includes("take") || lower.includes("have")) return "CHECK_MEDICINE";
  return "UNKNOWN";
}

exports.chatBot = async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ reply: "Please ask something." });

    const intent = getIntent(query);

    const reminders = await Reminder.find(); // fetch reminders from DB

    let reply = "I didn't understand. Can you rephrase?";
    if (intent === "LIST_ALL") {
      if (reminders.length === 0) {
        reply = "You have no reminders.";
      } else {
        reply = "Here are your reminders:\n";
        reminders.forEach(r => {
          r.doses.forEach(d => {
            reply += `💊 ${r.name} at ${d.time24} (${d.beforeAfterMeal} meal)\n`;
          });
        });
      }
    }

    if (intent === "NEXT") {
      if (reminders.length === 0) {
        reply = "You have no upcoming reminders.";
      } else {
        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes();
        let upcoming = null;

        reminders.forEach(r => {
          r.doses.forEach(d => {
            const [hh, mm] = d.time24.split(":").map(Number);
            const total = hh * 60 + mm;
            if (total > currentTime) {
              if (!upcoming || total < upcoming.total) {
                upcoming = { name: r.name, time: d.time24, meal: d.beforeAfterMeal, total };
              }
            }
          });
        });

        if (upcoming) {
          reply = `Your next reminder is 💊 ${upcoming.name} at ${upcoming.time} (${upcoming.meal} meal).`;
        } else {
          reply = "No more reminders for today.";
        }
      }
    }

    if (intent === "CHECK_MEDICINE") {
      const words = query.split(" ");
      const found = reminders.find(r => query.toLowerCase().includes(r.name.toLowerCase()));
      if (found) {
        reply = `${found.name} reminders:\n`;
        found.doses.forEach(d => {
          reply += `⏰ ${d.time24} (${d.beforeAfterMeal} meal)\n`;
        });
      } else {
        reply = "I couldn’t find that medicine in your reminders.";
      }
    }

    res.json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ reply: "Something went wrong." });
  }
};
