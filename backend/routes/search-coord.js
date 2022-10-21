const { getSearchCoordinates } = require('../controllers/search-coordinates-controller');


const express = require('express');
const router = express.Router();

router.get('//', getSearchCoordinates);

module.exports = router;