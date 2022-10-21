import React, { useState } from "react";
import { useNearbyFuelSites } from "../hooks/nearbyFuelSites";
import {
  Circle,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvents,
} from "react-leaflet";
import ReactLeafletGoogleLayer from "react-leaflet-google-layer";
import StationInfo from "./StationInfo";
import { formatPrice } from "../utils/formatPrice";
import * as L from "leaflet";
import { FormGroup, Input, Label, Table } from "reactstrap";
import { useFetchLocation } from "../hooks/locationSearch";

const Map = ({ radius, fuelId }) => {
  const [location, setLocation] = useState({ lat: -27.47003, lng: 153.02298 });
  const [siteInfo, setSiteInfo] = useState();
  const [searchCoords, setSearchCoords] = useState();

  const data = useNearbyFuelSites(location, radius, fuelId);
  const fuelStations = data.stations;

  const coords = useFetchLocation(searchCoords).locationData;

  return (
    <React.Fragment>
      {data.loading === true ? (
        <p>
          <strong>Loading sites...</strong>
        </p>
      ) : (
        <br />
      )}

      <FormGroup
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <Label>Search</Label>
        <Input
          id="search"
          name="search"
          placeholder="Search for a location"
          type="search"
          onChange={(e) => {
            const { value } = e.target;
            setSearchCoords(value);
          }}
        />
        <button
          onClick={() => {
            console.log(`Button submit ${coords}`);
            setLocation(coords);
          }}
          type="submit"
        >
          Search
        </button>
      </FormGroup>
        <div id="map">
          <MapContainer center={location} zoom={13}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <MyLocation setLocation={setLocation} />

            <Circle center={location} radius={radius} />

            <FuelStationMarkers
              fuelStations={fuelStations}
              setSiteInfo={setSiteInfo}
            />

            {/*<ReactLeafletGoogleLayer*/}
            {/*  apiKey={process.env.REACT_APP_GOOGLE_MAPS_API}*/}
            {/*/>*/}
          </MapContainer>
        </div>

        <FuelStationsTable fuelStations={fuelStations} />

      {siteInfo === undefined ? (
        <p>Please Click a Marker</p>
      ) : (
        <StationInfo
          sID={siteInfo.sID}
          gID={siteInfo.gID}
          siteName={siteInfo.name}
          address={siteInfo.address}
        />
      )}
    </React.Fragment>
  );
};

const MyLocation = (props) => {
  const [position, setPosition] = useState(null);

  const map = useMapEvents({
    click() {
      map.locate();
    },
    locationfound(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  const LeafIcon = L.Icon.extend({
    options: {},
  });

  const myLocIcon = new LeafIcon({
    iconUrl:
      "https://findicons.com/files/icons/766/base_software/128/circle_blue.png",
    iconSize: [20, 20],
  });

  if (position !== null) {
    props.setLocation(position);
  }

  return position === null ? null : (
    <Marker position={position} icon={myLocIcon}>
      <Popup>You are here</Popup>
    </Marker>
  );
};

const FuelStationMarkers = ({ fuelStations, setSiteInfo }) => {
  const LeafIcon = L.Icon.extend({
    options: {},
  });

  const bestPriceIcon = new LeafIcon({
    iconUrl: require("../media/green-fuel-marker.png"),
    iconSize: [40, 60],
    iconAnchor: [30, 60],
    popupAnchor: [-10, -60],
  });

  const defaultIcon = new LeafIcon({
    iconUrl: require("../media/red-fuel-marker.png"),
    iconSize: [40, 60],
    iconAnchor: [30, 60],
    popupAnchor: [-10, -60],
  });

  return fuelStations.map((site) => {
    let icon;
    let bestText;
    if (site.fuelDetails.cheapest === true) {
      icon = bestPriceIcon;
      bestText = "Cheapest Fuel!";
    } else {
      icon = defaultIcon;
    }

    return (
      <Marker
        position={site.location}
        key={site.sID}
        icon={icon}
        eventHandlers={{
          click: (e) => {
            setSiteInfo({
              sID: site.sID,
              gID: site.gID,
              name: site.name,
              address: site.address,
            });
          },
        }}
      >
        <Popup>
          {bestText !== null ? <strong>{bestText}</strong> : null}
          {site.fuelDetails.cheapest === true ? <br /> : null}
          <strong>{site.name}</strong>
          <br />
          {site.fuelDetails.fName}: {formatPrice(site.fuelDetails.price)}
        </Popup>
      </Marker>
    );
  });
};


const FuelStationsTable = ({fuelStations}) => {
  return (
    <div className="fuel_stations_table">
      <h3>Fuel stations in this area</h3>
          <Table bordered={true} hover={true} responsive={true}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Address</th>
                <th>Price ({fuelStations[0]?.fuelDetails.fName})</th>
              </tr>
            </thead>
            <tbody>
              {fuelStations.map((site) => {
                return (
                  <tr key={site.sID}>
                    <td>{site.name}</td>
                    <td>{site.address}</td>
                    <td>{formatPrice(site.fuelDetails.price)}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
  )
}
export default Map;
