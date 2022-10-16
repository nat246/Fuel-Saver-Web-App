import {useEffect, useState} from "react";

const fetchSiteDetails = (sID, gID) => {
    const url = `${process.env.REACT_APP_API_URL}/info/station/${sID}/${gID}`
    return fetch(url)
        .then((res) => {
            if (res.ok) {
                return res.json();
            }
        })
}

export function useSiteDetails(sID, gID) {
    const [siteDetails, setSiteDetails] = useState([]);
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        fetchSiteDetails(sID, gID).then((data) => {
            setSiteDetails(data);
        })
            .catch(err => {
                console.log(err)
            })
            .finally(() => {
                setLoading(false)
            })
    }, [sID, gID]);

    return { siteDetails, loading };
}