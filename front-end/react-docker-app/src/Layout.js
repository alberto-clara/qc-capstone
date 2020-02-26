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

            <div className="flex justify-center px-4 lg:px-0 bg-gray-200 ">
                <div className=" bg-white w-full max-w-6xl">
                    {props.children}
                </div>
            </div>
       
        <div className="bg-gray-200 h-16 py-16" />
        
            <div className="bg-orange-500 h-50">
                <div className="flex justify-center px-4 lg:px-0">
                    <div className="bg-orange-400 w-full max-w-6xl  ">
                   
                        <div className=" flex justify-center">
                            <div className=" w-1/4 border text-center border-black bg-orange-400 h-50">Customer Service</div>
                            <div className=" w-1/4 border text-center border-black bg-orange-300 h-50">Resources</div>
                            <div className=" w-1/4 border text-center border-black bg-orange-400 h-50">About Us</div>
                            <div className=" w-1/4 border text-center border-black bg-orange-300 h-50"> Other</div>
                        </div>
                    
                    
                    
                    </div> 
                    
                </div>
                <div className="text-center bg-orange-600 text-xl  border-black h-12 w-full">
                    <div>Copy Right &copy; 2019-2020</div>
                    <div>WSU-CAPSTONE Group Project</div>
                </div>
            </div>
      
    </>
);