import { useEffect, useState } from "react";

function fetchCount(){
    const url = `${process.env.REACT_APP_API_URL}/counter`
    return fetch(url)
        .then(res => {
            if(res.ok){
                return res.json();
            }
        })
}

export function useFetchCount() {
    const [count, setCount] = useState();

    useEffect(() => {
        fetchCount().then((res) => setCount(res.count))
    },[])

    // fetchCount().then((res) => setCount(res.count))

    return count;
}