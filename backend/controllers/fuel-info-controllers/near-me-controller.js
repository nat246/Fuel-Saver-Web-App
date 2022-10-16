const {stationsNearMe, getNextPageResults} = require("../../services/google-maps-api");
const {fuelStationByGPI, fuelPrices, fuelTypes} = require("../../services/qld-fuel-api");
const getStationsNearMe = async (req, res, next) => {
    if (!req.query.lat || !req.query.lng || !req.query.fuel) {
        return res.status(400).json({
            message: "Missing one or more of the require queries: lat, lng or fuel",
        });
    }

    const query_data = {
        location: {
            lat: +req.query.lat,
            lng: +req.query.lng,
        },
        radius: +req.query.radius || 2000,
        fuel: +req.query.fuel,

        // dummy data:
        // location: {
        //   lat: -27.62331,
        //   lng: 153.0471,
        // },
        // radius: 5000,
        // fuel: 12,
    };

    let stationsNearMeJSON = await stationsNearMe({
            lat: query_data.location.lat,
            lng: query_data.location.lng,
            radius: query_data.radius,
        })
    ;

    const extractedGPIs = await Promise.all(
        stationsNearMeJSON.data.map(
            (site) => {
                return {
                    GPI: site.place_id,
                    location: site.geometry.location,
                    address: site.vicinity,
                };
            }
        )
    );

    const filterStationByGPI = await Promise.all(
        extractedGPIs.map(
            async (site) => {
                const station = await fuelStationByGPI(site.GPI);

                if (station !== undefined) {
                    return {
                        sID: station.S,
                        gID: station.GPI,
                        name: station.N,
                        address: site.address,
                        brand: station.B,
                        location: site.location,
                    };
                }
            }
        )
    );


    const retrieveFuelPrice = await Promise.all(
        filterStationByGPI.map(async (site) => {
            let siteFuelDetails;
            let fuelName;

            try {
                if (site !== undefined) {
                    siteFuelDetails = await fuelPrices(site.sID).then((rsp) => {
                        return rsp.find(
                            (value) => value.FuelId === query_data.fuel
                        );
                    });

                    fuelName = await fuelTypes();

                    return {
                        sID: site.sID,
                        gID: site.gID,
                        name: site.name,
                        address: site.address,
                        brand: site.brand,
                        fuelDetails: {
                            fID: query_data.fuel,
                            fName: fuelName.find(
                                (f ) => f.FuelId === query_data.fuel
                            ).Name,
                            price: siteFuelDetails.Price,
                            cheapest: false,
                        },
                        location: site.location,
                        radius: query_data.radius,
                    };
                }
            } catch (e) {
            }
        })
    );

    // Filters out null values
    let data = retrieveFuelPrice.filter((v) => v !== undefined);

    const determineCheapest = async() => {
        const prices = data.map((price) => {
            return price.fuelDetails.price
        });

        const cheapestPrice = Math.min(...prices)

        try{
            // @ts-ignore
            data.find((value) => value.fuelDetails.price === cheapestPrice).fuelDetails.cheapest = true
        } catch(err) {
            console.error(err)
        }

    };

    determineCheapest()

    res.json(data);
}

exports.getStationsNearMe = getStationsNearMe;