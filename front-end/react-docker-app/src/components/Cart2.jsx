import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FireBaseSetup from '../FireBaseSetup';
import display_image from './PicArray';
import { CartItem } from './CartItem';


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
                user.getIdToken().then(function (idToken) {  // <------ Check this line 
                    setUserToken(idToken); // It shows the Firebase token now
                    fetching(idToken);

                });
                setUserUID(user.uid);
                setLoad(true);
            }
        });

    }, []);
    const fetching = async (idToken) => {
        const Auth = 'Bearer '.concat(idToken);
        var config = {
            headers: {
                'Authorization': Auth
            }
        }
        await axios.get("http://localhost:7000/basket-api/basket/find",config).then((res) => {
            console.log(res);
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
 
    return (<>
        {load ?
            <div>
                <div className="mt-4 justify-center w-full /*bg-blue-400*/">
                    <div className=" titlePage pt-2 pb-4 lg:text-3xl"> My Cart </div>
                </div>
                <div>
                    {ListItem}
                </div>
                <br />
                <div className="w-full justify-center flex">
                    <button onClick={() => { window.location.href ='/checkout' }} className="text-center text-2xl text-white w-1/3 bg-orange-500 border-orange-500 border-2">Check Out</button>
                </div>
                <br />
                <div>Total Price: ${totalcost}</div>
            </div>
            : null
        }
        </>);
}
