import React, { useState, useContext } from 'react';
import '../css/mainTailwind.css';
import { searchbar } from '../components/Home'

export function Product(props) {

    const side_pic = (
        // <div className="h-64 ti:h-72 md:h-76 lg:justify-center lg:px-50 pr-5 pl-5">
        //     <div className=" titlePage py-2 lg:text-3xl"> Product View </div>
        //     <div className="bg-gray-200 h-78 w-32 -my-px-40">
        //     <div className="py-4 flex justify-center bg-blue-200 md:h-70 w-100"></div>
        //     </div>

        // </div>
        <div class="relative bg-gray-400 h-64 ti:h-72 md:h-76 lg:justify-center lg:px-50 pr-5 pl-5">
            <div className=" titlePage py-2 lg:text-3xl"> Product View </div>
            <div class="static bg-gray-200 h-78 w-32 -my-px-40">
                Static parent

                <div class="bg-gray-400 inline-block">
                    Static sibling
                </div>
            </div>
        </div>


    );

    return (
        <div>
            {searchbar}
            {side_pic}
        </div>
    )
}
