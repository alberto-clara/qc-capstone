import React from 'react';
import '../css/mainTailwind.css';

import {Slider} from './AdSlide'

export function Home(props) {


    function fetching(response) {
        fetch("http://localhost:7000/catalog-api/products/page?pageSize=3&pageIndex=10", { mode: 'cors' })
            .then(res => res.json())
            .then((data) => {
                console.log(data)
            })
            .catch(console.log)
    }


    const searchbar = (<div>
        <div className="mt-4 justify-center flex text-gray-600 lg:px-20 pl-5 pr-5">
            <input className="w-full border-2 border-gray-300 bg-white h-10 px-5 pr-8 text-sm" type="search" name="search" placeholder="Search"></input>
            <button type="submit" className="px-4 py-2 border-2 rounded text-gray-300 border-gray-300 bg-white hover:text-white hover:border-orange-400">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path className="heroicon-ui" fill="gray" d="M16.32 14.9l5.39 5.4a1 1 0 0 1-1.42 1.4l-5.38-5.38a8 8 0 1 1 1.41-1.41zM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z"/></svg>
            </button>
        </div>
    </div>);
    const homediv = (<div>
        <div className="text text-red-500 text-center font-black" >Hello, HomeDepot!</div>

        <button onClick={fetching}> Fetching Data</button>
    </div>);




   
  const recommend = (<div className=" w-full h-40 lg:justify-center lg:px-20 pr-5 pl-5">
        <div className="  font-bold">Label</div>
        <div className="px-4 bg-gray-200">
            <div className="flex border-2 h-32">
                <div className="bg-blue-400 h-32 w-1/3 sm:1/4 md:w-1/6 lg:w-1/12"></div>
                <div className="bg-blue-300 h-32 w-1/3 sm:1/4 md:w-1/6 lg:w-1/12"></div>
                <div className="bg-blue-200 h-32 w-1/3 sm 1/4 md:w-1/6 lg:w-1/12"></div>
                <div className="bg-blue-700 h-32 hidden md:flex md:w-1/6 lg:w-1/12"></div>
                <div className="bg-blue-300 h-32 hidden md:flex md:w-1/6 lg:w-1/12"></div>
                <div className="bg-blue-200 h-32 hidden md:flex md:w-1/6 lg:w-1/12"></div>
                <div className="bg-blue-300 h-32 hidden md:flex lg:w-1/12"></div>
                <div className="bg-blue-200 h-32 hidden md:flex lg:w-1/12"></div>
                <div className="bg-blue-300 h-32 hidden md:flex lg:w-1/12"></div>
                <div className="bg-blue-200 h-32 hidden md:flex lg:w-1/12"></div>
                <div className="bg-blue-300 h-32 hidden md:flex lg:w-1/12"></div>
                <div className="bg-blue-200 h-32 hidden md:flex lg:w-1/12"></div>
            </div>

        </div>
        <div className="forgetText mr-1">See more</div>
    </div>);


    return (
        <div  >
            {searchbar}
            {homediv}
            <Slider />

            {recommend}
            {recommend}
            {recommend}

        </div>
    );
}
