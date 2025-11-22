const express = require('express');
const { loadData } = require('./data');
const { filterSightings } = require('./filters');
const { sightingsPerRegion, trendsOverTime } = require('./stats');

const app = express();
const PORT = 3000;

// This array will hold all sightings in memory
let SIGHTINGS = [];

// Start the server only after data is loaded
async function startServer() {
  try {
    SIGHTINGS = await loadData();
    console.log('Loaded sightings:', SIGHTINGS.length);
  } catch (err) {
    console.error('Failed to load data:', err.message);
    // If loading fails, we still start the server with an empty array
    SIGHTINGS = [];
  }

  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    sightingsLoaded: SIGHTINGS.length,
  });
});

app.get('/sightings', (req, res) => {
  if (!SIGHTINGS.length) {
    return res.status(503).json({ error: 'No data loaded' });
  }

  // Read query params: /sightings?start=2020-01-01&end=2020-02-01&location=London
  const { start, end, location } = req.query;

  try {
    const results = filterSightings(SIGHTINGS, { start, end, location });
    res.json(results);
  } catch (err) {
    // If filterSightings threw an error (e.g. bad date format)
    res.status(400).json({ error: err.message });
  }
});

// Number of sightings per region (we use "location" as region)
app.get('/stats/regions', (req, res) => {
  if (!SIGHTINGS.length) {
    return res.status(503).json({ error: 'No data loaded' });
  }

  const stats = sightingsPerRegion(SIGHTINGS);
  res.json(stats);
});

// Trends over time: weekly or monthly
app.get('/stats/trends', (req, res) => {
  if (!SIGHTINGS.length) {
    return res.status(503).json({ error: 'No data loaded' });
  }

  const interval = req.query.interval || 'weekly'; // default to weekly

  if (interval !== 'weekly' && interval !== 'monthly') {
    return res
      .status(400)
      .json({ error: 'interval must be "weekly" or "monthly"' });
  }

  const stats = trendsOverTime(SIGHTINGS, interval);
  res.json(stats);
});


// Actually start everything
startServer();
