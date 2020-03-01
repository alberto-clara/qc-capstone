import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FireBaseSetup from '../FireBaseSetup';
import display_image from './PicArray';
import { CartItem } from './CartItem';

export const Cart = (props) => {
    const [UserUID, setUserUID] = useState("");
  
    const [ItemArray, setItemArray] = useState([]);
    const [load, setLoad] = useState(false);

    const [userToken, setUserToken] = useState("");
   
    useEffect(() => {
        document.title = `Home Depot - Cart`;
        FireBaseSetup.isInitialized().then(user => {
            if (user) {
                user.getIdToken().then(function (idToken) {  // <------ Check this line
                     //console.log(idToken);
                    setUserToken(idToken); // It shows the Firebase token now
                    fetching(idToken);

                });
                setUserUID(user.uid);
                setLoad(true);
            }
        });
      
        /*console.log(counterArray);*/
    }, []);
    const fetching = async (idToken) => {
        const Auth = 'Bearer '.concat(idToken);
        var config = {
            headers: {
                'Authorization': Auth
            }
        }
        await axios.get("http://localhost:7000/basket-api/basket/find",config).then((res) => {
            console.log(res.data.offerings);
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
            </div>
            : null
        }
        </>);
}
