import axios from "axios";
import { useEffect, useState } from "react";

const fetchLocation = async (location) => {
    const url = `${process.env.REACT_APP_API_URL}/search-coord?location=${location}`;

    const result = await fetch(url) 
        .then(res => res.json());
    
    return result;
}

export function useFetchLocation(location) {
    const [locationData, setLocationData] = useState([]);
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        fetchLocation(location)
          .then((data) => {
            setLocationData(data);
            setLoading(false);
          })
          .catch((err) => {
              setLoading(true)
            console.log(err);
          });
    }, [location]);

    return {locationData, loading};
}