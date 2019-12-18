import React, { useState, useContext } from "react";
import ReactModal from "react-modal";
import { useParams } from "react-router-dom";
import { useModal } from "react-modal-hook";
import axios from 'axios';
import { Product } from "./Product";
import {  VendorConsumer } from './VendorsContext'
const VendorContent = () => {
    let { id } = useParams();
    
    let productname = (<>
            <VendorConsumer>
            {props => {
                return (<div>
                  
                    <div>{() => { document.getElementById("containModal").innerHTML(props) }}</div>
                    </div>)
            }}
        </VendorConsumer> </>);
    
    const [totalVendor, setTotalVendor] = useState(0);
    const [load, setLoad] = useState(true);
    const fetching = async (ProductID) => {
        await axios.get("http://localhost:7000/catalog-api/products/offerings/" + ProductID).then((res) => {
            setTotalVendor(res.data.length);
            console.log(res.data.length);
        })
        setLoad(!load);
        return (<>hi</>);
    }
    console.log(productname);
    return (<>{productname}</>)
}
 
export const ModalInProductPage = () => {
    let { id } = useParams();
  
    const [showModal, hideModal] = useModal(
        () => (
        <ReactModal  isOpen>
            <p>Modal content</p>
            <div>{id}</div>
               
                <VendorConsumer>
                    {props => {
                        return (<div id="containModal" >
                            
                            <div>{props}</div>
                        </div>)
                    }}
                </VendorConsumer>
            <button onClick={hideModal}>Hide modal</button>
        </ReactModal>));

    return <button onClick={showModal}>show modal </button>
};