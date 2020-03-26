import React, { useEffect, useState } from 'react';
import '../css/mainTailwind.css';
import axios from 'axios';
import { useParams } from "react-router-dom";
import { GetVendors, loader } from '../ListOfLinks';

export const Vendors=  () => {
     let { idv } = useParams();
     var initValue = [];
     const [supplier, setSupplier] = useState([]);
     const [totalVendor, setTotalVendor] = useState(0);
     const [load, setLoad] = useState(false);

     useEffect(() => {
         document.title = `Home Depot - Vendor`;
         fetching(idv);
    
          // eslint-disable-next-line react-hooks/exhaustive-deps
     }, [load]);
    const fetching = async (ProductID) => {
        await axios.get(GetVendors(ProductID)).then((res) => {
             setTotalVendor(res.data.length);
          
             for (var i = 0; i < res.data.length; i++) {
                 initValue.push({ supplier: res.data[i].supplier_name, supplier_key: res.data[i].supplier_key, unit_cost: res.data[i].unit_cost, unit_retail: res.data[i].unit_retail });
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
    const container = (<div>
        <table className="table-auto border-2 border-orange-500">
                    <thead> 
                        <tr> 
                            <th className="p-4 border-r-2 border-l-2 border-orange-500 underline text-xl"> Vendor </th> 
                            <th className="p-4 border-r-2 border-orange-500 underline text-xl">  "Unit Retail"  </th> 
                        </tr>
                    </thead> 
                    <tbody>
                        {ListVendor}
                    </tbody>
        </table>
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
   
    const grayline = (<>
        <td onClick={() => { window.location.href = '/supplier/' + props.value.supplier_key }} className="p-2 border-2 border-orange-500 text-center cursor-pointer hover:underline hover:font-bold bg-gray-300" >{props.value.supplier}</td>
        <td className="p-2 border-2 border-orange-500 text-right bg-gray-300"  >{props.value.unit_retail}</td>        
    </>)
    const whiteline = (<>
        <td onClick={() => { window.location.href = '/supplier/' + props.value.supplier_key }} className="p-2 border-2 border-orange-500 text-center cursor-pointer hover:underline hover:font-bold bg-white" >{props.value.supplier}</td>
        <td className="p-2 border-2 border-orange-500 text-right bg-white" >{props.value.unit_retail}</td>
    </>)
    
    return (
        <tr>{(props.index % 2 === 0) ? grayline : whiteline}
        </tr>
        )
}