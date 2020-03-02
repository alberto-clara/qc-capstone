import React, { useState,useEffect } from 'react';
import '../css/mainTailwind.css';
//import { autoPlay } from 'react-swipeable-views-utils';
import axios from 'axios';
import SwipeableViews from 'react-swipeable-views';
// import { Slider } from './AdSlide';
import { Carousel } from "react-responsive-carousel";
import mountain from '../images/mountain-826114_1280.jpg';
import sky from '../images/wallpapers-wide-1.jpg';
import display_image from './PicArray';

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
      //  tryFetch();
        const tryFetch = async () => {
           await axios.get("http://localhost:7000/catalog-api/products/home").then((res) => {
               //console.log(res);
                for (var i = 0; i < res.data.length; i++) {
                    initValue.push({ id: res.data[i].product_key, product_name: res.data[i].product_name, price: res.data[i].unit_retail});
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
    //console.log(AdItems[0]);
    const linktoItem = (itemId) => {
        window.location.assign("/product/" + itemId);
    }
    const swiping = (
     
        <div><SwipeableViews enableMouseEvents>
            <div className="flex w-full  ">
                <div  className=" hover:bg-orange-200 w-1/2 md:w-1/5 ">
                <div> {display_image()} </div>
                <div className="cursor-pointer" onClick={() => linktoItem(AdItems[0].id)}>
                    <div className="pt-2 md:pt-4 pl-4 md:pt-8">${load === false ? null : roundDigit(AdItems[0].price)}</div>
                    <div className="md:pt-4 pl-4">{load === false ? null : AdItems[0].product_name}</div>
                </div>
            </div>
                <div className=" hover:bg-orange-200  w-1/2 md:w-1/5 ">
                <div> {display_image()} </div>
                <div className="cursor-pointer" onClick={() => linktoItem(AdItems[1].id)}>
                    <div className="pt-2 md:pt-4 pl-4 md:pt-8">${load === false ? null : roundDigit(AdItems[1].price)}</div>
                    <div className="md:pt-4 pl-4"> {load === false ? null : AdItems[1].product_name}</div>
                </div>
            </div>
            <div className="hover:bg-orange-200  hidden md:block md:w-1/5 ">
                <div> {display_image()}  </div>
                <div className="cursor-pointer" onClick={() => linktoItem(AdItems[2].id)}>
                    <div className="pt-4 pl-4 md:pt-8">${load === false ? null : roundDigit(AdItems[2].price)}</div>
                    <div className="md:pt-4 pl-4">{load === false ? null : AdItems[2].product_name} </div>
                </div>
            </div>
            <div className=" hover:bg-orange-200  hidden md:block md:w-1/5 ">
                <div> {display_image()}  </div>
                <div className="cursor-pointer" onClick={() => linktoItem(AdItems[3].id)}>
                    <div className="pt-4 pl-4 md:pt-8">${load === false ? null : roundDigit(AdItems[3].price)}</div>
                    <div className="md:pt-4 pl-4"> {load === false ? null : AdItems[3].product_name} </div>
                </div>
            </div>
                <div className="hover:bg-orange-200  hidden md:block md:w-1/5 ">
                <div> {display_image()}  </div>
                <div className="cursor-pointer" onClick={() => linktoItem(AdItems[4].id)}>
                    <div className="pt-4 pl-4 md:pt-8">${load === false ? null : roundDigit(AdItems[4].price)}</div>
                    <div className="md:pt-4 pl-4"> {load === false ? null : AdItems[4].product_name} </div>
                </div>
            </div>
        </div>
        <div className="flex w-full">
                <div className=" hover:bg-orange-200  w-1/2 md:w-1/5 ">

                <div> {display_image()} </div>
                <div className="cursor-pointer" onClick={() => linktoItem(AdItems[5].id)}>
                    <div className="flex justify-center pt-4 md:pt-8 items-center">${load === false ? null : roundDigit(AdItems[5].price)}</div>
                    <div className="flex justify-center pt-12 md:pt-4 items-center ">{load === false ? null : AdItems[5].product_name}</div>
                </div>
            </div>
                <div className="hover:bg-orange-200  w-1/2 md:w-1/5 ">
                <div> {display_image()} </div>
                <div className="cursor-pointer" onClick={() => linktoItem(AdItems[6].id)}>
                    <div className="pt-4 pl-4 md:pt-8">${load === false ? null : roundDigit(AdItems[6].price)}</div>
                    <div className="md:pt-4 pl-4"> {load === false ? null : AdItems[6].product_name}</div>
                </div>
            </div>
                <div className="hover:bg-orange-200  hidden ti:block md:w-1/5 ">
                <div> {display_image()} </div>
                <div className="pt-4 pl-4 md:pt-8">${load === false ? null : roundDigit(AdItems[7].price)}</div>
                <div className="md:pt-4 pl-4">{load === false ? null : AdItems[7].product_name} </div>

            </div>
                <div className=" hover:bg-orange-200 hidden md:block md:w-1/5 ">
                <div> {display_image()}  </div>
                <div className="cursor-pointer" onClick={() => linktoItem(AdItems[8].id)}>
                    <div className="pt-4 pl-4 md:pt-8">${load === false ? null : roundDigit(AdItems[8].price)}</div>
                    <div className="md:pt-4 pl-4"> {load === false ? null : AdItems[8].product_name} </div>
                </div>
            </div>
                <div className="  hover:bg-orange-200  hidden md:block md:w-1/5 ">
                <div> {display_image()} </div>
                <div className="cursor-pointer" onClick={() => linktoItem(AdItems[9].id)}>
                    <div className="pt-4 pl-4 md:pt-8">${load === false ? null : roundDigit(AdItems[9].price)}</div>
                    <div className="md:pt-4 pl-4"> {load === false ? null : AdItems[9].product_name} </div>
                </div>
            </div>
        </div>
        <div className="flex w-full">
                <div className=" hover:bg-orange-200  w-1/2 md:w-1/5 ">
                <div> {display_image()} </div>
                <div className="cursor-pointer" onClick={() => linktoItem(AdItems[10].id)}>
                    <div className="pt-4 pl-4 md:pt-8">${load === false ? null : roundDigit(AdItems[10].price)}</div>
                    <div className="md:pt-4 pl-4">{load === false ? null : AdItems[10].product_name}</div>
                </div>
            </div>
                <div className=" hover:bg-orange-200  w-1/2 md:w-1/5 ">
                <div> {display_image()} </div>
                <div className="cursor-pointer" onClick={() => linktoItem(AdItems[11].id)}>
                    <div className="pt-4 pl-4 md:pt-8">${load === false ? null : roundDigit(AdItems[11].price)}</div>
                    <div className="md:pt-4 pl-4"> {load === false ? null : AdItems[11].product_name}</div>
                </div>
            </div>
                <div  className=" hover:bg-orange-200  hidden ti:block md:w-1/5 ">
                <div> {display_image()} </div>
                <div className="cursor-pointer" onClick={() => linktoItem(AdItems[12].id)}>
                    <div className="pt-4 pl-4 md:pt-8">${load === false ? null : roundDigit(AdItems[12].price)}</div>
                    <div className="md:pt-4 pl-4">{load === false ? null : AdItems[12].product_name} </div>
                </div>
            </div>
                <div className="hover:bg-orange-200  hidden md:block md:w-1/5 ">
                <div> {display_image()} </div>
                <div className="cursor-pointer" onClick={() => linktoItem(AdItems[13].id)}>
                    <div className="pt-4 pl-4 md:pt-8">${load === false ? null : roundDigit(AdItems[13].price)}</div>
                    <div className="md:pt-4 pl-4"> {load === false ? null : AdItems[13].product_name} </div>
                </div>
            </div>
                <div className=" hover:bg-orange-200  hidden md:block md:w-1/5 ">
                <div> {display_image()} </div>
                <div className="cursor-pointer" onClick={() => linktoItem(AdItems[14].id)}>
                    <div className="pt-4 pl-4 md:pt-8">${load === false ? null : roundDigit(AdItems[14].price)}</div>
                    <div className="md:pt-4 pl-4"> {load === false ? null : AdItems[14].product_name} </div>
                </div>
            </div>
        </div>
    </SwipeableViews>    </div>);

/*  const footr = (
      <div className="w-full bg-gray-500">footer/need to implement</div>
  );
*/
    return (
        <div  >
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
