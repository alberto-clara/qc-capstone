import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Collapse } from 'react-collapse';
import display_image from './PicArray';
import FireBaseSetup from '../FireBaseSetup';
import { CartItemCheckOut } from './CartItem';
import { GetCart, PlaceOrder, TokenHeader } from '../ListOfLinks';
import { auth } from 'firebase';

export const CheckOut = () => {

    const [ItemArray, setItemArray] = useState([]);
    const [load, setLoad] = useState(false);
    const [totalcost, setTotalCost] = useState(0);
    const [UserUID, setUserUID] = useState("");
    const [userToken, setUserToken] = useState("");
    const [isOpenS, setIsOpenS] = useState(true);
    useEffect(() => {
        document.title = `Home Depot - CheckOut`;
        FireBaseSetup.isInitialized().then(user => {
            if (user) {
                user.getIdToken().then(function (idToken) { 
                    setUserToken(idToken); 
                    fetching(idToken);

                });
                setUserUID(user.uid);
                setLoad(true);
            }
        });
    }, [])

    // Why is idToken called in line 34? Compare to what i did in line 43
    const fetching = async (idToken) => {
        await axios.get(GetCart, TokenHeader(idToken)).then((res) => {
            console.log(res);
            setTotalCost(res.data.total_cost);
            setItemArray(res.data.offerings);

        });
    }

    const PlaceOrderApi = async () => {
        console.log("Placing Loader", userToken);
        await axios.put(PlaceOrder, {}, TokenHeader(userToken)).then((res) => {});
    }

    const ListItem =
    ItemArray.map(e => {
        return (<>
            <br />
            <CartItemCheckOut value={e} token={userToken} />
        </>);
    });

    return (<>
    <div className="w-full block">
        <div className=" titlePage pt-4 lg:text-3xl"> Check Out</div>
        <div className="w-full md:w-1/3 md:float-right ">
            <div className="text-md md:text-xl font-extrabold text-center md:text-right py-4">Your Total Price: ${totalcost}</div>
            {/* <button onClick={() => { window.location.href = '/cart' }}  className="rounded h-12 w-70 md:h-12 m-2 md:w-64 bg-white border-orange-400 border-2 text-base" >Back to Cart</button> */}
            <div className="pb-4 m-2 md:m-0 md:float-right">
    <button onClick={PlaceOrderApi} className="w-full h-12 md:w-64 rounded border border-orange-500 text-base font-bold" >Place Order</button>
            </div>
            <hr className="md:hidden m-2 pb-1 px-4 bg-orange-500"/>
        </div>
        <div className="w-full md:w-2/3">
            <div className="text-lg pl-2 md:text-2xl w-1/2">Shipping Address</div>
            
            <div className="text-sm pr-2 underline text-right">Change</div>
     
        <hr className="m-2 pb-1 px-4 bg-orange-500"/>
        <div className="text-lg pl-2 md:text-2xl w-1/2">Payment Method</div>
        <hr className="m-2 pb-1 px-4 bg-orange-500"/>
        <div >
            <div className="text-base md:text-xl pt-4 pl-2">Name on the Card</div>
            <input id="cardname" className="m-2 rounded border border-gray-600 h-10 px-5 pr-8 text-sm w-70 " type="search" name="search"></input>
            <div className="text-base md:text-xl pt-4 pl-2">Card Number</div>
            <input id="cardname" className="m-2 rounded border border-gray-600 h-10 px-5 pr-8 text-sm w-70 " type="search" name="search"></input>
            <div className="text-base md:text-xl pt-4 px-2 block md:w-1/3 md:flex">Expirantion Date MM/YY</div>
            <input id="cardname" className="m-2 block md:flex rounded border border-gray-600 h-10 px-5 pr-8 text-sm w-70 " type="search" name="search"></input>
            <div className="text-base md:text-xl pt-4 pl-2 block md:flex">CSV</div>
            <input id="cardname" className="m-2 block md:flex rounded border border-gray-600 h-10 px-5 pr-8 text-sm w-70 " type="search" name="search"></input>
        </div>
    </div>
        <div onClick={() => setIsOpenS(!isOpenS)}  className="text-lg pl-2 pt-4 md:text-2xl w-1/2 cursor-pointer hover:text-orange-500">Order Review</div>
            <hr className="m-2 pb-1 px-4 bg-orange-500" />
            <Collapse isOpened={isOpenS}>
                {load ? ListItem : null}
                <hr /><hr />
               
            </Collapse>
            <div className="text-md md:text-xl font-extrabold text-center md:text-right py-4">Your Total Price: ${totalcost}</div>
            {/* <button onClick={() => { window.location.href = '/cart' }}  className="rounded h-12 w-70 md:h-12 m-2 md:w-64 bg-white border-orange-400 border-2 text-base" >Back to Cart</button> */}
            <div className="pb-4 m-2 md:m-0 md:float-right">
                <button className="w-full h-12 md:w-64 rounded border border-orange-500 text-base font-bold" >Place Order</button>
            </div>
        </div>

 
        </>)
}