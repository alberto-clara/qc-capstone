import React, { useState, useEffect } from 'react';
import { ModalProvider } from "react-modal-hook";
import Collapsible from 'react-collapsible';
import { searchbar } from '../components/Home';
import { useParams, Link } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import axios from 'axios';
import { ModalInProductPage } from './ModalVendor';
import kitty1 from '../images/cute-kitty-1.jpg';
import kitty2 from '../images/kitty_sleep-compressor.jpg';
import { VendorProvider } from './VendorsContext'

export  const Product = (props) => {
    let { id } = useParams();
    const [productName, setProductName] = useState('');
    const [unitcost, setUnitCost] = useState('');
    const [description, setDescription] = useState('');
    const [count, setCount] = useState(1);
    const [vendor, setVender] = useState('');
    const [totalVendor, setTotalVendor] = useState(0);
    const VendorValue = [];
    const [VendorArray, setVendorArray] = useState([]);
    const [load, setLoad] = useState(false);
    useEffect(() => {
        document.title = `Home Depot - Product`;
        fetching(id);   
    },[]);

    const fetching = async (ProductID) => {

        await axios.get("http://localhost:7000/catalog-api/products/offerings/" + ProductID).then((res) => {

            setProductName(res.data[0].product_name);
            setUnitCost(res.data[0].unit_retail);
            setVender(res.data[0].supplier_name);
            setDescription(res.data[0].long_description);
            for (var i = 0; i < res.data.length; i++) {
                VendorValue.push({ supplier: res.data[i].supplier_name, unit_cost: res.data[i].unit_cost, unit_retail: res.data[i].unit_retail })
            }
            setTotalVendor(res.data.length);
            setVendorArray(VendorValue);
            setLoad(!load);
        })
      
    }

    var x;
    const helloLoop = (totalVendor) => {
        var htmlElements = "";
        var loopElements = '';
        var colorchange = '';
        for (var i = 0; i < totalVendor; i++) {
            (i % 2 == 0) ? colorchange = 'bg-gray-300' : colorchange = 'bg-white';
            loopElements += `
            <tr>`+
                `<td class="p-2 border-2 border-orange-500 text-center ` + colorchange + `">` + VendorArray[i].supplier +
                `</td>` +
                `<td class="p-2 border-2 border-orange-500 text-right ` + colorchange + `">` + VendorArray[i].unit_cost +
                `</td>` +
                `<td class="p-2 border-2 border-orange-500 text-right ` + colorchange + `">` + VendorArray[i].unit_retail +
                `</td>` +
                `</tr>`
        }
        htmlElements += `      
                <table class="table-auto">`+
            `<thead>` +
            `<tr>` +
            `<th class="p-4 border-r-2 border-l-2 border-orange-500 underline text-xl">` + "Vendor" + `</th>` +
            `<th class="p-4 border-r-2 border-orange-500 underline text-xl">` + "Unit Cost" + `</th>` +
            `<th class="p-4 border-r-2 border-orange-500 underline text-xl">` + "Unit Retail" + `</th>` +
            `</tr>` +
            `<thead>` +
            `<tbody>` +
            loopElements +
            `</tbody>` +
            `</table>`
            ;
        document.getElementById("container").innerHTML = htmlElements;
        return (htmlElements);
        setLoad(false);
    }
    const page_title = (
        <div className="mt-4 justify-center w-full h-auto md:h-auto">
            <div className=" titlePage py-2 lg:text-3xl"> Product View </div>
    
        </div>
    );     


    const counters = (
        <div className="justify-center m-20 rounded h-11 border-2 border-orange-500">
            <div className="flex font-semibold hover:text-black focus:text-black text-gray-700" >
                <button onClick={() => { 
                    setCount(count - 1); 
                    if (count === 1) { setCount(1) } 
                    }} className=" flex justify-center rounded text-gray-600 hover:text-gray-700 hover:bg-orange-400 h-full w-1/3 border-r-2 border-orange-500">
                    <div className="mx-20 flex items-center text-2xl h-10">-</div>
                </button>

                <div type="number" className="h-10 font-semibold flex justify-center text-gray-700 w-1/3 items-center text-2xl" >
                    {count}
                </div>

                <button onClick={() => setCount(count + 1)} className="flex justify-center rounded text-gray-700 hover:text-gray-700 hover:bg-orange-400 h-full text-right w-1/3 border-l-2 border-orange-500">
                    <div className="flex items-center text-2xl h-10">+</div>
                </button>
            </div> 
        </div>
    );

    const side_pic = (
        
        <div>
            <div className="justify-center flex px-5 lg:px-0">
                <Carousel axis="horizontal" showThumbs={true} showArrows={true} >
                    <img src={kitty1} alt="kitty1"/>
                    <img src={kitty2} alt="kitty2"/>
                    {/* <img src="http://lorempixel.com/output/cats-q-c-640-480-1.jpg" />
                    <img src="http://lorempixel.com/output/cats-q-c-640-480-3.jpg" /> */}
                </Carousel>
            </div>  
         
        </div>
        );

    const prodc_name = (   
        <div className="mx-20 flex">
            <div className="text-2xl font-bold"> {productName}</div>
        </div>
    );

    const rate = (
        <div className="mx-20 block">
        <div className="flex">
            <div className="pr-2">Rating</div>
            <div >&#9733;&#9733;&#9733;&#9733;&#9733;</div>
        </div>
    </div>
    )

    const vendor_name = (
        <div className="mx-20 block">
            <div className="flex pr-2 font-bold text-lg">{vendor}</div>
            <div className="flex">
            <Link to={'/vendors/' + id}> <div className="underline justify-center text-sm">Other Vendors</div></Link>
        </div>
        </div>
    )
    const xxx = () => {
        var x;
      //  { load ? x = document.getElementById('container').cloneNode(true) : null}
    
        return (<> {x}</>)
    }
    return (
        <div>
            {xxx}
            {searchbar}
            {load ? helloLoop(totalVendor) : null}
            <VendorProvider value={load ? helloLoop(totalVendor) : null}>
                <ModalProvider>
                    <ModalInProductPage />
                </ModalProvider>
            </VendorProvider>
            <div id="container"></div>
            {load?page_title:null}
        <div className="sm:mx-16 md:mx-24 lg:mx-56 xl:mx-70">
                <div className=" lg:flex pt-10">
                        <div className="xl:w-1/2">
                            {side_pic}  
                        </div>
                        <div className="lg:w-1/2">
                            <div className="flex">{prodc_name}</div>
                            <div className="flex">
                                <div className="w-2/3"> 
                                {rate}
                                <div className="flex pt-2">{vendor_name}</div>
                                </div>
                                <div className="flex justify-center items-center w-1/3 text-3xl font-extrabold pr-16 sm:pr-24"> ${unitcost}</div>
                            </div>
                        
                            <div className="flex">
                                <div className="w-1/2 justify-center">
                                    {counters}
                                </div>
                                <div className="flex justify-center w-1/2 lg:w-3/5">
                                    <button className="flex justify-center m-20 rounded hover:bg-orange-400 border-2 border-orange-500 px-5 font-bold">Add to Cart</button>
                                </div>
                            </div>
                    </div>
                </div>
            

        
        
                {/* specifications */}
                <div className="flex px-5 lg:px-0">
                    <div className="rounded w-full border-2 border-orange-500 bg-white text-lg" >
                        <Collapsible className="h-10 text-lg pt-2 pl-5" trigger="Specifications">
                            <div className="border-t-2 border-orange-500 text-lg"> {description} </div>
                        </Collapsible>
                    </div>
                </div>

                {/* Reviews */}
                <div className="flex px-5 lg:px-0">
                    <div className="rounded w-full border-2 border-orange-500 bg-white text-lg" >
                        <Collapsible className="h-10 text-lg pt-2 pl-5" trigger="Reviews">
                            <div className="border-t-2 border-orange-500 text-lg"> {description} </div>
                        </Collapsible>
                    </div>
                </div>

                {/* QA */}
                <div className="flex px-5 lg:px-0">
                    <div className="rounded w-full border-2 border-orange-500 bg-white text-lg" >
                        <Collapsible className="h-10 text-lg pt-2 pl-5" trigger="Questions & Answers">
                            <div className="border-t-2 border-orange-500 text-lg"> {description} </div>
                        </Collapsible>
                    </div>
                </div>
            </div>
        </div>
    )
}
