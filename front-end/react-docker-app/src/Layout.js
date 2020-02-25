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
            <div className=" w-full max-w-6xl">
                {props.children}
            </div>
        </div>
        <br/>
        <div className="bg-orange-400">
            <div className="flex justify-center bg-orange-600">Footer </div>
            <div className=" flex justify-center">
                <div className=" w-1/4 border text-center border-black bg-orange-400 h-64">Customer Service</div>
                <div className=" w-1/4 border text-center border-black bg-orange-300 h-64">Resources</div>
                <div className=" w-1/4 border text-center border-black bg-orange-400 h-64">About Us</div>
                <div className=" w-1/4 border text-center border-black bg-orange-300 h-64"> Other</div>
            </div>
            
        </div>
    </>
);