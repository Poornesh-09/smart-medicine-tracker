const fs = require('fs');
const path = require('path');
const { createWorker } = require('tesseract.js');
const Medicine = require('../models/Medicine');

// convert "9:00 PM" or "21:00" -> "21:00"
function convertTo24(timeStr) {
  if (!timeStr) return null;
  const t = timeStr.toLowerCase().trim();
  const pm = t.includes('pm');
  const am = t.includes('am');
  const digits = t.replace(/[^0-9:]/g, '').trim();
  if (!digits) return null;
  const parts = digits.split(':');
  let hh = parseInt(parts[0] || '0', 10);
  const mm = parts[1] ? parts[1].padStart(2,'0') : '00';
  if (pm && hh < 12) hh += 12;
  if (am && hh === 12) hh = 0;
  return `${String(hh).padStart(2,'0')}:${mm}`;
}

// very simple line-based heuristic parser
function parseMedicinesFromText(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const meds = [];
  const timeRegex = /(\d{1,2}:\d{2}\s*(AM|PM)?)|(\d{1,2}:\d{2})/i;
  const mgRegex = /\b(\d{2,4}\s?(mg|ml))\b/i;

  for (const line of lines) {
    // try to capture: "Paracetamol 650mg 1-0-1 9:00 PM" or "Paracetamol 650mg after food 9:00PM"
    // take first word groups as name until a digit/strength/time appears
    if (line.length < 3) continue;

    // reject lines that are like addresses
    if (line.toLowerCase().includes('hospital') || line.toLowerCase().includes('dr.')) continue;

    // attempt to find a medicine name + optional strength + optional time
    const timeMatch = line.match(timeRegex);
    const strengthMatch = line.match(mgRegex);

    // pick name as initial words before strength or time or 'tab' or 'tablet'
    let name = line;
    if (strengthMatch) {
      name = line.split(strengthMatch[0])[0].trim();
    } else if (timeMatch) {
      name = line.split(timeMatch[0])[0].trim();
    } else {
      // if line contains words like "tablet" or "tab" split
      const splitIdx = line.search(/\btablet\b|\btab\b|\bdose\b/i);
      if (splitIdx > 0) {
        name = line.slice(0, splitIdx).trim();
      } else {
        // keep entire line as fallback
        name = line;
      }
    }

    // dosage string
    const dosage = strengthMatch ? strengthMatch[0] : (line.match(/\b\d+\s*(tablet|tab|capsule|cap)\b/i) || [null])[0] || '1 dose';
    const time24 = timeMatch ? convertTo24(timeMatch[0]) : null;
    const beforeAfterMeal = /after/i.test(line) ? 'after' : /before/i.test(line) ? 'before' : 'any';

    // clean name
    name = name.replace(/[^A-Za-z0-9\-\s]/g, '').trim();
    if (!name) continue;

    meds.push({ name, strength: strengthMatch ? strengthMatch[0] : null, dosage, time24, beforeAfterMeal });
  }

  return meds;
}

// controller
exports.handleUpload = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const filePath = req.file.path;

    // create worker, run OCR
    const worker = createWorker({
      logger: m => { /* optional progress */ }
    });
    await worker.load();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');

    const { data: { text } } = await worker.recognize(filePath);
    await worker.terminate();

    // parse medicines
    const medicinesParsed = parseMedicinesFromText(text);

    // save parsed medicines to DB under req.user.id
    const savedItems = [];
    if (req.user && req.user.id && medicinesParsed.length) {
      for (const m of medicinesParsed) {
        const payload = {
          userId: req.user.id,
          name: m.name,
          strength: m.strength,
          dosage: m.dosage || '1 dose',
          frequency: 'daily',
          doses: m.time24 ? [{ time24: m.time24, beforeAfterMeal: m.beforeAfterMeal }] : []
        };
        const doc = new Medicine(payload);
        await doc.save();
        savedItems.push(doc);
      }
    }

    // optionally delete uploaded file
    try { fs.unlinkSync(filePath); } catch (err) { /* ignore */ }

    return res.json({
      success: true,
      rawText: text,
      medicinesParsed,
      savedCount: savedItems.length,
      savedItems
    });
  } catch (err) {
    console.error('Prescription upload error:', err);
    return res.status(500).json({ error: 'Failed to process prescription', details: err.message });
  }
};
