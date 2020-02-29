import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FireBaseSetup from '../FireBaseSetup';
import display_image from './PicArray';

export const CartItem = (props) => {
    const [count, setCount] = useState(1);
 

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

    const rate = (
        <div className="block">
            <div className="flex">
                <div>Rating</div>
                <div >&#9733;&#9733;&#9733;&#9733;&#9733;</div>
            </div>
        </div>
    );
    console.log(props.value)
    return (<>
      
            <div>
                <div className="flex w-full /*bg-yellow-400*/">
                    <div className="flex border border-orange-300 w-full">
                        <div className="flex w-full h-48 md:w-1/4 md:h-56">{display_image()}</div>
                        <div className="block text-lg w-full">
                        <div className="m-4 text-md md:text-2xl font-extrabold /*bg-purple-500*/">{props.value.product_name}</div>
                        <div className="m-4 text-2xl font-extrabold pt-2">${props.value.unit_retail}</div>
                         <div className="pl-4 pt-2">{props.value.supplier_name}</div>
                            <div className="pl-4">{rate}</div>
                            <div className="md:hidden"> {counters}
                                <button className="flex justify-center m-20 rounded hover:bg-orange-400 border-2 border-orange-500 px-5 font-bold">Add to Cart</button>
                            </div>
                        </div>
                        <div className="hidden md:block md:w-1/4 justify-center ">
                            {counters}
                            <button className="flex justify-center m-20 rounded hover:bg-orange-400 border-2 border-orange-500 px-5 font-bold">Add to Cart</button>
                        </div>
                    </div>
                </div>
            </div> 
    </>);
}
