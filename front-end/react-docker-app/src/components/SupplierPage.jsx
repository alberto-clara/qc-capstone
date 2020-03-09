import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import FireBaseSetup from '../FireBaseSetup';
import { searchbar } from '../components/Home';
import display_image from './PicArray';
import { Api_Request } from './SupplierPageHelper';


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
        const alberto = nest.map(info => {
            console.log("info", info)
            return(
                <div key={info.offering_key}>
                    <div>
                        <div className="text-center">
                            { console.log("pr name: ", info['product_name']) }
                            {info['product_name']}
                        </div>
                    </div>
                </div>
            );
        })
        return (alberto);
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
                    <div className=" titlePage py-2 lg:text-3xl"> Products By {items.data[0].supplier_name} </div>
                </div>
            );  
    
            return (<>
                {searchbar}
                {page_title}
                <div className="flex w-full ">
                    {/* <div  className="bg-gray-500 hover:bg-orange-200 w-1/2 md:w-1/5 "> */}
                        {/* <div>{display_image()}</div> */}
                        {/* {prodc_name} */}
                    {/* </div> */}
                    {Test(items)}
                </div>
                
                </>);
        } else {
            return(
                <div className="cntainer">Loading</div>
            );
        }
    }

    return (<>

        {Display()}
    </>
    )

}
