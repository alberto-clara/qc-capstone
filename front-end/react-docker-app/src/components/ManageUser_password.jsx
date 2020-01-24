import React, { useState, useEffect } from 'react';
import FireBaseSetup from '../FireBaseSetup';
import axios from 'axios';
import { Link } from 'react-router-dom';

export const ManageUser_password = (
    <>
    <div className="pt-4 text-xl">Old Password</div>   
    <div className="justify-center flex text-gray-600 w-full">
        <input className="h-10 rounded border-2 border-orange-500 bg-white w-full"></input>
    </div>
    <div className="pt-4 text-xl">New Password</div>   
    <div className="justify-center flex text-gray-600 w-full">
        <input className="h-10 rounded border-2 border-orange-500 bg-white w-full"></input>
    </div>
    <div className="pt-4 text-xl">Confirm New Password</div>   
    <div className="justify-center flex text-gray-600 w-full">
        <input className="h-10 rounded border-2 border-orange-500 bg-white w-full"></input>
    </div>
    <div className="justify-center flex text-gray-600 w-full pt-4">
            <button type="submit" className="px-4 py-2 border-2 rounded text-gray-700 border-orange-500 bg-white hover:border-orange-500">
           Edit
            </button>
        </div>   
    </>
); 

const left_menu = (
    <div className="justify-center w-full rounded border-2 border-orange-500">
        {/* <div className="underline">{uid}</div>
        <div className="underline">{email}</div> */}
        <div className="justify-center flex text-gray-600 w-full pt-4">
             <button type="submit" className="underline">
                     My information
             </button>
         </div>   
         <div className="justify-center flex w-full pt-4">
         <Link to={'/mypassword'}>
             <div className="underline text-gray-600">
                My Password
             </div>
         </Link>
         </div>   
         <div className="justify-center flex w-full pt-4">
         <Link to={'/manageuser/myorders'}>
             <div className="underline text-gray-600">
                My Orders
             </div>
         </Link>
         </div>   
         <div className="justify-center flex w-full pt-4">
         <Link to={'/manageuser/mywishlist'}>
             <div className="underline text-gray-600">
                My Wishlist
             </div>
         </Link>
         </div>   
         <div className="justify-center flex w-full pt-4">
         <Link to={'/help'}>
             <div className="underline text-gray-600">
                Help
             </div>
         </Link>
         </div>   
         <div className="justify-center flex text-gray-600 w-full pt-8 pb-4">
             <button type="submit" className="underline">
                     Log Out
             </button>
         </div> 
       
    </div>
);
