function filterSightings(allSightings, options) {
  const { start, end, location } = options;

  let startDate = null;
  let endDate = null;

  // Convert start string to Date if provided
  if (start) {
    const d = new Date(start);
    if (Number.isNaN(d.getTime())) {
      throw new Error('Invalid start date (use YYYY-MM-DD)');
    }
    startDate = d;
  }

  // Convert end string to Date if provided
  if (end) {
    const d = new Date(end);
    if (Number.isNaN(d.getTime())) {
      throw new Error('Invalid end date (use YYYY-MM-DD)');
    }
    endDate = d;
  }

  return allSightings.filter((s) => {
    // s.timestamp is a Date object from your CSV loader

    if (startDate && s.timestamp < startDate) {
      return false;
    }

    if (endDate && s.timestamp > endDate) {
      return false;
    }

    if (location && s.location.toLowerCase() !== location.toLowerCase()) {
      return false;
    }

    return true; // keep this one
  });
}

module.exports = { filterSightings };
