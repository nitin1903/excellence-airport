function calculateDistance(airport1, airport2) {
  const R = 6371e3;
  const lat1 = airport1.Lat;
  const lat2 = airport2.Lat;
  const lon1 = airport1.Lon;
  const lon2 = airport2.Lon;

  const lat1Radians = secondsToRadian(lat1);
  const lat2Radians = secondsToRadian(lat2);
  const deltaLat = secondsToRadian(Math.abs(lat2 - lat1));
  const deltaLon = secondsToRadian(Math.abs(lon2 - lon1));

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat2Radians) *
      Math.cos(lat2Radians) *
      Math.sin(deltaLon / 2) *
      Math.sin(deltaLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;

  return d;
}

function secondsToRadian(seconds) {
  return (seconds * Math.PI) / (180 * 3600);
}

module.exports = calculateDistance;
