import React from 'react';

export const OrderHistory = (props) => {

    return (<>
        <div className="bg-green-200">ProductName: {props.value.offerings[0].product_name}</div>
        <div className="bg-blue-200">Quantity: {props.value.offerings[0].quantity}</div>
        <div className="bg-green-500">Supplier: {props.value.offerings[0].supplier_name}</div>
        <div className="bg-red-200">Price: ${props.value.total_cost}</div>
        <div className="bg-blue-600">Date: ${props.value.date}</div>
        </>
    );
}
