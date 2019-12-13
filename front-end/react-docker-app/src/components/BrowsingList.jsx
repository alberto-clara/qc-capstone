import React, { useState, useEffect } from 'react';
import '../css/mainTailwind.css';
import axios from 'axios';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import { Pagination } from "semantic-ui-react";
import 'semantic-ui-css/semantic.min.css';
/* eslint no-useless-concat: 0 */

export const BrowsingList = (props) => {
    var initValue = [];
    var rest = [];
    //var limit = 0;
    const [items, setItems] = useState([]);
    const [restItem, setRestItem] = useState([])
    const [totalRest, setTotalRest] = useState(0);
    const [load, setLoad] = useState(false);
    const [pageNumber, setpageNumber] = useState(10);
    const [pageLocation, setPageLocation] = useState(0);
    const [totalItem, setTotalItem] = useState(0);
    const [countPage, setCountPage] = useState(0);
    const [fetchsort, setFetchSort] = useState('');
    const [activePage, setActivePage] = useState(1);
    const [restload, setRestLoad] = useState(false);
    
    useEffect(() => {
        document.title = `Home Depot - Browsing`;
       
        if (fetchsort === '')
            fetching(pageNumber, pageLocation);
        else {
            sortFetching(pageNumber, pageLocation,fetchsort);
        }
        setLoad(false);
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [load]);

    const fetching = async (number, location) => {
        await axios.get("http://localhost:7000/catalog-api/products/page?").then((res) => {
            setTotalItem(res.data.count);
           //limit = (res.data.count / pageNumber) - 1;
        })
        await axios.get("http://localhost:7000/catalog-api/products/page?pageSize=" + number + "&pageIndex=" + (location-1)).then((res) => {
            for (var i = 0; i < number; i++) {
                initValue.push({ id: res.data.data[i].id, product_name: res.data.data[i].product_name, unit_retail: res.data.data[i].unit_retail });
            }
            setItems(initValue)
            setLoad(true);
        }
        ).catch(async function (e) {
            
            var startingRest = (number * (countPage - 1));
        //    console.log(startingRest);
       //     console.log(totalItem);
            await axios.get("http://localhost:7000/catalog-api/products/page?pageSize=" + totalItem + "&pageIndex=" + 0).then((res) => {
                for (var i = startingRest; i < totalItem; i++) {
                    rest.push({ id: res.data.data[i].id, product_name: res.data.data[i].product_name, unit_retail: res.data.data[i].unit_retail });
                }
                setRestItem(rest);
                setTotalRest(totalItem - startingRest);
        //        console.log("rest");             
        //        console.log(rest);
                setRestLoad(true);
                setLoad(true);
            });

        }
        )
    }

    const sortFetching = async (number, location, sortPrice) => {
        await axios.get("http://localhost:7000/catalog-api/products/page/" + sortPrice + "?pageSize=" + number + "&pageIndex=" + (location - 1)).then((res) => {
            console.log(res.data);
            for (var i = 0; i < number; i++) {
                initValue.push({ id: res.data.data[i].id, product_name: res.data.data[i].product_name, unit_retail: res.data.data[i].unit_retail });
            }
            setItems(initValue)
            setLoad(true);
        }).catch(async function (e) {
            var startingRest = (number * (countPage - 1));
            await axios.get("http://localhost:7000/catalog-api/products/page/" + sortPrice + "?pageSize=" + totalItem + "&pageIndex=" + 0).then((res) => {
                for (var i = startingRest; i < totalItem; i++) {
                    rest.push({ id: res.data.data[i].id, product_name: res.data.data[i].product_name, unit_retail: res.data.data[i].unit_retail });
                }
                setRestItem(rest);
                setTotalRest(totalItem - startingRest);
                setRestLoad(true);
                setLoad(true);
            })
        })
    }
    const options = [5, 10, 15, 20, 25];
    const isInt = (n) => { return parseInt(n) === n  };
    const loopfetching = async (number, location) => {
        var htmlElements = '';
        console.log(number);
        console.log(location);
        var stepup = Math.round(totalItem / pageNumber)
        setCountPage(stepup);
        if (!isInt(totalItem / pageNumber) && restload) {
            for (var i = 0; i < totalRest; i++) {
                console.log("rest");
                htmlElements += `
             <div class="flex rounded-lg border /*bg-green-100*/ mb-2 lg:mb-6">` +
                    `<div class="justify-start content-center>` +
                    `<a target="_blank"><img src="https://images.homedepot-static.com/productImages/8a89c543-1c72-4e6e-972f-0e5babb15a10/svn/husky-claw-hammers-n-s20shd-hn-64_400_compressed.jpg" width="150" height="112" alt="Hammer"/></a>` +
                    `</div>` +
                    `<div class="inline-block flex-1 px-4 py-1 lg:px-8 lg:py-1 ">` +
                    `<a class="text-black text-sm lg:text-xl hover:bg-gray-200" href="product/` + restItem[i].id + `">` + restItem[i].product_name + `</a>` +
                    `<div class="text-xs lg:text-lg pb-4 lg:hidden unit_retail">` + 'Cost: $' + restItem[i].unit_retail + `</div>` +

                    `<div class="text-xs lg:text-md flex-wrap">` + `Delivers Today.` + `</div>` +
                    `<div class="flex content-end">` +
                    `<div class="text-xs lg:text-md flex pt-12 lg:pt-24 hover:text-blue-600">` + `Add to Favorites` + `</div>` +
                    `</div>` +
                    `</div>` +
                    `<div class="hidden lg:flex px-4 py-2 lg:px-8 lg:py-4">` +
                    `<div class="text-lg unit_retail">` + 'Cost: $' + restItem[i].unit_retail + `</div>` +
                    `</div>` +
                    `</div>`
                    ;
            }
            setRestLoad(false);
        }
        else {
            for (i = 0; i < number; i++) {
                htmlElements += `
             <div class="flex rounded-lg border /*bg-green-100*/ mb-2 lg:mb-6">` +
                    `<div class="justify-start content-center>` +
                    `<a target="_blank"><img src="https://images.homedepot-static.com/productImages/8a89c543-1c72-4e6e-972f-0e5babb15a10/svn/husky-claw-hammers-n-s20shd-hn-64_400_compressed.jpg" width="150" height="112" alt="Hammer"/></a>` +
                    `</div>` +
                    `<div class="inline-block flex-1 px-4 py-1 lg:px-8 lg:py-1 ">` +
                    `<a class="text-black text-sm lg:text-xl hover:bg-gray-200" href="product/` + items[i].id + `">` + items[i].product_name + `</a>` +
                    `<div class="text-xs lg:text-lg pb-4 lg:hidden unit_retail">` + 'Cost: $' + items[i].unit_retail + `</div>` +

                    `<div class="text-xs lg:text-md flex-wrap">` + `Delivers Today.` + `</div>` +
                    `<div class="flex content-end">` +
                    `<div class="text-xs lg:text-md flex pt-12 lg:pt-24 hover:text-blue-600">` + `Add to Favorites` + `</div>` +
                    `</div>` +
                    `</div>` +
                    `<div class="hidden lg:flex px-4 py-2 lg:px-8 lg:py-4">` +
                    `<div class="text-lg unit_retail">` + 'Cost: $' + items[i].unit_retail + `</div>` +
                    `</div>` +
                    `</div>`
                    ;
            }
        }
        var container = document.getElementById("container");
         container.innerHTML = htmlElements;
        await setLoad(false);
    }
    const changeSize = (e) => {
        setActivePage(1);
        setPageLocation(1);
        setpageNumber(e.value);
    }
    const changePage = (e) => {
        setPageLocation(e);
        setActivePage(e);
        window.scrollBy(0, -10000)
    }

    return (<>
        <div className="mt-4 justify-center w-full h-auto md:h-auto">
            <div className=" titlePage pt-2 pb-4 lg:text-3xl"> Browsing View </div>
        </div>
        <div className="lg:flex max-w-full">
            <div className="block lg:w-1/5 rounded-lg border /*bg-gray-100*/ lg:mr-2 h-auto">
                <div className="flex justify-center">
                    <button className="filterbutton lg:hidden lg:text-black font-bold text-lg py-4">
                        Filters &#9660;
                    </button>
                    <div className="filterbutton hidden lg:flex text-blue-600 lg:text-black font-bold text-2xl pt-4 pl-4">
                        Filters
                    </div>
                </div>
                <div id="filter" className="lg:block flex-no-wrap text-lg py-4">
                    <div className="flex flex-wrap lg:pt-2 px-8 font-bold justify-center lg:justify-start">
                        Sort by:
                    </div>
                    <div className="flex flex-no-wrap justify-center lg:justify-start">
                        <div className="flex flex-wrap justify-center lg:justify-start">
                            <button onClick={() => { setFetchSort('ascending'); changePage(1);}} className="my-2 py-2 lg:my-0 lg:py-0 hover:text-blue-600 hover active:font-bold active:bg-orange-500 w-48 border border-orange-500 lg:border-none rounded"> Lowest Cost</button>
                            <button onClick={() => { setFetchSort('descending'); changePage(1); }} className="my-2 py-2 lg:my-0 lg:py-0 hover:text-blue-600 w-48 active:bg-orange-500 border border-orange-500 lg:border-none rounded">Highest Cost</button>
                            <button onClick={() => { setFetchSort('reverse'); changePage(1); }} className="my-2 py-2 lg:my-0 lg:py-0 hover:text-blue-600 w-48 active:bg-orange-500 border border-orange-500 lg:border-none rounded">Reverse </button>
                            <button onClick={() => { setFetchSort(''); changePage(1); }} className="my-2 py-2 lg:my-0 lg:py-0 hover:text-blue-600 w-48 active:bg-orange-500 border border-orange-500 lg:border-none rounded">Alphabetical</button> 
                          
                        </div>
                    </div>
                    
                    <div className="lg:block px-8 py-4">
                        <div className="flex justify-center lg:justify-start font-bold">
                            Items Per Page:
                        </div>
                        <div className="flex justify-center lg:justify-start">
                            <Dropdown className="w-1/8" options={options} value={pageNumber.toString()} onChange={e => changeSize(e)} />
                        </div>
                    </div>

                </div>
            </div>

            <div className="w-full lg:w-4/5">
                <div>{load ? loopfetching(pageNumber, pageLocation)  : null}  </div>
                <div id="container" /*className="bg-orange-100"*/> </div>
            </div>
        </div>
        
        <div className=" flex justify-center px-8 lg:px-20">
            <div className="hidden lg:flex justify-center text-center ">
                <Pagination onPageChange={(e, data) => changePage(data.activePage)}  boundaryRange={1}
                    totalPages={countPage}
                    activePage={activePage} />
            </div>
            <div className="flex-1 cursor-pointer lg:hidden text-center">
                <Pagination onPageChange={(e, data) => changePage(data.activePage)} 
                    ellipsisItem={null}
                    boundaryRange={0}
                    activePage={activePage}
                    firstItem={null}
                    lastItem={null}
                    siblingRange={1}
                    totalPages={countPage} />
            </div>
        </div>

    </>);
}
// Navbar Toggle
document.addEventListener('DOMContentLoaded', function () {
    var $filterbutton = Array.prototype.slice.call(document.querySelectorAll('.filterbutton'), 0); // Get all "navbar-burger" elements
    if ($filterbutton.length > 0) { // Check if there are any navbar burgers
        var $target = document.getElementById('filter') // Get the "filter" element
        $target.classList.toggle('hidden');
        // Add a click event on each of them // Toggle the className on "filter"
        $filterbutton.forEach(function ($el) {$el.addEventListener('click', function(){$target.classList.toggle('hidden');});});
    }
});