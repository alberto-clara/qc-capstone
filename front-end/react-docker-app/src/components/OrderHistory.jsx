import React from 'react';
import axios from 'axios';

export const OrderHistory = (props) => {
    console.log(props);
    
    return (<>
    <div className="flex">
        <div className="text-xl">Order Number {props.value.orderId}</div>
        <div className="text-lg">Date: {props.value.date}</div>
    </div>
         <div className="bg-green-200">ProductName: {props.value.offerings[0].product_name}</div>
              <div className="bg-green-200">ProductName: {props.value.offerings[1].product_name}</div>
     
        <div className="bg-blue-200">Quantity: {props.value.total_items}</div>
        {/* <div className="bg-green-500">Supplier: {props.value.offerings[0].supplier_name}</div> */}
        <div className="bg-red-200">Price: ${props.value.total_cost}</div>
        
        </>
    );
}
