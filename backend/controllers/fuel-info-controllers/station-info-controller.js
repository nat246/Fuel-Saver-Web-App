const { fuelStation, fuelPrices } = require("../../services/qld-fuel-api");
const createError = require("http-errors");
const { placeDetails, getSiteImage} = require("../../services/google-maps-api");

const getStation = async (req, res, next) => {
  const stationId = +req.params.sid;
  const gPlaceId = req.params.gid;

  let fuelStationJSON = await fuelStation(stationId);
  let fuelPricesJSON = await fuelPrices(stationId);
  let placeDetailsJSON = await placeDetails(gPlaceId);


  const data = {
    id: fuelStationJSON.S,
    name: fuelStationJSON.N,
    address: placeDetailsJSON.vicinity,
    image: placeDetailsJSON.hasOwnProperty("photos")
      ? getSiteImage(placeDetailsJSON.photos[0]?.photo_reference)
      : "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg?20200913095930",
    fuels: [],
    open_now: placeDetailsJSON.opening_hours.open_now === true ? "true" : "false",
  };

  await fuelPricesJSON.map(
      (fuel) => {
        data.fuels.push({
          fuelId: fuel.FuelId,
          price: fuel.Price,
          lastUpdated: fuel.TransactionDateUtc,
        });
      }
  );

  res.json(data)
};

exports.getStation = getStation;
