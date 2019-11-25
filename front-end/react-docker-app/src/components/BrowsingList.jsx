import React, { useState,useEffect } from 'react';
import '../css/mainTailwind.css';
import axios from 'axios';
export const BrowsingList =(props) => {
    var initValue = [];
    const [items, setItems] = useState([]);
    const [load, setLoad] = useState(false);
    useEffect(() => {
        document.title = `Home Depot - Browsing`;
        fetching();
    }, []);
    
    const fetching = async () => {
        await axios.get("http://localhost:7000/catalog-api/products/page?pageSize=10&pageIndex=1").then((res) => {
            for (var i = 0; i < 10; i++) {
                initValue.push({ id: res.data.data[i].id, product_name: res.data.data[i].product_name, unit_retail: res.data.data[i].unit_retail });
            }
            setItems(initValue)
            setLoad(true);
        });}




    return (<> 
            Unit 1:
            <div className="pl-8">
                <div>  {load ? items[0].id : console.log("")} </div>
                <div> {load ? items[0].product_name : console.log("")} </div>
                <div> {load ? items[0].unit_retail : console.log("")} </div>
            </div>

            Unit 2:
                <div className="pl-8">
                <div>  {load ? items[1].id : console.log("")} </div>
                <div> {load ? items[1].product_name : console.log("")} </div>
                <div> {load ? items[1].unit_retail : console.log("")} </div>
            </div>
        </>);
}