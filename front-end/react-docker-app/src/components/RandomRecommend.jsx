import React, { useState,useEffect } from 'react';
import '../css/mainTailwind.css';
//import { autoPlay } from 'react-swipeable-views-utils';
import axios from 'axios';
import SwipeableViews from 'react-swipeable-views';
// import { Slider } from './AdSlide';
import { Carousel } from "react-responsive-carousel";
import mountain from '../images/mountain-826114_1280.jpg';
import sky from '../images/wallpapers-wide-1.jpg';
import { swiping } from '../components/RandomRecommend';

export const swiping = (
<div><SwipeableViews enableMouseEvents>
    <div className=" h-76 flex w-full border-2">
        <div className="bg-blue-300 w-1/2 ti:w-1/3 md:w-1/5 ti:h-70 md:h-72 border-2">
            <div className="flex bg-red-300 h-32 xl:h-48 justify-center items-center"> picture </div>
            <div className="flex justify-center items-center">{load === false ? null : AdItems[0].product_name}</div>
            <div className="flex justify-center items-center">${load === false ? null : roundDigit(AdItems[0].price)}</div>
        </div>
        <div className="bg-blue-300 w-1/2 ti:w-1/3 md:w-1/5 ti:h-70 md:h-72 border-2">
            <div className="flex bg-red-300 h-32 xl:h-48 justify-center items-center"> picture </div>
            <div className="flex justify-center items-center"> {load === false ? null : AdItems[1].product_name}</div>
            <div className="flex justify-center items-center">${load === false ? null : roundDigit(AdItems[1].price)}</div>
        </div>
        <div className="bg-blue-700 hidden ti:block ti:w-1/3 md:w-1/5  ti:h-70 md:h-72 border-2">
            <div className="flex bg-red-200 flex h-32 xl:h-48 justify-center items-center"> picture </div>
            <div className="flex justify-center items-center">{load === false ? null : AdItems[2].product_name} </div>
            <div className="flex justify-center items-center">${load === false ? null : roundDigit(AdItems[2].price)}</div>
        </div>
        <div className="bg-blue-300 hidden md:block md:w-1/3 ti:h-70 md:h-72 border-2">
            <div className="flex bg-red-300 h-32 xl:h-48 justify-center items-center"> picture </div>
            <div className="flex justify-center items-center"> {load === false ? null : AdItems[3].product_name} </div>
            <div className="flex justify-center items-center">${load === false ? null : roundDigit(AdItems[3].price)}</div>
        </div>
        <div className="bg-blue-200 hidden md:block md:w-1/3 ti:h-70 md:h-72 border-2">
            <div className="flex bg-red-100 h-32 xl:h-48 justify-center items-center"> picture </div>
            <div className="flex justify-center items-center"> {load === false ? null : AdItems[4].product_name} </div>
            <div className="flex justify-center items-center">${load === false ? null : roundDigit(AdItems[4].price)}</div>
        </div>

    </div>
    <div className=" h-76 flex w-full border-2">
        <div className="bg-blue-300 w-1/2 ti:w-1/3 md:w-1/5 ti:h-70 md:h-72 border-2">
            <div className="flex bg-red-300 h-32 xl:h-48 justify-center items-center"> picture </div>
            <div className="flex justify-center items-center"> {load === false ? null : AdItems[5].product_name}</div>
            <div className="flex justify-center items-center">${load === false ? null : roundDigit(AdItems[5].price)}</div>
        </div>
        <div className="bg-blue-300 w-1/2 ti:w-1/3 md:w-1/5 ti:h-70 md:h-72 border-2">
            <div className="flex bg-orange-300 h-32 xl:h-48 justify-center items-center"> picture </div>
            <div className="flex justify-center items-center"> {load === false ? null : AdItems[6].product_name} </div>
            <div className="flex justify-center items-center">${load === false ? null : roundDigit(AdItems[6].price)}</div>
        </div>
        <div className="bg-blue-700 hidden ti:block ti:w-1/3 md:w-1/5  ti:h-70 md:h-72 border-2">
            <div className="flex bg-red-200 flex h-32 xl:h-48 justify-center items-center"> picture </div>
            <div className="flex justify-center items-center"> {load === false ? null : AdItems[7].product_name} </div>
            <div className="flex justify-center items-center">${load === false ? null : roundDigit(AdItems[7].price)}</div>
        </div>
        <div className="bg-blue-300 hidden md:block md:w-1/3 ti:h-70 md:h-72 border-2">
            <div className="flex bg-orange-300 h-32 xl:h-48 justify-center items-center"> picture </div>
            <div className="flex justify-center items-center"> {load === false ? null : AdItems[8].product_name} </div>
            <div className="flex justify-center items-center">${load === false ? null : roundDigit(AdItems[8].price)}</div>
        </div>
        <div className="bg-blue-200 hidden md:block md:w-1/3 ti:h-70 md:h-72 border-2">
            <div className="flex bg-red-100 h-32 xl:h-48 justify-center items-center"> picture </div>
            <div className="flex justify-center items-center"> {load === false ? null : AdItems[9].product_name}</div>
            <div className="flex justify-center items-center">${load === false ? null : roundDigit(AdItems[9].price)}</div>
        </div>

    </div>
    <div className=" h-76 flex w-full border-2">
        <div className="bg-green-300 w-1/2 ti:w-1/3 md:w-1/5 ti:h-70 md:h-72 border-2">
            <div className="flex bg-red-300 h-32 xl:h-48 justify-center items-center"> picture </div>
            <div className="flex justify-center items-center">{load === false ? null : AdItems[10].product_name} </div>
            <div className="flex justify-center items-center">${load === false ? null : roundDigit(AdItems[10].price)}</div>
        </div>
        <div className="bg-blue-300 w-1/2 ti:w-1/3 md:w-1/5 ti:h-70 md:h-72 border-2">
            <div className="flex bg-green-300 h-32 xl:h-48 justify-center items-center"> picture </div>
            <div className="flex justify-center items-center"> {load === false ? null : AdItems[11].product_name}</div>
            <div className="flex justify-center items-center">${load === false ? null : roundDigit(AdItems[11].price)}</div>
        </div>
        <div className="bg-green-700 hidden ti:block ti:w-1/3 md:w-1/5  ti:h-70 md:h-72 border-2">
            <div className="flex bg-red-200 flex h-32 xl:h-48 justify-center items-center"> picture </div>
            <div className="flex justify-center items-center">{load === false ? null : AdItems[12].product_name} </div>
            <div className="flex justify-center items-center">${load === false ? null : roundDigit(AdItems[12].price)}</div>
        </div>
        <div className="bg-blue-300 hidden md:block md:w-1/3 ti:h-70 md:h-72 border-2">
            <div className="flex bg-green-300 h-32 xl:h-48 justify-center items-center"> picture </div>
            <div className="flex justify-center items-center"> {load === false ? null : AdItems[13].product_name} </div>
            <div className="flex justify-center items-center">${load === false ? null : roundDigit(AdItems[13].price)}</div>
        </div>
        <div className="bg-green-200 hidden md:block md:w-1/3 ti:h-70 md:h-72 border-2">
            <div className="flex bg-red-100 h-32 xl:h-48 justify-center items-center"> picture </div>
            <div className="flex justify-center items-center">{load === false ? null : AdItems[14].product_name}</div>
            <div className="flex justify-center items-center">${load === false ? null : roundDigit(AdItems[14].price)}</div>
        </div>

    </div>
</SwipeableViews>    </div>);
  
