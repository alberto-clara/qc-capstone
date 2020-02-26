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
               console.log(res);
                for (var i = 0; i < res.data.length; i++) {
                    initValue.push({ id: res.data[i].id, product_name: res.data[i].product_name, price: res.data[i].unit_retail});
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
   
    const itemSwipe = AdItems.map(item => {
        return (
            // <div className="block bg-purple-300">
                <SwipeableViews enableMouseEvents className="inline-block w-1/5 bg-yellow-400">
                    <div key={item.id} className="block bg-gray-500 border-2">
                            {/* <div className="flex-1 bg-green-300 border-2"> */}
                                <div className=" bg-red-300 w-full h-32 justify-center items-center"> picture </div>
                                {/* <div className="justify-center bg-purple-400 w-full items-center">{load === false ? null : item.product_name} </div>
                                <div className="justify-center w-fzull bg-blue-400 items-center">${load === false ? null : roundDigit(item.price)}</div> */}
                            {/* </div> */}
                    </div>
                </SwipeableViews>
            // </div>
        )
    })

    // const swiping = (<div><SwipeableViews enableMouseEvents>
        
    //     <div className="block w-full border-2">
    //         <div className="flex border-2 w-full h-32 sm:h-48 md:h-48">
    //             <div className="block w-1/2 ti:w-1/3 md:w-1/5 h-32 md:h-48 "> {display_image()} </div>
    //             <div className="block w-1/2 ti:w-1/3 md:w-1/5 h-32 md:h-48 "> {display_image()} </div>
    //             <div className="block w-1/2 ti:w-1/3 md:w-1/5 h-32 md:h-48 hidden ti:block"> {display_image()} </div>
    //             <div className="block w-1/2 ti:w-1/3 md:w-1/5 h-32 md:h-48 hidden ti:block"> {display_image()} </div>
    //             <div className="block w-1/2 ti:w-1/3 md:w-1/5 h-32 md:h-48 hidden ti:block"> {display_image()} </div>
    //        </div>
    //        <div className="flex border-2 bg-red-300">
    //             <div className="block w-1/2 md:w-1/5 pt-18 md:pt-2">{load === false ? null : AdItems[0].product_name}</div>
    //             <div className="block w-1/2 md:w-1/5 pt-18 md:pt-2">{load === false ? null : AdItems[1].product_name}</div>
    //             <div className="block w-1/2 md:w-1/5 md:pt-2 hidden ti:block">{load === false ? null : AdItems[2].product_name}</div>
    //             <div className="block w-1/2 md:w-1/5 md:pt-2 hidden ti:block">{load === false ? null : AdItems[3].product_name}</div>
    //             <div className="block w-1/2 md:w-1/5 md:pt-2 hidden ti:block">{load === false ? null : AdItems[4].product_name}</div>
    //        </div>
    //        <div className="flex border-2 bg-yellow-500">
    //             <div className="block w-1/2 md:w-1/5 pt-4">${load === false ? null : roundDigit(AdItems[0].price)}</div>
    //             <div className="block w-1/2 md:w-1/5 pt-4">${load === false ? null : roundDigit(AdItems[1].price)}</div>
    //             <div className="block w-1/2 md:w-1/5 pt-4 hidden ti:block">${load === false ? null : roundDigit(AdItems[2].price)}</div>
    //             <div className="block w-1/2 md:w-1/5 pt-4 hidden ti:block">${load === false ? null : roundDigit(AdItems[3].price)}</div>
    //             <div className="block w-1/2 md:w-1/5 pt-4 hidden ti:block">${load === false ? null : roundDigit(AdItems[4].price)}</div>
    //        </div>
           
    //    </div>
    //    <div className="block w-full border-2 bg-red-300">
    //         <div className="flex border-2">
    //             <div className="block w-1/2 ti:w-1/3 md:w-1/5 h-32 md:h-48 justify-center items-center"> {display_image()} </div>
    //             <div className="block w-1/2 ti:w-1/3 md:w-1/5 h-32 md:h-48 justify-center items-center"> {display_image()} </div>
    //             <div className="block w-1/2 ti:w-1/3 md:w-1/5 h-32 md:h-48 justify-center items-center"> {display_image()} </div>
    //             <div className="block w-1/2 ti:w-1/3 md:w-1/5 h-32 md:h-48 justify-center items-center"> {display_image()} </div>
    //             <div className="block w-1/2 ti:w-1/3 md:w-1/5 h-32 md:h-48 justify-center items-center"> {display_image()} </div>
    //        </div>
    //    </div>

    // </SwipeableViews>  </div>);

    const swiping = (<div><SwipeableViews enableMouseEvents>
        <div className="flex w-full ">
            <div className="w-1/2 md:w-1/5 ">
                <div className="flex md:h-56 justify-center items-center"> {display_image()} </div>
                <div className="flex h-4 md:pt-4">{load === false ? null : AdItems[0].product_name}</div>
                <div className="flex justify-center pt-4 md:pt-8 items-center">${load === false ? null : roundDigit(AdItems[0].price)}</div>
            </div>
            <div className="w-1/2 md:w-1/5 ">
                <div className="flex md:h-56 justify-center items-center"> {display_image()} </div>
                <div className="flex h-4 md:pt-4"> {load === false ? null : AdItems[1].product_name}</div>
                <div className="flex justify-center pt-4 md:pt-8 items-center">${load === false ? null : roundDigit(AdItems[1].price)}</div>
            </div>
            <div className="hidden md:block md:w-1/5 ">
                <div className="flex h-56 justify-center items-center"> {display_image()}  </div>
                <div className="flex h-4 md:pt-4">{load === false ? null : AdItems[2].product_name} </div>
                <div className="flex justify-center pt-4 md:pt-8 items-center">${load === false ? null : roundDigit(AdItems[2].price)}</div>
            </div>
            <div className="hidden md:block md:w-1/5 ">
                <div className="flex h-56 justify-center items-center"> {display_image()}  </div>
                <div className="flex h-4 md:pt-4"> {load === false ? null : AdItems[3].product_name} </div>
                <div className="flex justify-center pt-4 md:pt-8 items-center">${load === false ? null : roundDigit(AdItems[3].price)}</div>
            </div>
            <div className="hidden md:block md:w-1/5 ">
                <div className="flex h-56 justify-center items-center"> {display_image()}  </div>
                <div className="flex h-4 md:pt-4"> {load === false ? null : AdItems[4].product_name} </div>
                <div className="flex justify-center pt-4 md:pt-8 items-center">${load === false ? null : roundDigit(AdItems[4].price)}</div>
            </div>
        </div>
        <div className="flex w-full ">
            <div className="w-1/2 md:w-1/5 ">
                <div className="flex h-48 md:h-56  justify-center items-center"> {display_image()} </div>
                <div className="flex justify-center pt-12 md:pt-4 items-center ">{load === false ? null : AdItems[5].product_name}</div>
                <div className="flex justify-center pt-4 md:pt-8 items-center">${load === false ? null : roundDigit(AdItems[5].price)}</div>
            </div>
            <div className="w-1/2 md:w-1/5 ">
                <div className="flex h-48 md:h-56  justify-center items-center"> {display_image()} </div>
                <div className="flex justify-center pt-12 md:pt-4 items-center"> {load === false ? null : AdItems[6].product_name}</div>
                <div className="flex justify-center pt-4 md:pt-8 items-center">${load === false ? null : roundDigit(AdItems[6].price)}</div>
            </div>
            <div className="hidden ti:block md:w-1/5 ">
                <div className="flex h-56 justify-center items-center"> {display_image()}  </div>
                <div className="flex justify-center pt-12 md:pt-4 items-center">{load === false ? null : AdItems[7].product_name} </div>
                <div className="flex justify-center pt-4 md:pt-8 items-center">${load === false ? null : roundDigit(AdItems[7].price)}</div>
            </div>
            <div className="hidden md:block md:w-1/5 ">
                <div className="flex h-56 justify-center items-center"> {display_image()}  </div>
                <div className="flex justify-center pt-12 md:pt-4 items-center"> {load === false ? null : AdItems[8].product_name} </div>
                <div className="flex justify-center pt-4 md:pt-8 items-center">${load === false ? null : roundDigit(AdItems[8].price)}</div>
            </div>
            <div className="hidden md:block md:w-1/5 ">
                <div className="flex h-56 justify-center items-center"> {display_image()}  </div>
                <div className="flex justify-center pt-12 md:pt-4 items-center"> {load === false ? null : AdItems[9].product_name} </div>
                <div className="flex justify-center pt-4 md:pt-8 items-center">${load === false ? null : roundDigit(AdItems[9].price)}</div>
            </div>
        </div>
        <div className="flex w-full ">
            <div className="w-1/2 md:w-1/5 ">
                <div className="flex h-48 md:h-56  justify-center items-center"> {display_image()} </div>
                <div className="flex justify-center pt-12 md:pt-4 items-center">{load === false ? null : AdItems[10].product_name}</div>
                <div className="flex justify-center pt-4 md:pt-8 items-center">${load === false ? null : roundDigit(AdItems[10].price)}</div>
            </div>
            <div className="w-1/2 md:w-1/5 ">
                <div className="flex h-48 md:h-56  justify-center items-center"> {display_image()} </div>
                <div className="flex justify-center pt-12 md:pt-4 items-center"> {load === false ? null : AdItems[11].product_name}</div>
                <div className="flex justify-center pt-4 md:pt-8 items-center">${load === false ? null : roundDigit(AdItems[11].price)}</div>
            </div>
            <div className="hidden ti:block md:w-1/5 ">
                <div className="flex h-56 justify-center items-center"> {display_image()}  </div>
                <div className="flex justify-center pt-12 md:pt-4 items-center">{load === false ? null : AdItems[12].product_name} </div>
                <div className="flex justify-center pt-4 md:pt-8 items-center">${load === false ? null : roundDigit(AdItems[12].price)}</div>
            </div>
            <div className="hidden md:block md:w-1/5 ">
                <div className="flex h-56 justify-center items-center"> {display_image()}  </div>
                <div className="flex justify-center pt-12 md:pt-4 items-center"> {load === false ? null : AdItems[13].product_name} </div>
                <div className="flex justify-center pt-4 md:pt-8 items-center">${load === false ? null : roundDigit(AdItems[13].price)}</div>
            </div>
            <div className="hidden md:block md:w-1/5 ">
                <div className="flex h-56 justify-center items-center"> {display_image()}  </div>
                <div className="flex justify-center pt-12 md:pt-4 items-center"> {load === false ? null : AdItems[14].product_name} </div>
                <div className="flex justify-center pt-4 md:pt-8 items-center">${load === false ? null : roundDigit(AdItems[14].price)}</div>
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
                {swiping}
            </div>
         
        </div>
    );
}
