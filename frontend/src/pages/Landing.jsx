import React from "react";
import Filters from "../components/Filters";
import { useFetchCount } from "../hooks/counter";

const Landing = () => {

    const count = useFetchCount();

    return (
        <div>
            <p>Visit Counter: {count}</p>
            <h1>Find Me Cheap Fuel</h1>
            <Filters/>
        </div>
    );
};

export default Landing;