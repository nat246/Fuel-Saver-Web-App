import { useEffect, useState } from "react";

const fetchNearbyFuelSites = (location, radius, fuel) => {

  //  Set default fuel type
  // if (!fuel) {
  //   fuel = 2;
  // }
  const url = `${process.env.REACT_APP_API_URL}/info/near-me?lat=${location.lat}&lng=${location.lng}&radius=${radius}&fuel=${fuel}`;
  return fetch(url)
    .then((res) => {
      if (res.ok) {
        return res.json();
      }
    })
    .catch((err) => console.log(err));
};

export function useNearbyFuelSites(location, radius, fuel) {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchNearbyFuelSites(location, radius, fuel)
      .then((data) => {
        setStations(data);
        setLoading(false);
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setLoading(false);
      });
  }, [location, radius, fuel]);

  return { stations, loading };
}
