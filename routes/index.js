var express = require('express');
var router = express.Router();
const airports = require('../airports-list.json')

/* GET home page. */
router.get('/', async function(req, res, next) {
  const airportTypesArray = []
  const cityNamesArray = []
  const countyNamesArray = []

  airports.forEach((airport) => {
    airportTypesArray.push(airport.Type)
    cityNamesArray.push(airport.City)
    countyNamesArray.push(airport.County)
  })

  const airportTypes = (new Set(airportTypesArray))
  const cityNames = (new Set(cityNamesArray))
  const countyNames = (new Set(countyNamesArray))

  res.render('index', { airportTypes, cityNames, countyNames });
});

module.exports = router;
