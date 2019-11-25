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
        var htmlElements = '';
        for (var i = 0; i < 10; i++) {
            htmlElements += `
                <div class="flex border bg-green-100 mb-10">` +
                    `<div class="flex-1 justify-start>` +
                        `<a href="https://en.wikipedia.org/wiki/Boracay" target="_blank"><img src="//www.html.am/images/html-codes/links/boracay-white-beach-sunset-300x225.jpg" width="300" height="225" alt="Photo of White Beach in Boracay, Philippines" /></a>` +
                    `</div>` +
                    `<div class="lg:px-8 justify-end">` +
                        `<div class="text-xl product_name">` + items[i].product_name + `</div>` +
                        `<div class="text-lg product_id">` + items[i].id + `</div>`+
                        `<div class="unit_retail">` + items[i].unit_retail + `</div>` +
                    `</div>` +
                `</div>`
            ;
        }
        var container = document.getElementById("container");
        container.innerHTML = htmlElements;
        }



    return (<>
        Unit1
        <div className="flex max-w-full sm:px-8 lg:px-20">
            <div className="hidden lg:block flex-1 w-1/5 border bg-yellow-200 justify-start">
                <div className="flex text-xl justify-center">
                    Settings
                </div>
            </div>
            <div className="w-full lg:w-4/5 justify-end">
                <div>{load ? loopfetching() : null}  </div>
                <div id="container" className="bg-orange-100"> </div>
                </div>
            </div>
        </>);
}