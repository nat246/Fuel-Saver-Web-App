import React, { useEffect, useState } from "react";
import { useFetchFuelTypes } from "../hooks/fuelTypes";
import Map from "./Map";

const Filters = (props) => {
  const fuelTypes = useFetchFuelTypes().fuelTypes;
  const [distance, setDistance] = useState(2000);
  const [fuel, setFuel] = useState("");

  useEffect(() => {
    setFuel(fuelTypes[0]?.FuelId);
  }, [fuelTypes]);


  return (
    <React.Fragment>
      <label>Distance: </label>
      <select
        name="distance"
        defaultValue="2km"
        onChange={(event) => {
          const selected = event.target.value;
          setDistance(selected);
        }}
      >
        <option value={2000}>2km</option>
        <option value={5000}>5km</option>
        <option value={10000}>10km</option>
        <option value={15000}>15km</option>
        <option value={20000}>20km</option>
      </select>

      <label>Fuel Type: </label>
      <select
        name="fuel-type"
        onChange={(event) => {
          const selected = event.target.value;
          setFuel(selected);
        }}
      >
        {fuelTypes.map((fuelType) => (
          <option key={fuelType.FuelId} value={fuelType.FuelId}>
            {fuelType.Name}
          </option>
        ))}
      </select>

        <p>Click on the map to view fuel stations in your area (requires location permissions)</p>

      {fuel === undefined || isNaN(distance) ? (
        <div id="map">
          <p>Loading Map...</p>
        </div>
      ) : (
        <Map radius={distance} fuelId={fuel} />
      )}
    </React.Fragment>
  );
};

export default Filters;
