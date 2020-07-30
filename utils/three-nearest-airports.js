const airports = require("../airports-list.json");
const calculateDistance = require("./distance");

async function getThreeNearestAirport(airport) {
  const obj = {
    distance: Infinity,
  };
  const nearestAirports = [obj, obj, obj];
  let i, len, largest;
  i = len = 0;

  for await (currAirport of airports) {
    if (currAirport.SiteNumber == airport.SiteNumber) {
      continue;
    }
    currAirport.distance = calculateDistance(airport, currAirport);
    if (currAirport.distance < nearestAirports[0].distance) {
      nearestAirports[0] = currAirport;
      largest = 0;
      if (nearestAirports[0].distance < nearestAirports[1].distance) {
        console.log("largest is 1");
        largest = 1;
      }
      if (nearestAirports[largest].distance < nearestAirports[2].distance) {
        console.log("largest is 2");
        largest = 2;
      }

      if (largest != 0) {
        let temp = nearestAirports[largest];
        nearestAirports[largest] = nearestAirports[0];
        nearestAirports[0] = temp;
      }
    }
  }
  return nearestAirports;
}

module.exports = getThreeNearestAirport;
