import * as React from 'react';
import { useState } from 'react';
import { Collapse } from 'react-collapse';

export const OrderHistory = (props) => {
    var offerArray = props.value.offerings;
    const [isOpen, setIsOpen] = useState(false);
    console.log(props.value);
    return (<>
        {/* <hr/> */}
            <div className="border m-2">
                <div onClick={() => setIsOpen(!isOpen)} className="ml-2 pt-2 text-md md:text-lg" >Date: {props.value.date}</div>
                <div onClick={() => setIsOpen(!isOpen)} className="ml-2 items-right text-sm font-underline" > Order#: {props.value.orderId}</div>  

            <Collapse isOpened={!isOpen}>  
            <hr/>  
                <EachOffer orderID={props.value.orderId} offerings={offerArray} />
                <br/>
                <div className="mr-2 text-right">Total Items: {props.value.total_items}</div>
                <div className="mr-2 text-right">Total Price: ${props.value.total_cost}</div>
            </Collapse >
            </div>
        {/* <hr/>        */}
        </>
    );
}
const linktoItem = (itemId) => {
    window.location.assign("/offering/" + itemId);
}
const EachOffer = (props) => {
    const array = props.offerings;
    console.log(props.value);
    const container = array.map(e => (<>
        <div className="block md:flex m-2">
            <div onClick={() => linktoItem(e.product_key)} className="w-full md:w-1/2 ">
                <div className="underline" > {e.product_name}</div>
            </div>
            <div className="w-full md:w-1/2 md:text-center">Quantity: {e.quantity}</div>
            <div className="w-full md:w-1/2 md:text-right ">Price: ${e.unit_retail}</div>
        </div>
    </>));
    return (<>
        {container}
        </>)
}
