import React, { useState } from 'react';
import { Collapse } from 'react-collapse';

export const OrderHistory = (props) => {
    var offerArray = props.value.offerings;
    const [isOpen, setIsOpen] = useState(false);
    return (<>
        <div onClick={() => setIsOpen(!isOpen)} className="bg-gray-200 cursor-pointer hover:font-bold" > OrderID: {props.value.orderId}</div>
        <Collapse isOpened={isOpen}>
            <br/>
            <EachOffer orderID={props.value.orderId} offerings={offerArray} />
            <br />
        </Collapse >
        <div className="bg-red-200">Price: ${props.value.total_cost}</div>
        <div className="bg-blue-600">Date: ${props.value.date}</div>
        </>
    );
}

const EachOffer = (props) => {
    const array = props.offerings;
    const container = array.map(e => (<>
        <div className="flex">
            <div>Product: {e.product_name}</div>
            <div>Price: ${e.unit_retail}</div>
            <div>Quantity: {e.quantity}</div>
        </div>
    </>));
    return (<>
        {container}
        </>)
}
