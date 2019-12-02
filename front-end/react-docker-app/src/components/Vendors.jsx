import React, {useEffect,useState } from 'react';
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
            //console.log(res.data);
            setTotalVendor(res.data.length);
          
            for (var i = 0; i < res.data.length; i++) {
                initValue.push({ supplier: res.data[i].supplier, unit_cost: res.data[i].unit_cost, unit_retail: res.data[i].unit_retail });
            }
            setSupplier(initValue);
           setLoad(true);
        })
    }
    const loopfetching =  (totalVendor) => {
        var htmlElements = '';
        console.log(supplier);
        for (var i = 0; i < totalVendor; i++) {
            htmlElements += `
              
                <div>` + supplier[i].supplier + `</div>`
               ;
        }
        var container = document.getElementById("container");
        container.innerHTML = htmlElements;
        setLoad(false);
    }

    return (<>
        <div >
            hey there {idv}
                 <div> {load ? loopfetching(totalVendor) : null} </div>
            <div id="contatiner"></div>
        </div>
     </>);
   
}