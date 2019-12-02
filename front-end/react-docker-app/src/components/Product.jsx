import React, { useState,useEffect } from 'react';
import '../css/mainTailwind.css';
import Collapsible from 'react-collapsible';
import { searchbar } from '../components/Home';
import { useParams } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import axios from 'axios';

export  const Product = (props) =>{

    let { id } = useParams();
    const [productName, setProductName] = useState('');
    const [unitcost, setUnitCost] = useState('');
    const [description, setDescription] = useState('');
    const [count, setCount] = useState(1);
    const [vendor, setVender] = useState('');

    useEffect(() => {
        document.title = `Home Depot - Product`;
        fetching(id);
    }, []);

    const fetching = async (ProductID) => {

        await axios.get("http://localhost:7000/catalog-api/products/offerings/" + ProductID).then((res) => {
            console.log(res.data[0]);
            setProductName(res.data[0].product_name);
            setUnitCost(res.data[0].unit_retail);
            setVender(res.data[0].supplier_name);
            setDescription(res.data[0].long_description);
        })
    }
    
    const page_title = (

        <div className="mt-4 justify-center w-full h-auto md:h-auto">
            <div className=" titlePage py-2 lg:text-3xl"> Product View </div>
        </div>
    );     
    
    const counters = (
        
        <div className="justify-center m-20 rounded hover:bg-gray-300 h-11 border-2 border-orange-500">
            <div className="flex font-semibold hover:text-black focus:text-black text-gray-700" >
                <button onClick={() => { 
                    setCount(count - 1); 
                    if (count == 1) { setCount(1) } 
                    }} class=" flex justify-center rounded text-gray-600 hover:text-gray-700 hover:bg-orange-400 h-full w-1/3 border-r-2 border-orange-500">
                    <div class="flex items-center text-2xl h-10">-</div>
                </button>

                <div type="number" className="h-10 font-semibold flex justify-center text-gray-700 w-1/3 items-center text-2xl" >
                    {count}
                </div>

                <button onClick={() => setCount(count + 1)} class="flex justify-center rounded text-gray-700 hover:text-gray-700 hover:bg-gray-400 h-full text-right w-1/3 border-l-2 border-orange-500">
                    <div class="flex items-center text-2xl h-10">+</div>
                </button>
            </div> 
        </div>
    );

    const side_pic = (
        
        <div>
            <div className="justify-center flex px-35 pl-5 pr-5">
                <Carousel axis="horizontal" showThumbs={true} showArrows={true} >
                    <img src="http://lorempixel.com/output/cats-q-c-640-480-1.jpg" />
                    <img src="http://lorempixel.com/output/cats-q-c-640-480-2.jpg" />
                </Carousel>
            </div>  
         
        </div>
        );
        
    const NameVendorCost = (
        
        <div className=" pl-6 lg:text-7xl ">
            <div className="text-xl font-thin"> {productName}</div>
            <div className="flex text-lg font-extrabold ">
                <div className="w-3/5 ">
                    <div className="flex">
                        <div className="pr-2">Rating</div>
                        <div >&#9733;&#9733;&#9733;&#9733;&#9733;</div>
                    </div>
                    <div className="flex">
                        <div className="pr-2">{vendor}</div>
                        <div >${unitcost}</div>
                    </div>

                </div>

                <div className="w-2/5 ">
                    <button className="rounded hover:bg-gray-300 border-2 border-orange-500 px-5 text-base h-12 justify-center h-12 mr-12"> Other Vendors</button>
                </div>
            </div>
        </div>
    );

 
        return (
        <div>
            {searchbar}
            {page_title}
           <div className="lg:mx-70 ">
                <div className=" lg:flex">
                     <div className="lg:w-1/2">
                            {side_pic}  
                     </div>
                      <div className="lg:w-1/2 lg:pt-40 ">
                            {NameVendorCost}
                            <div className="flex">
                                <div className="w-1/2 justify-center">
                                    {counters}
                                </div>
                                <div className="flex justify-center w-1/2 h-11">
                                    <button className=" m-20 rounded hover:bg-gray-300 border-2 border-orange-500 px-5 text-sm">Add to Cart  </button>
                                </div>

                            </div>
                      </div>
                </div>
            

           
        
            {/* specifications */}
            <div className="justify-center flex lg:px-35 pl-5 pr-5">
                <div class="rounded w-full lg:w-full border-2 border-orange-500 bg-white px-5 pr-8 text-sm" >
                    <Collapsible className="h-10" trigger="Specifications">
                        <div className="border-t-2 border-orange-500"> {description} </div>
                    </Collapsible>
                </div>
            </div>

            {/* Reviews */}
            <div className="justify-center flex lg:px-35 pl-5 pr-5">
                <div class="rounded w-full lg:w-full border-2 border-orange-500 bg-white px-5 pr-8 text-sm" >
                    <Collapsible className=" h-10" trigger="Review">
                        <div >{description} </div>
                    </Collapsible>
                </div>
            </div>

            {/* QA */}
            <div className="justify-center flex lg:px-35 pl-5 pr-5">
                <div class="rounded w-full lg:w-full border-2 border-orange-500 bg-white px-5 text-sm" >
                    <Collapsible className=" h-10" trigger="Question and Answers">
                        <div >{description} </div>
                    </Collapsible>
                </div>
             </div>
        </div>
    </div>
    )
}
