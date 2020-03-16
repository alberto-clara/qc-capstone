import React, { useState, useEffect } from 'react';
import axios from 'axios';
import display_image from './PicArray';
import { PutCartUpdate, TokenHeader } from '../ListOfLinks';
import { Cart } from '../components/Cart2'


export const CartItem = (props) => {
    const [count, setCount] = useState(props.value.quantity);

    const [removeItem, setRemoveItem] = useState(false);

    const UpdateCart = async () => {
        await axios.put(PutCartUpdate(props.value.offering_key, count), {}, TokenHeader(props.token)).then((res) => { console.log("Update data");   });
        window.location.href = '/cart';
    }
  
    const presentCounter = (<div type="number" className="h-10 font-semibold flex justify-center text-gray-500 w-1/3 items-center text-2xl" > {count} </div>) 
    const changeCounter = (<div type="number" className="h-10 font-semibold flex justify-center text-gray-800 w-1/3 items-center text-2xl" > {count} </div>)             
    const changeUpdate = (<button onClick={() => UpdateCart()} className="flex justify-center m-20 rounded hover:bg-orange-400 border-2 border-orange-500 px-5 font-bold">Update Cart</button>)              
    const changeUpdateMobile = (<button onClick={() => UpdateCart()} className="justify-center mx-20 my-4 rounded hover:bg-orange-400 border-2 border-orange-500 px-5 font-bold">Update Cart</button>)

    const counters = (
        <div className="justify-center m-4 rounded h-11 border-2 border-orange-500">
            <div className="flex font-semibold hover:text-black focus:text-black text-gray-700" >
                <button onClick={() => minusItem()}className=" flex justify-center rounded text-gray-600 hover:text-gray-700 hover:bg-orange-400 h-full w-1/3 border-r-2 border-orange-500">
                    <div className="mx-20 flex items-center text-2xl h-10">-</div>
                </button>
                {count === props.value.quantity ? presentCounter : changeCounter }
                <button onClick={() => setCount(count+1)} className="flex justify-center rounded text-gray-700 hover:text-gray-700 hover:bg-orange-400 h-full text-right w-1/3 border-l-2 border-orange-500">
                   <div className="flex items-center text-2xl h-10" >+</div>
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
    const minusItem = ()=>{
        setCount(count - 1);
        if (count === 1) { setCount(1) } 
    }
    
    const removeCartItem = async() => {
        await axios.put(PutCartUpdate(props.value.offering_key, 0), {}, TokenHeader(props.token)).then((res) => { console.log("Remove data"); setRemoveItem(true); });
        window.location.href = '/cart';
    }

    const linktoProduct = () => {
        window.location.assign("/product/" + props.value.product_key);
    }
    var multi2 = (a, b) => {
        return (a * b).toFixed(2);
    }
    const container = (<div>
        <div className="flex w-full /*bg-yellow-400*/">
            <div className="w-full">
                <div className="flex rounded border border-orange-300 w-full md:w-2/3">
                    <div className="w-1/2 md:w-1/4">
                        <div onClick={() => linktoProduct()} className="flex m-2 h-32 md:h-56">{display_image()}</div>
                        <div className="md:hidden"> 
                        {counters}
                            {count === props.value.quantity ? <> 
                                <div className="font-bold text-center text-gray-500"> Total: ${props.value.totalOfferingCost} </div> </> :
                                <>
                                    <div className="font-bold text-center "> Total: ${multi2(props.value.unit_retail, count)}</div>
                                    <div>{changeUpdateMobile}</div>
                                </>
                            }   
                        </div>
                    </div>
                    
                    <div className="block text-lg w-2/3">
                        <div onClick={() => linktoProduct()} className="cursor-pointer m-4 text-md md:text-2xl font-extrabold hover:text-orange-500 underline">{props.value.product_name}</div>
                        <div className="m-4 text-md md:text-2xl font-extrabold pt-2">${props.value.unit_retail}</div>
                        {/* <div onClick={() => window.location.assign("/supplier/" + props.value.supplier_key)} className="pl-4 pt-2 cursor-pointer hover:text-orange-500 hover:underline">{props.value.supplier_name}</div>
                        <div className="pl-4">{rate}</div> */}
                        <button onClick={() => removeCartItem()} className="flex justify-center m-20 h-12 rounded hover:bg-orange-400 border-2 border-orange-500 px-5 font-bold md:hidden">Remove Item</button>                    

                    

                    </div>
                    <div className="hidden md:block md:w-1/4 justify-center ">
                        {counters}
                        {count === props.value.quantity ? <> 
                            <div className="font-bold text-center text-gray-500"> Total: ${props.value.totalOfferingCost} </div> </> :
                            <>
                                <div className="font-bold text-center "> Total: ${multi2(props.value.unit_retail, count)}</div>
                                <div>{changeUpdate}</div>
                                    </>
                                }
                
                        <button onClick={() => removeCartItem()} className="flex justify-center m-20 rounded hover:bg-orange-400 border-2 border-orange-500 px-5 font-bold">Remove Item</button>
                        
                    </div>
                </div>
                <div className="w-1/3 bg-gray-500">{Cart} I CAN'T, HELP!</div>
            </div>

        </div>
    </div> )
    
    return (<>
        {container}  
    </>);
}

export const CartItemCheckOut = (props) => {
    const rate = (
        <div className="block">
            <div className="flex">
                <div>Rating:</div>
                <div >&#9733;&#9733;&#9733;&#9733;&#9733;</div>
            </div>
        </div>
    );
    console.log(props)
    const linktoProduct = () => {
        window.location.assign("/product/" + props.value.product_key);
    }
    const container = (<div>
        <div className="flex w-full /*bg-yellow-400*/">
            <div className="flex rounded border border-black w-full">
                <div onClick={() => linktoProduct()} className="flex w-full h-48 md:w-1/4 md:h-56">{display_image()}</div>
                <div className="block text-lg w-full">
                    <div onClick={() => linktoProduct()} className="cursor-pointer m-4 text-md md:text-2xl font-extrabold  hover:text-orange-500 hover:underline">{props.value.product_name}</div>
                    <div className="m-4 text-2xl font-extrabold pt-2">${props.value.unit_retail}</div>
                    <div onClick={() => window.location.assign("/supplier/" + props.value.supplier_key)} className="pl-4 pt-2 cursor-pointer hover:text-orange-500 hover:underline">{props.value.supplier_name}</div>
                    <div className="pl-4">{rate}</div>
                </div>

                <div className="flex-none">
                    <div className="text-base md:text-xl font-bold text-right pt-4 pr-2">
                        Quantity: {props.value.quantity}
                    </div>
                    <div className="text-base md:text-xl font-bold text-right pt-4 pr-2">
                       Total Cost: ${props.value.totalOfferingCost}
                    </div>
                </div>
            </div>
        </div> 
    </div>)

    return (<>
        {container}
    </>);
}
