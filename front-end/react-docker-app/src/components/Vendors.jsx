import React, { useEffect, useState } from 'react';
import '../css/mainTailwind.css';
import axios from 'axios';
import { useParams, Link } from "react-router-dom";
export const Vendors=  () => {
     let { idv } = useParams();
     var initValue = [];
     const [supplier, setSupplier] = useState([]);
     const [totalVendor, setTotalVendor] = useState(0);
     const [load, setLoad] = useState(false);

     useEffect(() => {
         document.title = `Home Depot - Vendor`;
         fetching(idv);
         setLoad(false);
      
     }, [load]);
     const fetching = async (ProductID) => {

         await axios.get("http://localhost:7000/catalog-api/products/offerings/" + ProductID).then((res) => {
             console.log(res.data);
             setTotalVendor(res.data.length);
          
             for (var i = 0; i < res.data.length; i++) {
                 initValue.push({ supplier: res.data[i].supplier_name, unit_cost: res.data[i].unit_cost, unit_retail: res.data[i].unit_retail });
             }
             setSupplier(initValue);
             setLoad(true);
         })
     }
     const loopfetching =  (totalVendor) => {
         var htmlElements = '';
         var loopElements = '';
         var colorchange = '';
         for (var i = 0; i < totalVendor; i++) { 
             (i % 2 == 0) ? colorchange = 'bg-gray-300' : colorchange = 'bg-white';
             loopElements += `
            <tr>`+
                 `<td class="p-2 border-2 border-orange-500 text-center ` + colorchange+`">` + supplier[i].supplier +
                 `</td>` +
                 `<td class="p-2 border-2 border-orange-500 text-right ` + colorchange +`">` + supplier[i].unit_cost +
                 `</td>` +
                 `<td class="p-2 border-2 border-orange-500 text-right ` + colorchange +`">`+ supplier[i].unit_retail +
                 `</td>` +
            `</tr>`
         }
             htmlElements += `      
                <table class="table-auto">`+
                    `<thead>` +
                        `<tr>` +
                            `<th class="p-4 border-r-2 border-l-2 border-orange-500 underline text-xl">` + "Vendor" + `</th>` +
                            `<th class="p-4 border-r-2 border-orange-500 underline text-xl">` + "Unit Cost" + `</th>` +
                            `<th class="p-4 border-r-2 border-orange-500 underline text-xl">` + "Unit Retail" + `</th>` +
                        `</tr>`+
                    `<thead>` +
                    `<tbody>` +
                        loopElements +
                    `</tbody>`+
                `</table>`
                ;
         
         var container = document.getElementById("container");
         container.innerHTML = htmlElements;
         setLoad(false);
     }

     return (<>
         <div>
             <div> {load ? loopfetching(totalVendor) : null} </div>
             <div id="container"></div>
         </div>
      </>);
}
