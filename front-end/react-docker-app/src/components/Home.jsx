import React, { useEffect } from 'react';
import '../css/mainTailwind.css';
//import { autoPlay } from 'react-swipeable-views-utils';
import SwipeableViews from 'react-swipeable-views';
// import { Slider } from './AdSlide';
import { Carousel } from "react-responsive-carousel";
import mountain from '../images/mountain-826114_1280.jpg';
import sky from '../images/wallpapers-wide-1.jpg';

export const searchbar = (
    <div className="  mt-4 justify-center flex text-gray-600 w-full">
        <input className=" rounded border-2 border-orange-500 bg-white h-15 px-5 pr-8 text-sm w-full" type="search" name="search" placeholder="Search"></input>
        <button type="submit" className="px-4 py-2 border-2 rounded text-gray-300 border-orange-500 bg-white hover:text-white hover:border-orange-500">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="15"><path className="heroicon-ui " fill="gray" d="M16.32 14.9l5.39 5.4a1 1 0 0 1-1.42 1.4l-5.38-5.38a8 8 0 1 1 1.41-1.41zM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z" /></svg>
        </button>
    </div>);

export const Home =(props)=> {
    useEffect(() => {
        document.title = `Home Depot - HomePage`;
    },[]);


   
    const swiping = <div>
    <SwipeableViews enableMouseEvents>
        <div className=" h-76 flex w-full border-2">           
                <div className="bg-blue-300 w-1/2 ti:w-1/3 md:w-1/5 ti:h-70 md:h-72 border-2">
                    <div className="flex bg-red-300 h-32 xl:h-48 justify-center items-center"> picture </div>
                    <div className="flex justify-center items-center"> product name </div>
                </div>
                <div className="bg-blue-300 w-1/2 ti:w-1/3 md:w-1/5 ti:h-70 md:h-72 border-2">
                    <div className="flex bg-red-300 h-32 xl:h-48 justify-center items-center"> picture </div>
                    <div className="flex justify-center items-center"> product name </div>
                </div>
                <div className="bg-blue-700 hidden ti:block ti:w-1/3 md:w-1/5  ti:h-70 md:h-72 border-2">
                    <div className="flex bg-red-200 flex h-32 xl:h-48 justify-center items-center"> picture </div>
                    <div className="flex justify-center items-center"> product name </div>
                </div>
                <div className="bg-blue-300 hidden md:block md:w-1/3 ti:h-70 md:h-72 border-2">
                    <div className="flex bg-red-300 h-32 xl:h-48 justify-center items-center"> picture </div>
                    <div className="flex justify-center items-center"> product name </div>
                </div>
                <div className="bg-blue-200 hidden md:block md:w-1/3 ti:h-70 md:h-72 border-2">
                    <div className="flex bg-red-100 h-32 xl:h-48 justify-center items-center"> picture </div>
                    <div className="flex justify-center items-center"> product name </div>
                </div>
            
        </div>
        <div className=" h-76 flex w-full border-2">
            <div className="bg-blue-300 w-1/2 ti:w-1/3 md:w-1/5 ti:h-70 md:h-72 border-2">
                <div className="flex bg-red-300 h-32 xl:h-48 justify-center items-center"> picture </div>
                <div className="flex justify-center items-center"> product name </div>
            </div>
            <div className="bg-blue-300 w-1/2 ti:w-1/3 md:w-1/5 ti:h-70 md:h-72 border-2">
                <div className="flex bg-orange-300 h-32 xl:h-48 justify-center items-center"> picture </div>
                <div className="flex justify-center items-center"> product name </div>
            </div>
            <div className="bg-blue-700 hidden ti:block ti:w-1/3 md:w-1/5  ti:h-70 md:h-72 border-2">
                <div className="flex bg-red-200 flex h-32 xl:h-48 justify-center items-center"> picture </div>
                <div className="flex justify-center items-center"> product name </div>
            </div>
            <div className="bg-blue-300 hidden md:block md:w-1/3 ti:h-70 md:h-72 border-2">
                <div className="flex bg-orange-300 h-32 xl:h-48 justify-center items-center"> picture </div>
                <div className="flex justify-center items-center"> product name </div>
            </div>
            <div className="bg-blue-200 hidden md:block md:w-1/3 ti:h-70 md:h-72 border-2">
                <div className="flex bg-red-100 h-32 xl:h-48 justify-center items-center"> picture </div>
                <div className="flex justify-center items-center"> product name </div>
            </div>

        </div>
        <div className=" h-76 flex w-full border-2">
            <div className="bg-green-300 w-1/2 ti:w-1/3 md:w-1/5 ti:h-70 md:h-72 border-2">
                <div className="flex bg-red-300 h-32 xl:h-48 justify-center items-center"> picture </div>
                <div className="flex justify-center items-center"> product name </div>
            </div>
            <div className="bg-blue-300 w-1/2 ti:w-1/3 md:w-1/5 ti:h-70 md:h-72 border-2">
                <div className="flex bg-green-300 h-32 xl:h-48 justify-center items-center"> picture </div>
                <div className="flex justify-center items-center"> product name </div>
            </div>
            <div className="bg-green-700 hidden ti:block ti:w-1/3 md:w-1/5  ti:h-70 md:h-72 border-2">
                <div className="flex bg-red-200 flex h-32 xl:h-48 justify-center items-center"> picture </div>
                <div className="flex justify-center items-center"> product name </div>
            </div>
            <div className="bg-blue-300 hidden md:block md:w-1/3 ti:h-70 md:h-72 border-2">
                <div className="flex bg-green-300 h-32 xl:h-48 justify-center items-center"> picture </div>
                <div className="flex justify-center items-center"> product name </div>
            </div>
            <div className="bg-green-200 hidden md:block md:w-1/3 ti:h-70 md:h-72 border-2">
                <div className="flex bg-red-100 h-32 xl:h-48 justify-center items-center"> picture </div>
                <div className="flex justify-center items-center"> product name </div>
            </div>

        </div>
    </SwipeableViews>
    </div>
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

    
  
    return (
        <div  >
            {searchbar}
            <br/>
            {carousel_slide}
           
            {swiping}
          
         
        

        </div>
    );
}
