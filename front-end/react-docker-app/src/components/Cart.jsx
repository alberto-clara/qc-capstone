import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FireBaseSetup from '../FireBaseSetup';
import display_image from './PicArray';

export const Cart = (props) => {
    const [UserUID, setUserUID] = useState("");
    const [count, setCount] = useState(1);
    const [ItemArray, setItemArray] = useState([]);
    const [load, setLoad] = useState(false);
    useEffect(() => {
        document.title = `Home Depot - Cart`;
        FireBaseSetup.isInitialized().then(user => {
            if (user) {
                setUserUID(user.uid);
                mongoFetch(user.uid);
            }
        });
        console.log(ItemArray);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const mongoFetch = async (uidValue) => {
        var initValue = [];
        await axios.get("http://localhost:3001/user").then((res) => {
            //  console.log(res.data[1].CartItems);
            for (var i = 0; i < res.data.length; i++) {
                initValue.push({
                    uid: res.data[i].uid,
                    ItemInfo: res.data[i].CartItems
                })
            };
            //  console.log(initValue);
            initValue.forEach(el => {
                if (el.uid === uidValue) {
                    console.log("Well here", el.ItemInfo);
                    setItemArray(el.ItemInfo);
                }
            })
        }

        );
        setLoad(!load);
    }

    // const listItemCart = ItemArray.map(item => {
    //     return (
    //         <div>
    //             <div className="w-full h-72 bg-yellow-500">
    //                 <div className="flex">
    //                     <div className="block w-1/3 bg-green-500">image</div>
    //                     <div className="flex">
    //                         <div className="block">
    //                             <div className="text-lg bg-purple-500">{item.itemName}</div>
    //                             <div className="text-lg bg-blue-500">{item.itemPrice}</div>
    //                         </div>
    //                     </div>
    //                 </div>
    //             </div>
    //         </div>
    //     )
    
    
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

    return (<>
        <div>
        <div className="mt-4 justify-center w-full /*bg-blue-400*/">
            <div className=" titlePage pt-2 pb-4 lg:text-3xl"> My Cart </div>
        </div>
            {/* {load ? listItemCart : null} */}
            <div className="flex w-full /*bg-yellow-400*/">
                    <div className="flex border border-orange-300 w-full">
                        <div className="flex w-full h-48 md:w-1/4 md:h-56">{display_image()}</div>
                        <div className="block text-lg w-full">
                            <div className="m-4 text-md md:text-2xl font-extrabold /*bg-purple-500*/">Heavy Ducimus Bucket</div>
                                <div className="m-4 text-2xl font-extrabold pt-2">$143.21</div>
                                <div className="pl-4 pt-2">ErrorIpsa CO.</div>
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

                <div className="flex w-full /*bg-yellow-400*/">
                    <div className="flex border border-orange-300 w-full">
                        <div className="flex w-full h-48 md:w-1/4 md:h-56">{display_image()}</div>
                        <div className="block text-lg w-full">
                            <div className="m-4 text-md md:text-2xl font-extrabold /*bg-purple-500*/">Heavy Ducimus Bucket</div>
                                <div className="m-4 text-2xl font-extrabold pt-2">$143.21</div>
                                <div className="pl-4 pt-2">ErrorIpsa CO.</div>
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

                <div className="flex w-full /*bg-yellow-400*/">
                    <div className="flex border border-orange-300 w-full">
                        <div className="flex w-full h-48 md:w-1/4 md:h-56">{display_image()}</div>
                        <div className="block text-lg w-full">
                            <div className="m-4 text-md md:text-2xl font-extrabold /*bg-purple-500*/">Heavy Ducimus Bucket</div>
                                <div className="m-4 text-2xl font-extrabold pt-2">$143.21</div>
                                <div className="pl-4 pt-2">ErrorIpsa CO.</div>
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
                
                <div className="flex w-full /*bg-yellow-400*/">
                    <div className="flex border border-orange-300 w-full">
                        <div className="flex w-full h-48 md:w-1/4 md:h-56">{display_image()}</div>
                        <div className="block text-lg w-full">
                            <div className="m-4 text-md md:text-2xl font-extrabold /*bg-purple-500*/">Heavy Ducimus Bucket</div>
                                <div className="m-4 text-2xl font-extrabold pt-2">$143.21</div>
                                <div className="pl-4 pt-2">ErrorIpsa CO.</div>
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
