import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FireBaseSetup from '../FireBaseSetup';
import display_image from './PicArray';
import { CartItem } from './CartItem';

export const Cart = (props) => {
    const [UserUID, setUserUID] = useState("");
    const [count, setCount] = useState(1);
    const [ItemArray, setItemArray] = useState([]);
    const [load, setLoad] = useState(false);
    var [counterArray, setCounterArray] = useState([]);
    var numberItem = 3;
   
    useEffect(() => {
        document.title = `Home Depot - Cart`;
        FireBaseSetup.isInitialized().then(user => {
            if (user) {
                setUserUID(user.uid);
                setLoad(true);
            }
        });
        
        /*console.log(counterArray);*/
    }, []);

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
    var exampleItem = [{ name: "cat", price: "20" }, { name: "dog", price: "30" }, { name: "mouse", price: "10" }]
    const ListItem =
        exampleItem.map(e => {
        return (<>
            <CartItem value={e} />
        </>);
    });
 
    return (<>
        {load ?
            <div>
                <div className="mt-4 justify-center w-full /*bg-blue-400*/">
                    <div className=" titlePage pt-2 pb-4 lg:text-3xl"> My Cart </div>
                </div>
                <div>
                    {ListItem}
                </div>
            </div>
            : null
        }
        </>);
}
