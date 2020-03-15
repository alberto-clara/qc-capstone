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
    const container = (<div>
            <div className="mt-4 justify-center w-full /*bg-blue-400*/">
                <div className="titlePage py-2 lg:text-3xl"> My Cart </div>
            </div>
            <div>
                {ListItem}
            </div>
        <br />
        <div className="text-xl font-extrabold text-right">Your Total Price: ${totalcost}</div>
            <div className="w-full justify-center flex">
                <button onClick={() => { window.location.href = '/checkout' }} className="text-center text-2xl text-white w-1/3 bg-orange-500 border-orange-500 border-2">Check Out</button>
            </div>
            <br />
        </div>);
      
    return (<>
        {load ? container : null}
        </>);
        }
