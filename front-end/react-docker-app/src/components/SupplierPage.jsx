import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import axios from 'axios';
import FireBaseSetup from '../FireBaseSetup';

export const SupplierPage = () => {
    let { ids } = useParams();
    const [UserUID, setUserUID] = useState("");
    useEffect(() => {
        document.title = `Home Depot - Supplier`;
        FireBaseSetup.isInitialized().then(user => {
            if (user) {
             
                setUserUID(user.uid);
            }
        });
        fetching(ids);

    }, []);

    const fetching = async(ids) => {
        console.log(ids);

        await axios.get("http://localhost:7000/catalog-api/products/supplier/" + ids).then((res) => {
            console.log(res.data.data);});
    }
    return (<>
    hi
    </>)
}
