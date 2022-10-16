import React from "react";
import {useSiteDetails} from "../hooks/siteDetails";
import {useFetchFuelTypes} from "../hooks/fuelTypes";
import {formatPrice} from "../utils/formatPrice";
import {Spinner, Table} from "reactstrap";

const StationInfo = ({sID, gID, siteName, address}) => {
    const siteDetails = useSiteDetails(sID, gID);
    const fuelTypes = useFetchFuelTypes();

    if (siteDetails.loading || fuelTypes.loading) {
        return <Spinner/>;
    }

    return (
        <div className="station-info">
            <h1>{siteName}</h1>
            <p>{address}</p>
            <p>
                <strong>
                    {siteDetails.siteDetails?.open_now === "true"
                        ? "Open now"
                        : "Closed now"}
                </strong>
            </p>

            <div className="fuel_table">
                <Table bordered={true}>
                    <thead>
                    <tr>
                        <th>Fuel Type</th>
                        <th>Price</th>
                    </tr>
                    </thead>
                    <tbody>
                    {siteDetails.siteDetails.fuels &&
                        siteDetails.siteDetails.fuels.map((fuel) => {
                            return (
                                <tr key={fuel.fuelId}>
                                    <td>
                                        {
                                            fuelTypes.fuelTypes.find(
                                                (f) => f.FuelId === fuel.fuelId
                                            ).Name
                                        }
                                    </td>
                                    <td>{formatPrice(fuel.price)}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
            </div>
            <img src={siteDetails.siteDetails.image} alt="null"/>
        </div>
    );
};

export default StationInfo;
