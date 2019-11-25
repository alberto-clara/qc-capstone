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
        });
    }
    const loopfetching = ()=> {
        console.log("hell");

        var htmlElements = "";
        for (var i = 0; i < 10; i++) {
            htmlElements += '<div className="product_id">' + items[i].id + '</div>';
            htmlElements += '<div className="product_name">' + items[i].product_name + '</div>';
            htmlElements += '<div className="unit_retail">' + items[i].unit_retail + '</div>';
        }
        var container = document.getElementById("container");
        container.innerHTML = htmlElements;
        }



    return (<>
        Unit1
        <div className="pl-8">
            <div>{load ? loopfetching() : null}  </div>
            <div id="container"> </div>
            </div>

            Unit 2:
                <div className="pl-8">
                <div>  {load ? items[1].id : null} </div>
                <div> {load ? items[1].product_name : null} </div>
                <div> {load ? items[1].unit_retail : null} </div>
            </div>
        </>);
}