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
    const totalfetch = async() => {
        await axios.get("http://localhost:7000/catalog-api/products/page?").then((res) => {
          
            setTotalPage(res.data.count);
            limit = (res.data.count / pageNumber) - 1;
            setLoad(false);
        })
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
                )}
    const options = [
        5, 10, 15, 20, 25]
    var options2 = pagination;
    
    const loopfetching = (number,location)=> {
        var htmlElements = '';
        console.log(number);
        console.log(location);
        var stepup = Math.round(totalPage / pageNumber)
        var arrayPage=[];
        for (var o = 0; o < stepup; o++) {
            arrayPage.push(o);
        }
        setPagination(arrayPage);
         for (var i = 0; i < number; i++) {
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
           setLoad(false);
        }
    const changeSize = async (e) => {
        await setpageNumber(e.value);


    }
    const changePage = async (e) => {
       await setPageLocation(e.value);
    }

    return (<>
        Unit1
        <div className="w-56 flex">
            <div className="largeBold w-1/2">Size: </div>
            <Dropdown className=" w-1/3 " options={options} value={pageNumber.toString()} onChange={e => changeSize(e)} />
        </div>   
        <div className="w-56 flex">
            <div className="largeBold w-1/2">Location: </div>
            <Dropdown className=" w-1/3 " options={options2} value={(pageLocation).toString()} onChange={e =>changePage(e)} />
        </div> 
        <div className="flex max-w-full sm:px-8 lg:px-20">
            <div className="hidden lg:block flex-1 w-1/5 border bg-yellow-200 justify-start">
                <div className="flex text-xl justify-center">
                    Settings
                </div>
            </div>
            <div className="w-full lg:w-4/5 justify-end">
                <div>{load ? loopfetching(pageNumber,pageLocation) : null}  </div>
                <div id="container" className="bg-orange-100"> </div>
                </div>
            </div>
        </>);
}