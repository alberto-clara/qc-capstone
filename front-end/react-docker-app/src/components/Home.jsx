import React, { useState,useEffect } from 'react';

//import { autoPlay } from 'react-swipeable-views-utils';
import axios from 'axios';
import SwipeableViews from 'react-swipeable-views';
import { Carousel } from "react-responsive-carousel";
import mountain from '../images/mountain-826114_1280.jpg';
import sky from '../images/wallpapers-wide-1.jpg';
import display_image from './PicArray';
import { GetHomeRandom, loader } from '../ListOfLinks';

export const searchbar = (
    <div className="  mt-4 justify-center flex text-gray-600 w-full">
        <input className=" rounded border-2 border-orange-500 bg-white h-15 px-5 pr-8 text-sm w-full" type="search" name="search" placeholder="Search"></input>
        <button type="submit" className="px-4 py-2 border-2 rounded text-gray-300 border-orange-500 bg-white hover:text-white hover:border-orange-500">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="15"><path className="heroicon-ui " fill="gray" d="M16.32 14.9l5.39 5.4a1 1 0 0 1-1.42 1.4l-5.38-5.38a8 8 0 1 1 1.41-1.41zM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z" /></svg>
        </button>
    </div>);

export const Home = (props) => {
    var initValue = [];
    const [AdItems, setAdItems] = useState([]);
    const [load, setLoad] = useState(false);
    useEffect(() => {
        document.title = `Home Depot - HomePage`;
        
        const tryFetch = async () => {
            await axios.get(GetHomeRandom).then((res) => {
                console.log(res);
                for (var i = 0; i < res.data.length; i++) {
                    initValue.push({ id: res.data[i].offering_key, product_name: res.data[i].product_name, price: res.data[i].unit_retail, discount: res.data[i].discount_price});
                }
                setAdItems(initValue);
               setLoad(true);
            })
        }
        tryFetch();

    }, []);

    const roundDigit = (value) => {
        return (Math.round(value * 100) / 100).toFixed(2) ;
    }
    const carousel_slide = (
        <div className="flex justify-center w-full">
                <div className="justify-center flex">
                    <Carousel axis="horizontal" showThumbs={true} showArrows={true} >
                        <img src={mountain} alt="mountain"/>
                        <img src={sky} alt="sky"/>
                    </Carousel>
            </div>
        </div>
    );
    const linktoItem = (itemId) => {
        window.location.assign("/offering/" + itemId);
    }
    const checkDiscount =(discount,normal) =>{
        var re;
    //    discount===null? re=normal: re=discount;
        if(discount ===null)
            return(<div>${normal}</div>);
        else   
            return (<div className="text-red-500 font-bold">${discount}</div>);

    }
    const swiping = (
     
        <div><SwipeableViews enableMouseEvents>
            <div className="flex w-full  ">
                <div  className=" hover:bg-orange-200 w-1/2 md:w-1/5 ">
                <div> {display_image()} </div>
                <div className="cursor-pointer" onClick={() => linktoItem(AdItems[0].id)}>     
                     <div className="pt-2 md:pt-4 pl-4 md:pt-8 flex">{load === false ? loader : checkDiscount(AdItems[0].discount,AdItems[0].price)}</div> 
                    <div className="md:pt-4 pl-4">{load === false ? null : AdItems[0].product_name}</div>
                </div>
            </div>
                <div className=" hover:bg-orange-200  w-1/2 md:w-1/5 ">
                <div> {display_image()} </div>
                <div className="cursor-pointer" onClick={() => linktoItem(AdItems[1].id)}>
                    <div className="pt-2 md:pt-4 pl-4 md:pt-8 flex">{load === false ? loader : checkDiscount(AdItems[1].discount,AdItems[1].price)}</div> 
                    <div className="md:pt-4 pl-4"> {load === false ? null : AdItems[1].product_name}</div>
                </div>
            </div>
            <div className="hover:bg-orange-200  hidden md:block md:w-1/5 ">
                <div> {display_image()}  </div>
                <div className="cursor-pointer" onClick={() => linktoItem(AdItems[2].id)}>
                    <div className="pt-4 pl-4 md:pt-8 flex">{load === false ? loader : checkDiscount(AdItems[2].discount,AdItems[2].price)}</div> 
                    <div className="md:pt-4 pl-4">{load === false ? null : AdItems[2].product_name} </div>
                </div>
            </div>
            <div className=" hover:bg-orange-200  hidden md:block md:w-1/5 ">
                <div> {display_image()}  </div>
                <div className="cursor-pointer" onClick={() => linktoItem(AdItems[3].id)}>
                    <div className="pt-4 pl-4 md:pt-8 flex">{load === false ? loader : checkDiscount(AdItems[3].discount,AdItems[3].price)}</div> 
                    <div className="md:pt-4 pl-4"> {load === false ? null : AdItems[3].product_name} </div>
                </div>
            </div>
                <div className="hover:bg-orange-200  hidden md:block md:w-1/5 ">
                <div> {display_image()}  </div>
                <div className="cursor-pointer" onClick={() => linktoItem(AdItems[4].id)}>
                    <div className="pt-4 pl-4 md:pt-8 flex">{load === false ? loader : checkDiscount(AdItems[4].discount,AdItems[4].price)}</div> 
                    <div className="md:pt-4 pl-4"> {load === false ? null : AdItems[4].product_name} </div>
                </div>
            </div>
        </div>
        <div className="flex w-full">
                <div className=" hover:bg-orange-200  w-1/2 md:w-1/5 ">

                <div> {display_image()} </div>
                <div className="cursor-pointer" onClick={() => linktoItem(AdItems[5].id)}>
                    <div className="pt-4 pl-4 md:pt-8 flex">{load === false ? loader : checkDiscount(AdItems[5].discount,AdItems[5].price)}</div> 
                    <div className="md:pt-4 pl-4">{load === false ? null : AdItems[5].product_name}</div>
                </div>
            </div>
                <div className="hover:bg-orange-200  w-1/2 md:w-1/5 ">
                <div> {display_image()} </div>
                <div className="cursor-pointer" onClick={() => linktoItem(AdItems[6].id)}>
                    <div className="pt-4 pl-4 md:pt-8 flex">{load === false ? loader : checkDiscount(AdItems[6].discount,AdItems[6].price)}</div> 
                    <div className="md:pt-4 pl-4"> {load === false ? null : AdItems[6].product_name}</div>
                </div>
            </div>
                <div className="hover:bg-orange-200  hidden ti:block md:w-1/5 ">
                <div> {display_image()} </div>
                <div className="cursor-pointer" onClick={() => linktoItem(AdItems[7].id)}>
                    <div className="pt-4 pl-4 md:pt-8 flex">{load === false ? loader : checkDiscount(AdItems[7].discount,AdItems[7].price)}</div> 
                    <div className="md:pt-4 pl-4">{load === false ? null : AdItems[7].product_name} </div>
                </div>
            </div>
                <div className=" hover:bg-orange-200 hidden md:block md:w-1/5 ">
                <div> {display_image()}  </div>
                <div className="cursor-pointer" onClick={() => linktoItem(AdItems[8].id)}>
                    <div className="pt-4 pl-4 md:pt-8 flex">{load === false ? loader : checkDiscount(AdItems[8].discount,AdItems[8].price)}</div> 
                    <div className="md:pt-4 pl-4"> {load === false ? null : AdItems[8].product_name} </div>
                </div>
            </div>
                <div className="  hover:bg-orange-200  hidden md:block md:w-1/5 ">
                <div> {display_image()} </div>
                <div className="cursor-pointer" onClick={() => linktoItem(AdItems[9].id)}>
                    <div className="pt-4 pl-4 md:pt-8 flex">{load === false ? loader : checkDiscount(AdItems[9].discount,AdItems[9].price)}</div> 
                    <div className="md:pt-4 pl-4"> {load === false ? null : AdItems[9].product_name} </div>
                </div>
            </div>
        </div>
        <div className="flex w-full">
                <div className=" hover:bg-orange-200  w-1/2 md:w-1/5 ">
                <div> {display_image()} </div>
                <div className="cursor-pointer" onClick={() => linktoItem(AdItems[10].id)}>
                    <div className="pt-4 pl-4 md:pt-8 flex">{load === false ? loader : checkDiscount(AdItems[10].discount,AdItems[10].price)}</div> 
                    <div className="md:pt-4 pl-4">{load === false ? null : AdItems[10].product_name}</div>
                </div>
            </div>
                <div className=" hover:bg-orange-200  w-1/2 md:w-1/5 ">
                <div> {display_image()} </div>
                <div className="cursor-pointer" onClick={() => linktoItem(AdItems[11].id)}>
                    <div className="pt-4 pl-4 md:pt-8 flex">{load === false ? loader : checkDiscount(AdItems[11].discount,AdItems[11].price)}</div> 
                    <div className="md:pt-4 pl-4"> {load === false ? null : AdItems[11].product_name}</div>
                </div>
            </div>
                <div  className=" hover:bg-orange-200  hidden ti:block md:w-1/5 ">
                <div> {display_image()} </div>
                <div className="cursor-pointer" onClick={() => linktoItem(AdItems[12].id)}>
                    <div className="pt-4 pl-4 md:pt-8 flex">{load === false ? loader : checkDiscount(AdItems[12].discount,AdItems[12].price)}</div> 
                    <div className="md:pt-4 pl-4">{load === false ? null : AdItems[12].product_name} </div>
                </div>
            </div>
                <div className="hover:bg-orange-200  hidden md:block md:w-1/5 ">
                <div> {display_image()} </div>
                <div className="cursor-pointer" onClick={() => linktoItem(AdItems[13].id)}>
                    <div className="pt-4 pl-4 md:pt-8 flex">{load === false ? loader : checkDiscount(AdItems[13].discount,AdItems[13].price)}</div> 
                    <div className="md:pt-4 pl-4"> {load === false ? null : AdItems[13].product_name} </div>
                </div>
            </div>
                <div className=" hover:bg-orange-200  hidden md:block md:w-1/5 ">
                <div> {display_image()} </div>
                <div className="cursor-pointer" onClick={() => linktoItem(AdItems[14].id)}>
                    <div className="pt-4 pl-4 md:pt-8 flex">{load === false ? loader : checkDiscount(AdItems[14].discount,AdItems[14].price)}</div> 
                    <div className="md:pt-4 pl-4"> {load === false ? null : AdItems[14].product_name} </div>
                </div>
            </div>
        </div>
    </SwipeableViews>    </div>);

    return (
        <div>
         
            {searchbar}
            <br/>
            {carousel_slide}
            <div className="w-full">
    
                <div className="font-extrabold text-xl">Trending Now</div>
                <hr className="m-1 pt-1 px-4 bg-gray-300"/>
                {swiping}
                
                <div className="font-extrabold text-xl md:pt-4">Deals</div>
                <hr className="m-1 pt-1 px-4 bg-gray-300"/>
                {swiping}
              
                <div className="font-extrabold text-xl md:pt-4">Popular</div>
                <hr className="m-1 pt-1 px-4 bg-gray-300"/>
                {swiping}
                
                <div className="md:py-4"></div>
            </div>
        </div>
    );
}
