import React, { useState, useEffect } from 'react';
import FireBaseSetup from '../FireBaseSetup';
import axios from 'axios';
//var url = "mongodb+srv://gum:Gumgum123@cluster0-ycsux.azure.mongodb.net/test?retryWrites=true&w=majority";

export const ManagePage = (props) => {
    const [email, setEmail] = useState("");
    const [uid, setUID] = useState("");
    var [objName, setObjName] = useState("");
    const [objEmail, setObjEmail] = useState("");
    const [objAddress, setObjAddress] = useState("");
    const [objPhone, setObjPhone] = useState("");
   
    const [editChange, setEditChange] = useState(false);
    useEffect(() => {
        FireBaseSetup.isInitialized().then(user => {
            if (user) {
                setUID(user.uid);
                setEmail(user.email);      
                mongoFetch(user.uid);
                console.log(objName);
            }
      
        });
    }, []);

    const mongoFetch = async (uidValue) => {
        var initValue = [];
        
        await axios.get("http://localhost:3001/user").then((res) => {

            for (var i = 0; i < res.data.length; i++) {
                initValue.push({ uid: res.data[i].uid, email: res.data[i].email, name: res.data[i].name, address: res.data[i].address, phone: res.data[i].phone, zipcode: res.data[i].zipcode });
            }
            initValue.forEach(element => {
                if (element.uid === uidValue) {    
                    setObjName(element.name);
                    setObjEmail(element.email);
                    setObjAddress(element.address);
                    setObjPhone(element.phone);
                }
            });

        })
        
    };
     
    const page_title = (
        <div className="mt-4 justify-center w-full h-auto md:h-auto">
            <div className=" titlePage py-2 lg:text-3xl"> My Account </div>
        </div>
    );     
    const EditNameButton = async() => {
        var nameTyping = document.getElementById('nameInput').value;
        var EmailAddressTyping = document.getElementById('EmailAddressInput').value;
        var AddressTyping = document.getElementById('AddressInput').value;
        var PhoneTyping = document.getElementById('PhoneInput').value;
        console.log()
        await axios.post('http://localhost:3001/post-user', {
            id: uid,
            objName: nameTyping,
            objEmailAddress: EmailAddressTyping,
            objAddress: AddressTyping,
            objPhone: PhoneTyping
        }).then((res)=>{
            if (res.data !== null) {

        
                setObjName(nameTyping);
                setObjEmail(EmailAddressTyping);
                setObjAddress(AddressTyping);
                setObjPhone(PhoneTyping);
                console.log(nameTyping);
                window.location.href = '/manageuser';
            };
        })
     
       // window.location.href = '/manageuser';
    }
    const my_address = (
        <div className="justify-center w-full">
            <div className="pt-4 text-xl">Name</div>
            <div className="justify-center flex text-gray-600 w-full">
                <div className="  mt-4 justify-center flex text-gray-600 w-full">
                    <input id="nameInput" className=" rounded border-2 border-orange-500 bg-white h-20 px-5 pr-8 text-sm w-full" type="search" name="search" placeholder={objName}></input>
                    
                </div>
            </div>
            <div className="pt-4 text-xl">Email Address</div>
            <div className="justify-center flex text-gray-600 w-full">
                <div className="  mt-4 justify-center flex text-gray-600 w-full">
                    <input id="EmailAddressInput" className=" rounded border-2 border-orange-500 bg-white h-20 px-5 pr-8 text-sm w-full" type="search" name="search" placeholder={objEmail}></input>
               
                </div>
            </div>
            <div className="pt-4 text-xl">Address</div>
            <div className="justify-center flex text-gray-600 w-full">
                <div className="  mt-4 justify-center flex text-gray-600 w-full">
                    <input id="AddressInput" className=" rounded border-2 border-orange-500 bg-white h-20 px-5 pr-8 text-sm w-full" type="search" name="search" placeholder={objAddress}></input>
                   
                </div>
            </div>
            <div className="pt-4 text-xl">Phone</div>
            <div className="justify-center flex text-gray-600 w-full">
                <div className="  mt-4 justify-center flex text-gray-600 w-full">
                    <input id="PhoneInput" className=" rounded border-2 border-orange-500 bg-white h-20 px-5 pr-8 text-sm w-full" type="search" name="search" placeholder={objPhone}></input>
                   
                </div>
            </div>
            <div className="justify-center flex text-gray-600 w-full pt-4">
                <button onClick={EditNameButton} type="submit" className="px-4 py-2 border-2 rounded text-gray-700 border-orange-500 bg-white hover:border-orange-500">
                    Edit 
                </button>
            </div>   
        </div>
    );
    const bold_address = (
        <>
        <div>{objName}</div>
        <div>{objEmail}</div>
        <div>{objAddress}</div>
        <div>{objPhone}</div>
            <div className="justify-center flex text-gray-600 w-full pt-4">
                <button onClick={()=>setEditChange(!editChange)} type="submit" className="px-4 py-2 border-2 rounded text-gray-700 border-orange-500 bg-white hover:border-orange-500">
                         Edit Field
                </button>
            </div> 
        </> 
        );
    const my_password = (
        <>
        <div className="pt-4 text-xl">Old Password</div>   
        <div className="justify-center flex text-gray-600 w-full">
            <input className="h-10 rounded border-2 border-orange-500 bg-white w-full"></input>
        </div>
        <div className="pt-4 text-xl">New Password</div>   
        <div className="justify-center flex text-gray-600 w-full">
            <input className="h-10 rounded border-2 border-orange-500 bg-white w-full"></input>
        </div>
        <div className="pt-4 text-xl">Confirm New Password</div>   
        <div className="justify-center flex text-gray-600 w-full">
            <input className="h-10 rounded border-2 border-orange-500 bg-white w-full"></input>
        </div>
        <div className="justify-center flex text-gray-600 w-full pt-4">
                <button type="submit" className="px-4 py-2 border-2 rounded text-gray-700 border-orange-500 bg-white hover:border-orange-500">
               Edit
                </button>
            </div>   
        </>
    );
    
       const left_menu = (
           <div className="justify-center w-full rounded border-2 border-orange-500 bg-white">
               <div className="underline">{uid}</div>
               <div className="underline">{email}</div>
                
           </div>
       )

    return (
        <> 
        {page_title}
        <div className="flex justify-center w-full">
        <div className="w-1/4 pt-10">{left_menu}</div>
        <div className="w-1/4 pt-10"></div>
        <div className="lg:hidden"></div>
       <div className="w-1/2">{editChange ? my_address: bold_address}</div>
        </div>
        <div className="w-1/2">{my_password}</div>
         
        </>)
}
