import {useState, useEffect} from "react";

function fetchFuelTypes() {
    const url = `${process.env.REACT_APP_API_URL}/info/fuel-types`
    return fetch(url)
        .then(res => {
            if(res.ok){
                return res.json();
            }
        })
}

export function useFetchFuelTypes() {
    const [fuelTypes, setFuelTypes] = useState([]);
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        fetchFuelTypes()
          .then((data) => {
            setFuelTypes(data);
            setLoading(false);
          })
          .catch((err) => {
              setLoading(true)
            console.log(err);
          });
    }, []);

    return {fuelTypes, loading};
}