import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import FireBaseSetup from '../FireBaseSetup';
import { searchbar } from '../components/Home';
import display_image from './PicArray';
import { Api_Request } from './SupplierPageHelper';
import { loader } from '../ListOfLinks';

export const SupplierPage = () => {
    let { ids } = useParams();
    const [UserUID, setUserUID] = useState("");
    var [productName, setProductName] = useState('');
    var [vendor, setVendor] = useState('');

    useEffect(() => {
        document.title = `Home Depot - Supplier`;
        FireBaseSetup.isInitialized().then(user => {
            if (user) {  
                setUserUID(user.uid);
            }
        });

    }, []);

    function Test (items) {
        var nest = items.data
        console.log("????: ", nest)
        const dis = nest.map(info => {
            // console.log("info", info)
            return(
                <div key={info.offering_key}>
                    <div className="border rounded border-gray-300 flex w-full">
                        <div className="block w-1/2 h-auto md:h-48 m-2 md:w-1/6 md:h-48">{display_image()}</div>
                        <div className="h-auto md:h-48 m-2">          
                            <div className="text-lg md:text-2xl font-extrabold">{info['product_name']}</div>
                            <div className="text-base pt-4 md:text-2xl">${info['unit_retail']} </div>  
                        </div>
                    </div>
                </div>
            );
        })
        return (dis);
    }


    function Display() {

        const api_Call = Api_Request("http://localhost:7000/catalog-api/products/supplier/" + ids);
        const error = api_Call[0];
        const isLoaded = api_Call[1];
        const items = api_Call[2];

        console.log("MY API CALL: ", api_Call, error, isLoaded, items)


        if (error) {
            return(
                <div>
                    Error: {error.message}
                </div>
            );
        } else if (isLoaded && items) {
    
            console.log("Ourdata: ", items.data[0].product_name)
    
            const page_title = (
                <div className="mt-4 justify-center w-full h-auto md:h-auto">
                    <div className=" titlePage py-4 lg:text-3xl"> Products By {items.data[0].supplier_name} </div>
                </div>
            );  
            const linktoItem = (itemId) => {
                window.location.assign("/offering/" + itemId);
            }
    
            return (<>
                {searchbar}
                {page_title}
                <div className="flex w-full">
                   <div>{Test(items)}</div> 
                </div>
                
                </>);
        } else {
            return(
                <div className="cntainer">{loader}</div>
                
            );
        }
    }

    return (<>

        {Display()}
    </>
    )

}
