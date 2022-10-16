const axios = require("axios");

const errObj = (err, message) => {
    return {
      status: err.response.status,
      statusText: `${message} (${err.response.statusText})`,
    };
}

const fuelTypes = () => {
  return axios
    .get(
      "https://fppdirectapi-prod.fuelpricesqld.com.au/Subscriber/GetCountryFuelTypes?countryId=21",
      {
        headers: {
          Authorization: `FPDAPI SubscriberToken=${process.env.QLD_FUEL_KEY}`,
          "Content-Type": "application/json",
        },
      }
    )
    .then((res) => res.data.Fuels)
    .catch((err) => {
      throw errObj(err, "Cannot get fuel types");
    });
};

const fuelStation = (stationId) => {
  return axios
    .get(
      "https://fppdirectapi-prod.fuelpricesqld.com.au/Subscriber/GetFullSiteDetails?countryId=21&geoRegionLevel=3&geoRegionId=1",
      {
        headers: {
          Authorization: `FPDAPI SubscriberToken=${process.env.QLD_FUEL_KEY}`,
          "Content-Type": "application/json",
        },
      }
    )
    .then((res) => {
      return res.data.S.find((site) => site.S === stationId);
    })
    .catch((err) => {
      throw errObj(err, "Cannot get fuel station");
    });
};

const fuelStationByGPI = (gPlaceId) => {
  return axios
    .get(
      "https://fppdirectapi-prod.fuelpricesqld.com.au/Subscriber/GetFullSiteDetails?countryId=21&geoRegionLevel=3&geoRegionId=1",
      {
        headers: {
          Authorization: `FPDAPI SubscriberToken=${process.env.QLD_FUEL_KEY}`,
          "Content-Type": "application/json",
        },
      }
    )
    .then((res) => {
      return res.data.S.find((site) => site.GPI === gPlaceId);
    })
    .catch((err) => {
      throw errObj(err, "Cannot get fuel station by Google ID");
    });
};

const fuelPrices = (stationId) => {
  return axios
    .get(
      "https://fppdirectapi-prod.fuelpricesqld.com.au/Price/GetSitesPrices?countryId=21&geoRegionLevel=3&geoRegionId=1",
      {
        headers: {
          Authorization: `FPDAPI SubscriberToken=${process.env.QLD_FUEL_KEY}`,
          "Content-Type": "application/json",
        },
      }
    )
    .then((res) => {
      return res.data.SitePrices.filter((site) => site.SiteId === stationId);
    })
    .catch((err) => {
        throw errObj(err, "Cannot get fuel prices");
    });
};

exports.fuelTypes = fuelTypes;
exports.fuelStation = fuelStation;
exports.fuelStationByGPI = fuelStationByGPI;
exports.fuelPrices = fuelPrices;
