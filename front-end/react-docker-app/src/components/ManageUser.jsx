import React from 'react';
import { Link } from "react-router-dom";

export const ManagePage = (props) => {
    

    const page_title = (
        <div className="mt-4 justify-center w-full h-auto md:h-auto">
            <div className=" titlePage py-2 lg:text-3xl"> My Account </div>
        </div>
    );     
    
    const my_address = (
        <div className="justify-center w-full">
            <div className="pt-4 text-xl">Name</div>
            <div className="justify-center flex text-gray-600 w-full">
                <input className="h-10 rounded border-2 border-orange-500 bg-white w-full"></input>
            </div>
            <div className="pt-4 text-xl">Address</div>
            <div className="justify-center flex text-gray-600 w-ful">
                <input className="h-10 rounded border-2 border-orange-500 bg-white w-full"></input>
            </div>
            <div className="pt-4 text-xl">Phone</div>
            <div className="justify-center flex text-gray-600 w-full">
                <input className="h-10 rounded border-2 border-orange-500 bg-white w-full"></input>
            </div>
            <div className="pt-4 text-xl">Zip Code</div>
            <div className="justify-center flex text-gray-600 w-full">
                <input className="h-10 rounded border-2 border-orange-500 bg-white w-full"></input>
            </div>
            <div className="justify-center flex text-gray-600 w-full pt-4">
                <button type="submit" className="px-4 py-2 border-2 rounded text-gray-700 border-orange-500 bg-white hover:border-orange-500">
                Submit Changes
                </button>
            </div>    
        </div>
    );

    const my_password = (
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
                Submit Changes
                </button>
            </div>   
        </>
    );
    
       const left_menu = (
           <div className="justify-center w-full rounded border-2 border-orange-500 bg-white">
                <Link> <div className="underline"></div>My Password</Link>
                <Link> <div className="underline"></div>My Address</Link>
                <Link> <div className="underline"></div>My Order</Link>
                <Link> <div className="underline"></div>My Cart</Link>
                <Link> <div className="underline"></div>Help</Link>
           </div>
       )

    return (
        <> 
        {page_title}
        <div className="flex justify-center w-full">
        <div className="w-1/4 pt-10">{left_menu}</div>
        <div className="w-1/4 pt-10"></div>
        <div className="lg:hidden"></div>
        <div className="w-1/2">{my_address}</div>
        </div>
        <div className="w-1/2">{my_password}</div>
         
        </>)
}
