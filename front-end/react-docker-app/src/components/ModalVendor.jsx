import React from "react";
import ReactModal from "react-modal";
import { useModal } from "react-modal-hook";
import {  VendorConsumer } from './VendorsContext'

 
export const ModalInProductPage = () => {
    const [showModal, hideModal] = useModal(
        () => (
        <ReactModal  isOpen>
                <div className="flex justify-end"><button onClick={hideModal}>Close Modal</button></div>
                < VendorConsumer >
                    {props => {
                        return (<div className="flex justify-center">
                            {props}
                        </div>
                        );
                    }}
                </VendorConsumer >
        </ReactModal>));

    return <button className="underline justify-center text-blue-400" onClick={showModal}>Other Vendors </button>
};