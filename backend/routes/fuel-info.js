const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const {getFuelTypes} = require("../controllers/fuel-info-controllers/fuel-types-controller");
const {getStationsNearMe} = require("../controllers/fuel-info-controllers/near-me-controller");
const {getStation} = require("../controllers/fuel-info-controllers/station-info-controller");
const {errHandler} = require("../utils/errHandler");


router.get("/fuel-types", errHandler(getFuelTypes));

router.get("/near-me/", errHandler(getStationsNearMe))

router.get("/station/:sid/:gid", errHandler(getStation))

module.exports = router;