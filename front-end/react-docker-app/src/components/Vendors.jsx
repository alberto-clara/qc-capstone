import React, { useEffect, useState } from 'react';
import '../css/mainTailwind.css';
import axios from 'axios';
import { useParams } from "react-router-dom";
import { GetVendors, loader } from '../ListOfLinks';
import kitty1 from '../images/cute-kitty-1.jpg';
import kitty2 from '../images/kitty_sleep-compressor.jpg';
import { Carousel } from "react-responsive-carousel";

export const Vendors=  () => {
     let { idv } = useParams();
     var initValue = [];
     const [supplier, setSupplier] = useState([]);
     const [totalVendor, setTotalVendor] = useState(0);
     const [load, setLoad] = useState(false);
     const [productName, setProductName] = useState('');
     const [offeringKey, setOfferingKey] = useState('');

     useEffect(() => {
         document.title = `Home Depot - Vendor`;
         fetching(idv);
    
          // eslint-disable-next-line react-hooks/exhaustive-deps
     }, [load]);
    const fetching = async (ProductID) => {
        await axios.get(GetVendors(ProductID)).then((res) => {
             setTotalVendor(res.data.length);
             setProductName(res.data[0].product_name);
          //     console.log(res.data); 
             for (var i = 0; i < res.data.length; i++) {
                 initValue.push({ supplier: res.data[i].supplier_name, supplier_key: res.data[i].supplier_key, unit_cost: res.data[i].unit_cost, unit_retail: res.data[i].unit_retail, offering_key:res.data[i].offering_key});
             }
             setSupplier(initValue);
             
         })
        setLoad(true);
    }
    const ListVendor =
        supplier.map((e,i) => {
            return (<>
                <VendorEach value={e} index={i}/>
            </>);
        });
    
    const page_title = (
        <div className="mt-4 justify-center w-full h-auto md:h-auto">
            <div className=" titlePage py-2 lg:text-3xl"> Other Vendors </div>
        </div>
    );     

    const side_pic = (
    
        <div>
            <div className="justify-center flex md:px-5 lg:px-0">
                <Carousel axis="horizontal" showThumbs={true} showArrows={true} >
                    <img src={kitty1} alt="kitty1"/>
                    <img src={kitty2} alt="kitty2"/>
                </Carousel>
            </div>  
            
        </div>
        );

    const prodc_name = (   
        <div className="mb-20 flex ">
            <div className="text-2xl font-bold "> {productName}</div>
        </div>
    );

    const container = (
    <div>
        <div>{page_title}</div>
        
        <div className="block md:flex w-full md:m-4">
          

            <div className="flex md:block w-full md:w-1/3 md:m-4">
                <table className="table-auto border-2 border-orange-500 float-right">

                    <thead> 
                        <tr> 
                            <th className="p-4 border-r-2 border-l-2 border-orange-500 underline text-lg md:text-xl"> Vendor </th> 
                            <th className="p-4 border-r-2 border-orange-500 underline text-lg md:text-xl">  Unit Retail  </th> 
                        </tr>
                    </thead>

                    <tbody>
                        {ListVendor}
                    </tbody>
                    
                </table>
            </div>
              
            <div className="w-full md:w-1/2 md:m-4"> 
                <div className="mt-4 lg:ml-0 underline">{prodc_name}</div>
                <div>{side_pic}</div>
            </div>
        </div>
    </div>
        )
     return (<>
         <div>
             <br/>

             <div> {load ? container : loader}</div>
         
             <br/>
         </div>
      </>);
}

const VendorEach = (props) => {
  //  console.log("prtopda");
  // console.log(props);
    const grayline = (<>
        <td onClick={() => { window.location.href = '/supplier/' + props.value.supplier_key }} className="p-2 border-2 border-orange-500 text-center cursor-pointer hover:underline hover:font-bold bg-gray-300" >{props.value.supplier}</td>
        <td onClick={() => { window.location.href = '/offering/' + props.value.offering_key }} className="p-2 border-2 border-orange-500 text-right bg-gray-300 cursor-pointer hover:underline hover:font-bold"  >${props.value.unit_retail}</td>        
    </>)
    const whiteline = (<>
        <td onClick={() => { window.location.href = '/supplier/' + props.value.supplier_key }} className="p-2 border-2 border-orange-500 text-center cursor-pointer hover:underline hover:font-bold bg-white" >{props.value.supplier}</td>
        <td onClick={() => { window.location.href = '/offering/' + props.value.offering_key }} className="p-2 border-2 border-orange-500 text-right bg-white cursor-pointer hover:underline hover:font-bold" >${props.value.unit_retail}</td>
    </>)
    
    return (
        <tr>{(props.index % 2 === 0) ? grayline : whiteline}
        </tr>
        )
}