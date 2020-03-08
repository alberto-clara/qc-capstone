import React, { useState, useEffect } from 'react';
import axios from 'axios';
import display_image from './PicArray';
import FireBaseSetup from '../FireBaseSetup';
import { CartItemCheckOut } from './CartItem';
export const CheckOut = () => {
    const [ItemArray, setItemArray] = useState([]);
    const [load, setLoad] = useState(false);
    const [totalcost, setTotalCost] = useState(0);
    const [UserUID, setUserUID] = useState("");
    const [userToken, setUserToken] = useState("");
    useEffect(() => {
        document.title = `Home Depot - CheckOut`;
        FireBaseSetup.isInitialized().then(user => {
            if (user) {
                user.getIdToken().then(function (idToken) {  // <------ Check this line 
                    setUserToken(idToken); // It shows the Firebase token now
                    fetching(idToken);

                });
                setUserUID(user.uid);
                setLoad(true);
            }
        });

    }, [])
    const fetching = async (idToken) => {
        const Auth = 'Bearer '.concat(idToken);
        var config = {
            headers: {
                'Authorization': Auth
            }
        }
        await axios.get("http://localhost:7000/basket-api/basket/find", config).then((res) => {
            console.log(res);
            setTotalCost(res.data.total_cost);
            setItemArray(res.data.offerings);

        });
    }

    const ListItem =
        ItemArray.map(e => {
            return (<>
                <br />
                <CartItemCheckOut value={e} token={userToken} />
            </>);
        });


    return (<>
    <div className="h-auto">
        <div className=" titlePage pt-2 pb-4 lg:text-3xl"> Check Out</div>
        <div className="flex w-full">
            <div className="text-lg pl-2 md:text-2xl w-1/2">Shipping Address</div>
            
            <div className="text-sm pr-2 underline w-1/2 text-right">Change</div>
        </div>
        <hr className="m-2 pb-1 px-4 bg-orange-500"/>
        <div className="text-lg pl-2 md:text-2xl w-1/2">Payment Method</div>
        <hr className="m-2 pb-1 px-4 bg-orange-500"/>
        <div className="w-full">
            <div className="text-base md:text-xl pt-4 pl-2">Name on the Card</div>
            <input id="cardname" className="m-2 rounded border border-gray-600 h-10 px-5 pr-8 text-sm w-70 md:w-1/3" type="search" name="search"></input>
            <div className="text-base md:text-xl pt-4 pl-2">Card Number</div>
            <input id="cardname" className="m-2 rounded border border-gray-600 h-10 px-5 pr-8 text-sm w-70 md:w-1/3" type="search" name="search"></input>
            <div className="text-base md:text-xl pt-4 px-2 block md:w-1/3 md:flex">Expirantion Date MM/YY</div>
            <input id="cardname" className="m-2 block md:flex rounded border border-gray-600 h-10 px-5 pr-8 text-sm w-70 md:w-1/3" type="search" name="search"></input>
            <div className="text-base md:text-xl pt-4 pl-2 block md:flex">CSV</div>
            <input id="cardname" className="m-2 block md:flex rounded border border-gray-600 h-10 px-5 pr-8 text-sm w-70 md:w-1/3" type="search" name="search"></input>
        </div>
        <div className="text-lg pl-2 pt-4 md:text-2xl w-1/2">Order Review</div>
        <hr className="m-2 pb-1 px-4 bg-orange-500"/>
          
            {load ? ListItem : null}
            <hr /><hr />
            <div className="text-2xl">
                Total cost: {totalcost}
            </div>
        </div>
        <button onClick={() => { window.location.href = '/cart' }}  className="rounded h-12 w-70 md:h-12 m-2 md:w-64 bg-white border-black border-2 text-base" >Back to Cart</button>

        <button className="rounded h-12 w-70 md:h-12 m-2 md:w-64 bg-white border-black border-2 text-base" >Place Order</button>
         
        </>)
}