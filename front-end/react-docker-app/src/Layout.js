import React from 'react';
import NavTitle from './NavTitle';
import NavMenu from './NavMenu';

export default props => (
    <>
        <div className="bg-orange-500 max-w-full">
            <div className="flex justify-center">
                <div className="flex-1 bg-green-500 max-w-6xl">
                    <NavTitle />
                </div>
            </div>
        </div>
        <div className="bg-orange-600 max-w-full">
            <div className="flex justify-center">
                <div className="flex-1 bg-purple-400 max-w-6xl">
                    <NavMenu />
                </div>
            </div>
        </div>

        <div className="flex justify-center px-4 lg:px-0">
            <div className=" bg-white w-full max-w-6xl min-h-screen">
                {props.children}
            </div>
        </div>
       
        {/* <div className="bg-gray-200 h-16 py-16" /> */}
        
        {/*    <div className="bg-orange-500 h-50">*/}
               
        <div className="bottom_bar text-center text-sm text-white bg-orange-500 py-2 w-full">
            <div>WSU-CAPSTONE Group Project</div>
            <div>Product Authority, LLC. All Rights Reserved </div>
            <div>Privacy & Conditions &copy; 2019-2020</div>
        </div>
            
      
    </>
);