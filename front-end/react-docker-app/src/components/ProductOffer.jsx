import React, { useState, useEffect } from 'react';
import { Collapse } from 'react-collapse';
import { searchbar } from '../components/Home';
import { useParams, Link } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import axios from 'axios';
import pic1 from '../home_images/image1.jpg';
import pic2 from '../home_images/image2.jpg';
import FireBaseSetup from '../FireBaseSetup';
import { GetDiscOffer, PostProduct, TokenHeader, loader } from '../ListOfLinks';


export  const ProductOffer = (props) => {
    let { offerid } = useParams();
    const [/*UserUID*/, setUserUID] = useState("");
    const [offeringKey, setOfferingKey] = useState('');
    const [productKey, setProductKey] = useState('');
    const [productName, setProductName] = useState('');
    const [supplierKey, setSupplierKey] = useState('');
    const [vendor, setVender] = useState('');
    const [unitRetail, setunitRetail] = useState('');
    const [unitofmeasure, setUnitofMeasure] = useState('');
    const [uom, setUOM] = useState('');
    const [discountType, setDiscountType] = useState('');
    const [discountPrice, setDiscountPrice] = useState('');
    const [discountPercent, setDiscountPercent] = useState('');
    const [userToken, setUserToken] = useState("");
    const [description, setDescription] = useState('');
    const [count, setCount] = useState(1);
    const [/*totalVendor*/, setTotalVendor] = useState(0);
    const [load, setLoad] = useState(false);
    const [isOpenS, setIsOpenS] = useState(false);
    const [isOpenR, setIsOpenR] = useState(false);
    const [isOpenF, setIsOpenF] = useState(false);

    useEffect(() => {
        document.title = `Home Depot - Product`;
        FireBaseSetup.isInitialized().then(user => {
            if (user) {
                user.getIdToken().then(function (idToken) {
                    setUserToken(idToken);
                });
                setUserUID(user.uid);
            }
        });
        fetching(offerid); 
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    const fetching = async (offerID) => {
        // you can change this to GetProduct and it will stop using the routes for discounts
        await axios.get(GetDiscOffer(offerID)).then((res) => {
            setOfferingKey(res.data.offering_key);
            setProductKey(res.data.product_key);
            setProductName(res.data.product_name);
            setSupplierKey(res.data.supplier_key);
            setVender(res.data.supplier_name);
            setunitRetail(res.data.unit_retail);
            setUOM(res.data.uom);
            setUnitofMeasure(res.data.unit_cost)
            setDiscountType(res.data.type);
            setDiscountPrice(res.data.discount_price);
            setDiscountPercent(res.data.discount_percentage);
            setDescription(res.data.long_description);
            setTotalVendor(res.data.length);
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
            <div className="justify-center flex px-5 lg:px-0">
                <Carousel axis="horizontal" showThumbs={true} showArrows={true} >
                    <img className="" src={pic1} alt="pic1"/>
                    <img src={pic2} alt="pic2"/>
                </Carousel>
            </div>  

        );

    const prodc_name = (   
        <div className="mx-20 flex">
            <div className="text-2xl font-bold"> {productName}</div>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 70">
          <circle cx="82.5" cy="62.5" r="7.5" />
          <rect x="30" y="45" width="60" height="5" />
          <circle cx="37.5" cy="62.5" r="7.5" />
          <rect width="15" height="5" />
          <polygon points="35 50 30 50 10 0 15 0 35 50" />
        </svg>
        </div>
    );

    const rate_and_uom = (
        <div className="mx-20 block">
            <div className="flex">
                <div className="pr-2">Rating</div>
                <div >&#9733;&#9733;&#9733;&#9733;&#9733;</div>
            </div>
            <div className="flex pr-2">Unit of Measure: {uom}</div>
        </div>
    );
    const AddCartButton = async () => {
        
        var items = [{
            offering_key: offeringKey,
            product_key: productKey,
            product_name: productName,
            supplier_key: supplierKey,
            supplier_name: vendor,
            unit_retail: discountPrice? discountPrice :unitRetail,
            unit_cost: unitofmeasure,
            uom: uom,
            quantity: count
        }];
        await axios.post(PostProduct, {
            uid: null,
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

    const discount_component = (
        <div className="mx-20 block">
            <div className="flex pr-2">Discount Type: {discountType}</div>
        </div>
    );

    const DisCountComponent = (
        <div className= "block">
            <div className="flex justify-center text-gray-400 font-bold line-through items-center w-full mt-8 md:mt-12 text-xl md:text-3xl font-extrabold text-right"> ${unitRetail}</div>
            <div className="flex pt-2 justify-center items-center w-full text-xl ml-0 md:w-full md:text-3xl font-extrabold "> ${discountPrice}</div>
            <div className="flex pt-2 justify-center items-center w-full text-xl ml-0 md:w-full md:text-3xl text-red-500 font-bold ">{discountPercent}% OFF</div>
        </div>
    );
    const NormalComponent = (<div className="flex justify-center items-center w-1/3 text-3xl font-extrabold mt-8 md:ml-12 md:mt-12"> ${unitRetail}</div>);

    const containAll = (<div>
        {searchbar}
        <div id="container" className="hidden "></div>
        {page_title}    
        <div className="w-full">
            <div className=" lg:flex pt-10 ">
                <div className=" w-full lg:w-1/2">
                    {side_pic}
                </div>
                <div className="">
                    <div className="flex">{prodc_name}</div>
                    <div className="flex">
                        <div className="w-2/3">
                            {rate_and_uom}
                            <div>{discountType ? discount_component : ''}</div>
                            <div className="flex pt-2">{vendor_name} </div>
                        </div>
                        <div className="w-1/2 ">{ discountPrice ? DisCountComponent  : NormalComponent}</div>
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
            <div className="rounded border-2 border-orange-500 bg-white text-sm w-full">
                <div className="cursor-pointer">
                    <div onClick={() => setIsOpenS(!isOpenS)} className="ml-2 pt-2 text-md md:text-lg " >Specifications</div>
                </div>
                <Collapse className="" isOpened={!isOpenS}>  
                <hr/>
                    <div className="p-2"> {description} </div>
                </Collapse >
            </div>
      
            {/* Reviews */}
            <div className="rounded border-2 border-orange-500 bg-white text-sm w-full">
                <div className="cursor-pointer">
                    <div onClick={() => setIsOpenR(!isOpenR)} className="ml-2 pt-2 text-md md:text-lg " >Reviews</div>
                </div>
                <Collapse className="" isOpened={!isOpenR}>  
                <hr/>
                    <div className="p-2"> {description} </div>
                </Collapse >
            </div>

            {/* QA */}
            <div className="rounded border-2 border-orange-500 bg-white text-sm w-full mb-4">
                <div className="cursor-pointer">
                    <div onClick={() => setIsOpenF(!isOpenF)} className="ml-2 pt-2 text-md md:text-lg " >FAQ</div>
                </div>
                <Collapse className="" isOpened={!isOpenF}>  
                <hr/>
                    <div className="p-2"> {description} </div>
                </Collapse >
            </div>
        </div>
    </div>)
    return (
        <> {load ? containAll : loader}</>
    )
}
