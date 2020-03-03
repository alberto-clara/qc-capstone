import React, { useState, useEffect } from 'react';
import { Markup } from 'interweave';
import { ModalProvider } from "react-modal-hook";
import { Collapse } from 'react-collapse';
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
import FireBaseSetup from '../FireBaseSetup';
import display_image from './PicArray';
/* eslint no-useless-concat: 0 */

export  const ProductOffer = (props) => {
    let { offerid } = useParams();
    const [UserUID, setUserUID] = useState("");
    const [offeringKey, setOfferingKey] = useState('');
    const [productKey, setProductKey] = useState('');
    const [productName, setProductName] = useState('');
    const [supplierKey, setSupplierKey] = useState('');
    const [vendor, setVender] = useState('');
    const [unitcost, setUnitCost] = useState('');
    const [uom, setUOM] = useState('');
    
    const [userToken, setUserToken] = useState("");

    const [description, setDescription] = useState('');
    const [count, setCount] = useState(1);

    const [totalVendor, setTotalVendor] = useState(0);
    const VendorValue = [];
    const [VendorArray, setVendorArray] = useState([]);
    const [load, setLoad] = useState(false);
    const [isOpenR, setIsOpenR] = useState(false);
    const [isOpenS, setIsOpenS] = useState(false);
    const [isOpenQ, setIsOpenQ] = useState(false);
    useEffect(() => {
        document.title = `Home Depot - Product`;
        FireBaseSetup.isInitialized().then(user => {
            if (user) {
                user.getIdToken().then(function (idToken) {
                    //console.log(idToken);
                    setUserToken(idToken);
                });
                setUserUID(user.uid);
            }
            console.log(offerid);
        });

        fetching(offerid); 

    },[]);

    const fetching = async (offerID) => {

        await axios.get("http://localhost:7000/catalog-api/products/offerings/single/" + offerID).then((res) => {
            console.log(res.data);
            setOfferingKey(res.data[0].offering_key);
            setProductKey(res.data[0].product_key);
            setProductName(res.data[0].product_name);
            setSupplierKey(res.data[0].supplier_key);
            setVender(res.data[0].supplier_name);
            setUnitCost(res.data[0].unit_retail);
            setUOM(res.data[0].uom);
            
            setDescription(res.data[0].long_description);
            for (var i = 0; i < res.data.length; i++) {
                VendorValue.push({ supplier: res.data[i].supplier_name, unit_cost: res.data[i].unit_cost, unit_retail: res.data[i].unit_retail })
            }
            setTotalVendor(res.data.length);
            setVendorArray(VendorValue);
            setLoad(!load);
        })
      
    }
    
    const helloLoop = (totalVendor) => {
        var htmlElements = "";
        var loopElements = '';
        var colorchange = '';
        for (var i = 0; i < totalVendor; i++) {
            (i % 2 === 0) ? colorchange = 'bg-gray-300' : colorchange = 'bg-white';
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
            `<th class="p-4 border-r-2  border-t-2 border-l-2 border-orange-500 underline text-xl">` + "Vendor" + `</th>` +
            `<th class="p-4 border-r-2 border-t-2 border-orange-500 underline text-xl">` + "Unit Cost" + `</th>` +
            `<th class="p-4 border-r-2  border-t-2 border-orange-500 underline text-xl">` + "Unit Retail" + `</th>` +
            `</tr>` +
            `<thead>` +
            `<tbody>` +
            loopElements +
            `</tbody>` +
            `</table>`
            ;
        document.getElementById("container").innerHTML = htmlElements;
        return (htmlElements);
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
                    {/* {display_image()} */}
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
    );
    const AddCartButton = async () => {

        //console.log(UserUID, offeringKey, productKey, productName, supplierKey, vendor, unitcost, uom, quantity, Date());
        var items = [{

            offering_key: offeringKey,
            product_key: productKey,
            product_name: productName,
            supplier_key: supplierKey,
            supplier_name: vendor,
            unit_retail: unitcost,
            uom: uom,
            quantity: count
        }];
        //console.log(items);
        const myHeader = {
            headers: {
                'Authorization': 'Bearer '.concat(userToken)
            }
        }
   
       await axios.post('http://localhost:7000/basket-api/basket/add', {
          
            uid: null,
            date: Date(),
            total_items: 0,
            offerings: items
        }, myHeader);
        
     //  window.location.href = '/product/' + id;
    }

/*    const AddCartButton = async () => {
        console.log(productName, unitcost, id, UserUID);
         axios.post('http://localhost:3001/cart', {
            user_id: UserUID,
            product_id: id,
            product_name: productName,
            unit_cost: unitcost
         }).then((res) => {
             console.log("well", res);
            if (res.data !== null) {
                console.log("well",res);
              
            };
        })
        window.location.href = '/product/' + id;
    }*/
    const vendor_name = (
        <div className="mx-20 block">
            <div className="flex pr-2 font-bold text-lg">{vendor}</div>
            <div className="flex ">
                <Link to={'/vendors/' + productKey}> <div className="underline justify-center text-sm">Other Vendors</div></Link>
            </div>
   
        </div>
    );
   
    return (
        <div>
            {searchbar}
            <div id="container" className="hidden "></div>
            {page_title}
        <div className="w-full">
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
                                <div id="quantity" className="w-1/2 justify-center">
                                    {counters}
                                </div>
                                <div className="flex justify-center w-1/2 lg:w-3/5">
                                <button onClick={AddCartButton} className="flex justify-center m-20 rounded hover:bg-orange-400 border-2 border-orange-500 px-5 font-bold">Add to Cart</button>
                                </div>
                            </div>
                    </div>
                </div>


                {/* specifications */}
                <div className=" px-5 lg:px-0">
                    <div onClick={() => setIsOpenS(!isOpenS)} className="rounded w-full border-2 border-r-2 border-orange-500 bg-white text-lg p-2 bold cursor-pointer hover:bg-orange-300" >
                        Specification
                    </div>
                    <div className=" w-full pt-1">
                        <Collapse isOpened={isOpenS}>
                            <div className="p-2 bg-gray-100 border-r-2 border-orange-500 border-2"> {description} </div>
                        </Collapse>
                    </div>
                </div>

                <div className="h-4" />
                {/* Reviews */}
                <div className=" px-5 lg:px-0">
                    <div onClick={() => setIsOpenR(!isOpenR)} className="rounded w-full border-2 border-r-2 border-orange-500 bg-white text-lg p-2 bold cursor-pointer hover:bg-orange-300" >
                        Review
                    </div>
                    <div className=" w-full pt-1">
                        <Collapse isOpened={isOpenR}>
                            <div className="p-2 bg-gray-100 border-r-2 border-orange-500 border-2"> {description} </div>
                        </Collapse>
                    </div>
                </div>

                <div className="h-4" />
                {/* QA */}
                <div className=" px-5 lg:px-0">
                    <div onClick={() => setIsOpenQ(!isOpenQ)} className="rounded w-full border-2 border-r-2 border-orange-500 bg-white text-lg p-2 bold cursor-pointer hover:bg-orange-300" >
                        Q/A
                    </div>
                    <div className=" w-full pt-1">
                        <Collapse isOpened={isOpenQ}>
                            <div className="p-2 bg-gray-100 border-r-2 border-orange-500 border-2"> {description} </div>
                        </Collapse>
                    </div>
                </div>
            </div>
        </div>
    )
}