import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FireBaseSetup from '../FireBaseSetup';
import display_image from './PicArray';
import { CartItem } from './CartItem';
import { GetCart, TokenHeader } from '../ListOfLinks';


export const Cart = (props) => {
    const [UserUID, setUserUID] = useState("");
    const [ItemArray, setItemArray] = useState([]);
    const [load, setLoad] = useState(false);
    const [totalcost, setTotalCost] = useState(0);
    const [userToken, setUserToken] = useState("");

    useEffect(() => {
        document.title = `Home Depot - Cart`;
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
    }, []);
    const fetching = async (idToken) => {

        await axios.get(GetCart, TokenHeader(idToken)).then((res) => {
            var tempTotalCost = res.data.total_cost;
            setTotalCost(res.data.total_cost);
            setItemArray(res.data.offerings);
         
        });
    }
    const ListItem =
        ItemArray.map(e => {
            return (<>
            <br/>
                <CartItem value={e} token={userToken} />
        </>);
        });
    const container = (
        <div>
            <div className="mt-4 justify-center w-full">
                <div className="titlePage py-2 lg:text-3xl"> My Cart </div>
            </div>
            <div className="md:hidden w-full justify-center flex">
                            <button onClick={() => { window.location.href = '/checkout' }} className="flex justify-center h-12 w-full border rounded border-orange-500 px-5 font-bold">Go To Check Out</button>
                        </div>
            <div className="block md:flex">
                <div className=" w-full md:w-2/3">
                    {ListItem}
               </div>
                <div className="w-full md:w-1/3">
                    <div className=" mx-2 my-8 ">
                        <div className="text-xl font-extrabold m-4 text-center">Your Total Price: ${totalcost}</div>
                        <div className="w-full justify-center flex">
                            <button onClick={() => { window.location.href = '/checkout' }} className="w-full h-12 md:w-64 rounded border border-orange-500 text-base font-bold">Check Out</button>
                            {/* <button onClick={() => { window.location.href = '/checkout' }} className="flex justify-center h-12 w-full rounded bg-orange-500 text-white px-5 font-bold">Check Out</button> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>);
      
    return (<>
        {load ? container : null}
        </>);
        }
