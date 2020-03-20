import React, { useState, useEffect } from 'react';
import { Collapse } from 'react-collapse';
import { searchbar } from '../components/Home';
import { useParams, Link } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import axios from 'axios';
import kitty1 from '../images/cute-kitty-1.jpg';
import kitty2 from '../images/kitty_sleep-compressor.jpg';
import FireBaseSetup from '../FireBaseSetup';
import { GetProduct, PostProduct, TokenHeader } from '../ListOfLinks';


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
    const [isOpenR, setIsOpenR] = useState(true);
    const [isOpenS, setIsOpenS] = useState(true);
    const [isOpenQ, setIsOpenQ] = useState(true);
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
        });
        fetching(offerid); 
    },[]);

    const fetching = async (offerID) => {
        await axios.get(GetProduct(offerID)).then((res) => {
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
        await axios.post(PostProduct, {
            uid: null,
//            date: Date(),
            total_items: 0,
            offerings: items
        }, TokenHeader(userToken));    
        window.location.href = '/offering/' + offerid;
    }

    const vendor_name = (
        <div className="mx-20 block">
            <div onClick={() => window.location.assign("/supplier/" + supplierKey)} className="flex pr-2 font-bold text-lg cursor-pointer hover:bg-gray-300">{vendor}</div>
            <div className="flex ">
                <Link to={'/vendors/' + productKey}> <div className="underline justify-center text-sm">Other Vendors</div></Link>
            </div>
   
        </div>
    );

    const containAll = (<div>
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
                            <div className="flex pt-2">{vendor_name} </div>
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
                <div onClick={() => setIsOpenS(!isOpenS)} className="rounded w-full border-2 border-r-2 border-orange-500 bg-white text-lg p-2 bold cursor-pointer" >
                    Specification
                </div>
                <div className=" w-full pt-1">
                    <Collapse isOpened={isOpenS}>
                        <div className="p-2 border-r-2 border-orange-500 border-2"> {description} </div>
                    </Collapse>
                </div>
            </div>
      
            {/* Reviews */}
            <div className=" px-5 lg:px-0 pt-2">
                <div onClick={() => setIsOpenR(!isOpenR)} className="rounded w-full border-2 border-r-2 border-orange-500 bg-white text-lg p-2 bold cursor-pointer" >
                    Review
                    </div>
                <div className=" w-full pt-1">
                    <Collapse isOpened={isOpenR}>
                        <div className="p-2 border-r-2 border-orange-500 border-2"> {description} </div>
                    </Collapse>
                </div>
            </div>

            {/* QA */}
            <div className=" px-5 lg:px-0 pt-2 pb-4">
                <div onClick={() => setIsOpenQ(!isOpenQ)} className="rounded w-full border-2 border-r-2 border-orange-500 bg-white text-lg p-2 bold cursor-pointer" >
                    Q/A
                    </div>
                <div className=" w-full pt-1">
                    <Collapse isOpened={isOpenQ}>
                        <div className="p-2 border-r-2 border-orange-500 border-2"> {description} </div>
                    </Collapse>
                </div>
            </div>
        </div>
    </div>)
    return (
        <> {containAll}</>
    )
}
