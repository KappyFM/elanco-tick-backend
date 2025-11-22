// Count how many sightings per location (region)
function sightingsPerRegion(allSightings) {
  const counts = {};

  for (const s of allSightings) {
    // Use location as "region" for this project
    const region = s.location || 'Unknown';

    if (!counts[region]) {
      counts[region] = 0;
    }
    counts[region] += 1;
  }

  return counts;
}

// Trends over time: "weekly" or "monthly"
function trendsOverTime(allSightings, interval) {
  const buckets = {}; // key -> count

  for (const s of allSightings) {
    const d = s.timestamp; // Date object
    let key;

    if (interval === 'weekly') {
      // Simple week-of-year calculation
      const year = d.getUTCFullYear();
      const firstJan = new Date(Date.UTC(year, 0, 1));
      const diffMs = d - firstJan;
      const dayMs = 24 * 60 * 60 * 1000;
      const diffDays = Math.floor(diffMs / dayMs);
      const week = Math.floor(diffDays / 7) + 1;

      key = `${year}-W${String(week).padStart(2, '0')}`;
    } else {
      // Monthly
      const year = d.getUTCFullYear();
      const month = d.getUTCMonth() + 1; // 0-based
      key = `${year}-${String(month).padStart(2, '0')}`;
    }

    if (!buckets[key]) {
      buckets[key] = 0;
    }
    buckets[key] += 1;
  }

  // Sort keys so output is in time order
  const entries = Object.entries(buckets).sort((a, b) =>
    a[0] < b[0] ? -1 : 1
  );

  const sorted = {};
  for (const [k, v] of entries) {
    sorted[k] = v;
  }

  return sorted;
}

module.exports = { sightingsPerRegion, trendsOverTime };
