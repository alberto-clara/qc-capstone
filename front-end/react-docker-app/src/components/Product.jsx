import React, { useState, useContext } from 'react';
import '../css/mainTailwind.css';

export function Product(props) {
   
    const search = (

            <div className="  mt-4 justify-center flex text-gray-600 lg:px-20 pl-5 pr-5">
                <input className=" rounded w-full lg:w-1/2 border-2 border-gray-300 bg-white h-10 px-5 pr-8 text-sm" type="search" name="search" placeholder="Search"></input>
                <button type="submit" className="px-4 py-2 border-2 rounded text-gray-300 border-gray-300 bg-white hover:text-white hover:border-orange-400">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="20"><path className="heroicon-ui " fill="gray" d="M16.32 14.9l5.39 5.4a1 1 0 0 1-1.42 1.4l-5.38-5.38a8 8 0 1 1 1.41-1.41zM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z" /></svg>
                </button>
            </div>);
    
    const side_pic = (
        <div className=" titlePage py-2 lg:text-3xl"> Products</div>
    );

    return (
        <div>
            {search}
            {side_pic}
        </div>
        )
}
