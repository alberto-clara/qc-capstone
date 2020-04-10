import React, { useState, useEffect } from 'react';
import { OrderHistory} from './OrderHistory';
import { TokenHeader, OrderHistoryLink,loader } from '../ListOfLinks';
import FireBaseSetup from '../FireBaseSetup';

import axios from 'axios';


export const ConfirmationPage = () => {
    const [productInfo, setProductInfo] = useState([]);
    const [email, setEmail] = useState("");
    const [load, setLoad] = useState(false);
    const [uid, setUID] = useState("");
    const [userToken, setUserToken] = useState("");
    useEffect(() => {
        FireBaseSetup.isInitialized().then(user => {
            if (user) {
                user.getIdToken().then(function (idToken) {  

                    setUserToken(idToken); // It shows the Firebase token now
                    fetch(idToken);
                });
                setUID(user.uid);
                setEmail(user.email);
            }
        });


    }, []);

    const page_title = (
        <div className="mt-4 justify-center w-full h-auto md:h-auto">
            <div className="titlePage py-2"> Your Order Is Confirmed! </div>
        </div>
    );    
    const fetch = async (idToken) => {
        await axios.get(OrderHistoryLink, TokenHeader(idToken)).then((res) => {
            console.log("hi");
            console.log(res.data.orders[0]);
            setProductInfo(res.data.orders[0]);
            setLoad(true);
        }).catch((err) => { });
    }

//  const ListItem =
//     productInfo.map(e => {
 //        return (<>
 //           <br />
//            <eachOffering value={e}  />
//         </>);
//     });

    return (
    <>
        <div>   
                <div> {page_title} </div>
            
                <div>Your Order Number:{productInfo.orderId} </div>
                <div>Your Total Cost:{productInfo.total_cost} </div>
               

        </div>

    </>
);
   }

const eachOffering = (props) => {
}