import React, { useState, useEffect } from 'react';
import '../css/mainTailwind.css';
import axios from 'axios';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
export const BrowsingList = (props) => {
    var initValue = [];
    var limit = 0;
    const [items, setItems] = useState([]);
    const [load, setLoad] = useState(false);
    const [pageNumber, setpageNumber] = useState(10);
    const [pageLocation, setPageLocation] = useState(0);
    const [totalPage, setTotalPage] = useState(0);
    const [pagination, setPagination] = useState([]);

    useEffect(() => {
        document.title = `Home Depot - Browsing`;
        totalfetch();
        fetching(pageNumber, pageLocation);

        setLoad(false);

    }, [load]);
    const totalfetch = async () => {
        await axios.get("http://localhost:7000/catalog-api/products/page?").then((res) => {

            setTotalPage(res.data.count);
            limit = (res.data.count / pageNumber) - 1;
            setLoad(false);
        })
    }

    const paginationNumber = (pageNumber, totalPage) => {
        var arrayPage = [];
        var totalPage = totalPage / pageNumber;
        if (totalPage !== 0) { totalPage++ }
        console.log('totalPage' + totalPage)
        for (var i = 0; i < totalPage; i++) {
            arrayPage.push(i);
        }
    }


    const fetching = async (number, location) => {

        await axios.get("http://localhost:7000/catalog-api/products/page?pageSize=" + number + "&pageIndex=" + location).then((res) => {
            for (var i = 0; i < number; i++) {
                initValue.push({ id: res.data.data[i].id, product_name: res.data.data[i].product_name, unit_retail: res.data.data[i].unit_retail });
            }
            setItems(initValue)
            setLoad(true);
        }
        ).catch(async function (e) {
            console.log("fetching limit");
            console.log(number);
            console.log(limit);
            console.log(e.message);
            await axios.get("http://localhost:7000/catalog-api/products/page?pageSize=" + number + "&pageIndex=" + limit).then((res) => {
                for (var i = 0; i < number; i++) {
                    initValue.push({ id: res.data.data[i].id, product_name: res.data.data[i].product_name, unit_retail: res.data.data[i].unit_retail });
                }
                setItems(initValue)
                setLoad(true);
            });

        }
        )
    }
    const options = [
        5, 10, 15, 20, 25]
    var options2 = pagination;

    const loopfetching = (number, location) => {
        var htmlElements = '';
        console.log(number);
        console.log(location);
        var stepup = Math.round(totalPage / pageNumber)
        var arrayPage = [];
        for (var o = 0; o < stepup; o++) {
            arrayPage.push(o);
        }
        setPagination(arrayPage);
        //console.log(pagination);
        for (var i = 0; i < number; i++) {
            htmlElements += `
             <div class="flex rounded-lg border /*bg-green-100*/ mb-2 lg:mb-6">` +
                `<div class="justify-start content-center>` +
                `<a target="_blank"><img src="https://images.homedepot-static.com/productImages/8a89c543-1c72-4e6e-972f-0e5babb15a10/svn/husky-claw-hammers-n-s20shd-hn-64_400_compressed.jpg" width="150" height="112" alt="Hammer"/></a>` +
                `</div>` +
                `<div class="inline-block flex-1 px-4 py-1 lg:px-8 lg:py-1">` +
                `<div class="text-sm lg:text-xl product_name">` + items[i].product_name + `</div>` +
                `<div class="text-xs lg:text-lg pb-4 lg:hidden unit_retail">` + 'Cost: $' + items[i].unit_retail + `</div>` +
                // `<div class="text-lg flex-wrap product_id">` + items[i].id + `</div>`+
                `<div class="text-xs lg:text-md flex-wrap">` + `Delivers Today.` + `</div>` +
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
        setLoad(false);
    }
    const changeSize = async (e) => {
        await setpageNumber(e.value);
    }
    const changePage = async (e) => {
        await setPageLocation(e.value);
    }

    return (<>
        <div className="w-56 flex">
            <div className="largeBold w-1/2">Size: </div>
            <Dropdown className=" w-1/3 " options={options} value={pageNumber.toString()} onChange={e => changeSize(e)} />
        </div>
        <div className="w-56 flex">
            <div className="largeBold w-1/2">Location: </div>
            <Dropdown className=" w-1/3 " options={options2} value={(pageLocation).toString()} onChange={e => changePage(e)} />
        </div> 
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
                <div>{load ? loopfetching(pageNumber, pageLocation)  : null}  </div>
                <div id="container" /*className="bg-orange-100"*/> </div>
            </div>
        </div>
    </>);
}
