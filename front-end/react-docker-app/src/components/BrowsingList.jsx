import React, { useState,useEffect } from 'react';
import '../css/mainTailwind.css';
import { Link } from 'react-router-dom';
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
                <div class="flex rounded-lg border /*bg-green-100*/ mb-2 lg:mb-6">` +
                    `<div class="justify-start content-center>` +
                        `<a target="_blank"><img src="https://images.homedepot-static.com/productImages/8a89c543-1c72-4e6e-972f-0e5babb15a10/svn/husky-claw-hammers-n-s20shd-hn-64_400_compressed.jpg" width="150" height="112" alt="Hammer"/></a>` +
                    `</div>` +
                    `<div class="inline-block flex-1 px-4 py-1 lg:px-8 lg:py-1">` +
                        `<div class="text-sm lg:text-xl product_name">` + items[i].product_name + `</div>` +
                        `<div class="text-xs lg:text-lg pb-4 lg:hidden unit_retail">` + 'Cost: $' + items[i].unit_retail + `</div>` +
                        // `<div class="text-lg flex-wrap product_id">` + items[i].id + `</div>`+
                        `<div class="text-xs lg:text-md flex-wrap">` + `Delivers Today.` + `</div>`+
                        `<div class="flex content-end">` +
                            `<div class="text-xs lg:text-md flex pt-2 lg:pt-12">` + `Add to Favorites` + `</div>` +
                        `</div>` +
                    `</div>` +
                    `<div class="hidden lg:flex px-4 py-2 lg:px-8 lg:py-4">` +
                        `<div class="text-lg unit_retail">` + 'Cost: $' + items[i].unit_retail + `</div>` +
                    `</div>` +
                `</div>`
            ;
        }
        var container = document.getElementById("container");
        container.innerHTML = htmlElements;
        }



    return (<>
        <div className="flex justify-center text-md lg:text-xl py-1">
            Browse Page
        </div>
        <div className="flex max-w-full sm:px-8 lg:px-20">
            <div className="hidden lg:block flex-1 w-1/5 rounded-lg border /*bg-gray-100*/ mr-2 h-auto">
                <div className="flex justify-center text-xl pt-4">
                    Settings
                </div>
                <div className="flex-wrap text-lg px-8 py-4 block-inline">
                    <div className="flex flex-wrap text-lg block">
                        Sort by: 
                    </div>
                    <div className="flex-wrap text-md px-4">
                        <div>
                            Price
                        </div>
                        <div>
                            Ratings
                        </div> 
                        <div>
                            Brand
                        </div>
                        <div>
                            Type
                        </div>
                    </div>                  
                </div>
            </div>
            <div className="w-full lg:w-4/5">
                <div>{load ? loopfetching() : null}  </div>
                <div id="container" /*className="bg-orange-100"*/> </div>
            </div>
        </div>
        </>);
}