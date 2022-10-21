const { searchCoordinates } = require("../services/google-maps-api");

const getSearchCoordinates = (req, res, next) => {
    const  searchText  = req.query.location;
    searchCoordinates(searchText)
        .then((data) => {
        res.json(data);
        })
        .catch((err) => {
        next(err);
        });
}

exports.getSearchCoordinates = getSearchCoordinates;