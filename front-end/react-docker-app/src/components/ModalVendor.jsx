import React, { useState, useContext,useEffect } from "react";
import ReactModal from "react-modal";
import { useParams } from "react-router-dom";
import { useModal } from "react-modal-hook";
import axios from 'axios';
import { Product } from "./Product";
import {  VendorConsumer } from './VendorsContext'

 
export const ModalInProductPage = () => {
    let { id } = useParams();
    const [arrayVendor, setVendor] = useState([]);
    const [load, setLoad] = useState(false);

    var resultSupplier = [];
    var resultRetail = [];
    var resultAll = [];
    let x = (
        < VendorConsumer >
            {props => {
               
                {
                    setVendor(props);
                    forEachArray(props);

                }
                console.log(resultSupplier);
            }}
        
        </VendorConsumer >);
    var forEachArray = (array) => {
        console.log("call");
        array.forEach(function (item) {
            resultSupplier.push(item.supplier);
            resultRetail.push(item.unit_retail);
            resultAll.push(item.supplier + "," + item.unit_retail+ "|||");
        })
    }

    const [showModal, hideModal] = useModal(
        () => (
        <ReactModal  isOpen>
            <p>Modal content</p>
                <button onClick={hideModal}>Hide modal</button>

                < VendorConsumer >
                    {props => {    
                        return (<div>
                            {props}
                           </div>
                            );
                    }
                     
                    }
                
                </VendorConsumer >
               
              
  
           
        </ReactModal>));

    return <button className="underline justify-center text-blue-400" onClick={showModal}>Other Vendors </button>
};