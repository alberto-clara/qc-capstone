import React, { useState, useEffect } from 'react';

export const tryFetch = () => {
    axios.get("http://localhost:7000/catalog-api/products/home").then((res) => {

        for (var i = 0; i < res.data.length; i++) {
            initValue.push({ id: res.data[i].id, product_name: res.data[i].product_name });
        }
        setAdItems(initValue);
        console.log("GOT HERE", initValue[0].product_name);
        setLoad(true);
    })
    return (<div><SwipeableViews enableMouseEvents>
        <div className=" h-76 flex w-full border-2">
            <div className="bg-blue-300 w-1/2 ti:w-1/3 md:w-1/5 ti:h-70 md:h-72 border-2">
                <div className="flex bg-red-300 h-32 xl:h-48 justify-center items-center"> picture </div>
                <div className="flex justify-center items-center"> aaaa </div>
            </div>
            <div className="bg-blue-300 w-1/2 ti:w-1/3 md:w-1/5 ti:h-70 md:h-72 border-2">
                <div className="flex bg-red-300 h-32 xl:h-48 justify-center items-center"> picture </div>
                <div className="flex justify-center items-center"> product name </div>
            </div>
            <div className="bg-blue-700 hidden ti:block ti:w-1/3 md:w-1/5  ti:h-70 md:h-72 border-2">
                <div className="flex bg-red-200 flex h-32 xl:h-48 justify-center items-center"> picture </div>
                <div className="flex justify-center items-center"> product name </div>
            </div>
            <div className="bg-blue-300 hidden md:block md:w-1/3 ti:h-70 md:h-72 border-2">
                <div className="flex bg-red-300 h-32 xl:h-48 justify-center items-center"> picture </div>
                <div className="flex justify-center items-center"> product name </div>
            </div>
            <div className="bg-blue-200 hidden md:block md:w-1/3 ti:h-70 md:h-72 border-2">
                <div className="flex bg-red-100 h-32 xl:h-48 justify-center items-center"> picture </div>
                <div className="flex justify-center items-center"> product name </div>
            </div>

        </div>
        <div className=" h-76 flex w-full border-2">
            <div className="bg-blue-300 w-1/2 ti:w-1/3 md:w-1/5 ti:h-70 md:h-72 border-2">
                <div className="flex bg-red-300 h-32 xl:h-48 justify-center items-center"> picture </div>
                <div className="flex justify-center items-center"> product name </div>
            </div>
            <div className="bg-blue-300 w-1/2 ti:w-1/3 md:w-1/5 ti:h-70 md:h-72 border-2">
                <div className="flex bg-orange-300 h-32 xl:h-48 justify-center items-center"> picture </div>
                <div className="flex justify-center items-center"> product name </div>
            </div>
            <div className="bg-blue-700 hidden ti:block ti:w-1/3 md:w-1/5  ti:h-70 md:h-72 border-2">
                <div className="flex bg-red-200 flex h-32 xl:h-48 justify-center items-center"> picture </div>
                <div className="flex justify-center items-center"> product name </div>
            </div>
            <div className="bg-blue-300 hidden md:block md:w-1/3 ti:h-70 md:h-72 border-2">
                <div className="flex bg-orange-300 h-32 xl:h-48 justify-center items-center"> picture </div>
                <div className="flex justify-center items-center"> product name </div>
            </div>
            <div className="bg-blue-200 hidden md:block md:w-1/3 ti:h-70 md:h-72 border-2">
                <div className="flex bg-red-100 h-32 xl:h-48 justify-center items-center"> picture </div>
                <div className="flex justify-center items-center"> product name </div>
            </div>

        </div>
        <div className=" h-76 flex w-full border-2">
            <div className="bg-green-300 w-1/2 ti:w-1/3 md:w-1/5 ti:h-70 md:h-72 border-2">
                <div className="flex bg-red-300 h-32 xl:h-48 justify-center items-center"> picture </div>
                <div className="flex justify-center items-center"> product name </div>
            </div>
            <div className="bg-blue-300 w-1/2 ti:w-1/3 md:w-1/5 ti:h-70 md:h-72 border-2">
                <div className="flex bg-green-300 h-32 xl:h-48 justify-center items-center"> picture </div>
                <div className="flex justify-center items-center"> product name </div>
            </div>
            <div className="bg-green-700 hidden ti:block ti:w-1/3 md:w-1/5  ti:h-70 md:h-72 border-2">
                <div className="flex bg-red-200 flex h-32 xl:h-48 justify-center items-center"> picture </div>
                <div className="flex justify-center items-center"> product name </div>
            </div>
            <div className="bg-blue-300 hidden md:block md:w-1/3 ti:h-70 md:h-72 border-2">
                <div className="flex bg-green-300 h-32 xl:h-48 justify-center items-center"> picture </div>
                <div className="flex justify-center items-center"> product name </div>
            </div>
            <div className="bg-green-200 hidden md:block md:w-1/3 ti:h-70 md:h-72 border-2">
                <div className="flex bg-red-100 h-32 xl:h-48 justify-center items-center"> picture </div>
                <div className="flex justify-center items-center"> product name </div>
            </div>

        </div>
    </SwipeableViews>    </div>)
}