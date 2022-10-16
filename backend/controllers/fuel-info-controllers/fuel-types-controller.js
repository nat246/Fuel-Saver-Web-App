const { fuelTypes } = require("../../services/qld-fuel-api");
const createError = require("http-errors");

const getFuelTypes = async (req, res, next) => {

  let fuelTypesJSON = await fuelTypes()

  res.json(fuelTypesJSON);
};

exports.getFuelTypes = getFuelTypes;