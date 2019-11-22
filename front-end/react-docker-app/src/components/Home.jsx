import React from 'react';
import '../css/mainTailwind.css';

import {Slider} from './AdSlide'

export function Home(props) {


    function fetching(response) {
        fetch("http://localhost:7000/catalog-api/products/page?pageSize=3&pageIndex=10", { mode: 'cors' })
            .then(res => res.json())
            .then((data) => {
                console.log(data)
            })
            .catch(console.log)
    }

    const homediv = (<div className="py-4 flex justify-center">
       
        <button className="bg-blue-200" onClick={fetching}> Fetching Data</button>
    </div>);


    const recommend = (<div className=" w-full h-64 ti:h-72 md:h-76 lg:justify-center  lg:px-20 pr-5 pl-5">
        <div className="font-bold">Label</div>
        <div className="px-4 bg-gray-200 ti:mx-4  md:mx-12 lg:mx-40 xl:px-32 ti:h-70 md:h-72 xl:h-78">
            <div className="flex border-2 h-56">
                <div className="bg-blue-400 w-1/2  ti:w-1/3 md:w-1/5 ti:h-70 md:h-72 xl:h-78">
                    <div className="bg-red-200 h-32 xl:h-48"> </div>
                </div>
                <div className="bg-blue-300 w-1/2 ti:w-1/3 md:w-1/5 ti:h-70 md:h-72 ">
                    <div className="bg-red-300 h-32 xl:h-48"></div>
                </div>
                <div className="bg-blue-700 hidden ti:block ti:w-1/3 md:w-1/5  ti:h-70 md:h-72">
                    <div className="bg-red-200 flex h-32 xl:h-48"> </div>
                </div>
                <div className="bg-blue-300 hidden md:block md:w-1/3 ti:h-70 md:h-72">
                    <div className="bg-red-300 h-32 xl:h-48"> </div>
                </div>
                <div className="bg-blue-200 hidden md:block md:w-1/3 ti:h-70 md:h-72">
                    <div className="bg-red-100 h-32 xl:h-48"> </div>
                </div>

            </div>

        </div>
        <div className="forgetText mr-1">See more</div>
    </div>);

    return (
        <div  >
            {homediv}
            <Slider /> 

            {recommend}
            {recommend}
        

        </div>
    );
}
