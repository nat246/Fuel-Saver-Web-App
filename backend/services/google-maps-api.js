const axios = require("axios");

const errObj = (err, status, message) => {
  return {
    status: status,
    statusText: `${message} (${err.error_message})`,
  };
};

const getSiteImage = (imgRef) => {
  const image = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=720&photo_reference=${encodeURI(
    imgRef
  )}&key=${process.env.GOOGLE_MAPS_KEY}`;

  return image;
};

const placeDetails = (gPlaceId) => {
  return axios(placeDetailsConfig(gPlaceId))
    .then((res) => {
      const data = res.data.result;

      if (!data) {
        throw res.data;
      }

      return data;
    })
    .catch((err) => {
      throw errObj(err, 400, "Cannot get google place details");
    });
};

const stationsNearMe = async (query) => {
  return await axios(stationsNearMeConfig(query))
    .then(async (res) => {
      const data = res.data.results;

      if (!data) {
        throw res.data;
      }

      return {
        next_page_token: res.data.next_page_token,
        data: data,
      };
    })
    .catch((err) => {
      throw errObj(err, 400, "Cannot get google places near me");
    });
};

const searchCoordinates = async (searchText) =>{
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${searchText}&key=${process.env.GOOGLE_MAPS_KEY}`
 
  return await axios.get(url)
    .then(res => res.data.results[0].geometry.location)
}

// const getNextPageResults = async (query, token) => {
//     return await axios(stationsNearMeNextPageConfig(query, token))
//         .then(async (res) => {
//             const data = res.data.results;
//
//             if (!data) {
//                 throw res.data;
//             }
//
//             return {
//                 next_page_token: res.data.next_page_token,
//                 data: data,
//             };
//         })
//         .catch((err) => {
//             throw errObj(err, 400, "Cannot get google places near me");
//         });
// }

const getNextPageResults = async (query, token) => {
  console.log(token)
  return await axios
    .get(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?&location=${query.lat},${query.lng}&radius=${query.radius}&keyword=fuel+station&pagetoken=${token}&key=${process.env.GOOGLE_MAPS_KEY}`
    )
    .then( (res) => {
      console.log(res)
      const data = res.data.results;

      if (!data) {
        throw res.data;
      }

      return {
        next_page_token: res.data.next_page_token,
        data: data,
      };
    })
    .catch((err) => {
      throw errObj(err, 400, "Cannot get google places near me");
    });
};

const placeDetailsConfig = (gPlaceId) => {
  return {
    method: "get",
    url: `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURI(
      gPlaceId
    )}&fields=photo,vicinity,opening_hours&key=${process.env.GOOGLE_MAPS_KEY}`,
    headers: {},
  };
};

const stationsNearMeConfig = (query) => {
  return {
    method: "get",
    url: `https://maps.googleapis.com/maps/api/place/nearbysearch/json?&location=${query.lat},${query.lng}&radius=${query.radius}&keyword=fuel+station&key=${process.env.GOOGLE_MAPS_KEY}`,
    headers: {},
  };
};

const stationsNearMeNextPageConfig = (query, nextPageToken) => {
  console.log(nextPageToken);
  return {
    method: "get",
    url: `https://maps.googleapis.com/maps/api/place/nearbysearch/json?&location=${query.lat},${query.lng}&radius=${query.radius}&keyword=fuel+station&pagetoken=${nextPageToken}&key=${process.env.GOOGLE_MAPS_KEY}`,
    headers: {},
  };
};

exports.getSiteImage = getSiteImage;
exports.placeDetails = placeDetails;
exports.stationsNearMe = stationsNearMe;
exports.getNextPageResults = getNextPageResults;
exports.searchCoordinates = searchCoordinates;