const express = require("express");
const router = express.Router();
const airports = require("../airports-list.json");
const threeNearestAirports = require("../utils/three-nearest-airports");
const calculateDistance = require("../utils/distance");

router.get("/", async (req, res) => {
  const airportType = req.query.airport_types;
  const cityName = req.query.city_names;
  const countyName = req.query.county_names;
  const Airports = airports.filter((airport) => {
    return (
      (!airportType || airportType == airport.Type) &&
      (!cityName || cityName == airport.City) &&
      (!countyName || countyName == airport.County)
    );
  });
  res.status(200).json(Airports);
});

router.get("/distance", async (req, res) => {
  const airport1SiteNumber = req.query.airport1SiteNumber;
  const airport2SiteNumber = req.query.airport2SiteNumber;

  if (!airport1SiteNumber || !airport2SiteNumber) {
    return res.status(400).json({ message: "not valid airports" });
  }

  const airport1 = airports.find((airport) => {
    return airport.SiteNumber == airport1SiteNumber;
  });
  const airport2 = airports.find((airport) => {
    return airport.SiteNumber == airport2SiteNumber;
  });

  if (!airport1 || !airport2) {
    return res.status(404).json({ messge: "airport not found" });
  }
  const distance = calculateDistance(airport1, airport2);
  return res.status(200).json({ distance });
});

router.get("/three-nearest/:SiteNumber", async (req, res) => {
  const siteNumber = req.params.SiteNumber;
  const airport = airports.find((airport) => {
    return airport.SiteNumber == siteNumber;
  });
  if (!airport) {
    return res.status(404).json({ message: "airport not found" });
  }
  if (airport.nearestAirports) {
    return res.status(200).json(airport.nearestAirports);
  }

  const nearestAirports = await threeNearestAirports(airport);
  airport.nearestAirports = nearestAirports;
  res.status(200).json(nearestAirports);
});

module.exports = router;
