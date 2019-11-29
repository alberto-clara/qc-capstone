import React, { useState,useEffect } from 'react';
import '../css/mainTailwind.css';
import { searchbar } from '../components/Home';
import { useParams } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import axios from 'axios';
export  const Product = (props) =>{
    let { id } = useParams();
    const [productName, setProductName] = useState('');
    const [description, setDescription] = useState('');
    useEffect(() => {
        document.title = `Home Depot - Product`;
        fetching(id);
    }, []);
    const fetching = async (ProductID) => {
        await axios.get("http://localhost:7000/catalog-api/products/" + ProductID).then((res) => {
            console.log(res.data);
            setProductName(res.data.product_name);
            setDescription(res.data.long_description);
        })
    }
    const page_title = (
        <div className="mt-4 justify-center w-full h-auto md:h-auto">
            <div className=" titlePage py-2 lg:text-3xl"> Product View </div>
            <div className="titlePage"> {productName}</div>
        </div>
    );

    const side_pic = (
        <div className="justify-center flex lg:px-35 pl-5 pr-5">
            <Carousel axis="horizontal" showThumbs={true} showArrows={true} >
                <img src="http://lorempixel.com/output/cats-q-c-640-480-1.jpg" /><div>
                    <img src="http://lorempixel.com/output/cats-q-c-640-480-2.jpg" />
                    {/* <p className="legend">Legend 2</p> */}
                </div>
            </Carousel>
        </div>
    );

    const specifications = (
        <div className="justify-center lg:px-35 pl-5 pr-5">
            <a href="#" className="rounded w-full lg:w-1/2 border-2 border-orange-500 bg-white h-10 px-5 pr-8 text-sm" >Item Specifications</a>
            <div>{description} </div>
        </div>
    );

    const reviews = (
        <div className="justify-center flex lg:px-35 pl-5 pr-5">
            <a href="#" class="rounded w-full lg:w-1/2 border-2 border-orange-500 bg-white h-10 px-5 pr-8 text-sm">Reviews</a>
        </div>
    );

    const questions = (
        <div className="justify-center flex lg:px-35 pl-5 pr-5">
            <a href="#" class="rounded w-full lg:w-1/2 border-2 border-orange-500 bg-white h-10 px-5 pr-8 text-sm">Question and Answers</a>
        </div>
    );
   

    return (
        <div>
            {searchbar}
            {page_title}
            <div className="flex justify-center">
                {side_pic}
            </div>
            {specifications}
            {reviews}
            {questions}
        </div>
    )
}
