const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'ticks.csv');

// Helper: turn "2019-02-20T13:56:04" into a JS Date object
function parseDate(value) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) {
    throw new Error('Invalid date: ' + value);
  }
  return d;
}

async function loadData() {
  const raw = fs.readFileSync(DATA_FILE, 'utf-8');

  const lines = raw.split('\n').map(line => line.trim());
  const header = lines[0].split(',');

  // Find indexes in the header row
  const idIndex = header.indexOf('id');
  const dateIndex = header.indexOf('date');
  const locationIndex = header.indexOf('location');
  const speciesIndex = header.indexOf('species');
  const latinIndex = header.indexOf('latinName');

  const sightings = [];

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i]) continue; // skip empty rows

    const cols = lines[i].split(',');

    const id = cols[idIndex];
    const dateRaw = cols[dateIndex];
    const location = cols[locationIndex];
    const species = cols[speciesIndex];
    const latinName = cols[latinIndex];

    // Skip rows missing important stuff
    if (!id || !dateRaw || !location) continue;

    let timestamp;
    try {
      timestamp = parseDate(dateRaw);
    } catch {
      continue;
    }

    sightings.push({
      id,
      timestamp,
      location,
      species: species || null,
      latinName: latinName || null
    });
  }

  return sightings;
}

module.exports = { loadData };
