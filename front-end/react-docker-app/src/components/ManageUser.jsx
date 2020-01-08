import React, { useState, useEffect } from 'react';
import FireBaseSetup from '../FireBaseSetup';
import axios from 'axios';
import { Link } from 'react-router-dom';
//var url = "mongodb+srv://gum:Gumgum123@cluster0-ycsux.azure.mongodb.net/test?retryWrites=true&w=majority";

export const ManagePage = (props) => {
    const [email, setEmail] = useState("");
    const [uid, setUID] = useState("");
    var [objName, setObjName] = useState("");
    const [objEmail, setObjEmail] = useState("");
    const [objAddress, setObjAddress] = useState("");
    const [objPhone, setObjPhone] = useState("");
    var emailInser, uidInsert;
    const [editChange, setEditChange] = useState(false);
    const [editOrder, setEditOrder] = useState(false);
    useEffect(() => {
        FireBaseSetup.isInitialized().then(user => {
            if (user) {
                setUID(user.uid);
                uidInsert = user.uid;
                emailInser = user.email;
                setEmail(user.email);      
                mongoFetch(user.uid);
              
            }
      
        });
    }, []);

    const mongoFetch = async (uidValue) => {
        var initValue = [];
        var found = false;
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
                    found = true;
                }
            });
            if (found == false) {
                console.log("Not Found");
                 axios.post('http://localhost:3001/insert-user', {
                     id: uidInsert,
                     email: emailInser
                 }).then((res) => {
                     console.log(res);
                    console.log("Test insert");
                })
            }
        })
        
    };
     
    const page_title = (
        <div className="mt-4 justify-center w-full h-auto md:h-auto">
            <div className=" titlePage pt-4 lg:text-3xl"> My Account </div>
        </div>
    );     
 
    const EditNameButton = async () => {

        var nameTyping = document.getElementById('nameInput').value;
        var EmailAddressTyping = document.getElementById('EmailAddressInput').value;
        var AddressTyping = document.getElementById('AddressInput').value;
        var PhoneTyping = document.getElementById('PhoneInput').value;
      
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
        <div className="justify-center w-full rounded border-2 border-orange-500">
            <div className="px-4 pt-4 text-xl">Name</div>
                <div className="justify-center flex text-gray-600 px-4 w-full">
                    <input id="nameInput" className=" rounded border border-orange-500 h-20 px-5 pr-8 text-sm w-full" type="search" name="search" placeholder={objName}></input>
            </div>
            <div className="px-4 pt-4 text-xl">Email</div>
            <div className="justify-center flex text-gray-600 w-full">
                <div className="justify-center flex text-gray-600 px-4 w-full">
                    <input id="EmailAddressInput" className=" rounded border border-orange-500 h-20 px-5 pr-8 text-sm w-full" type="search" name="search" placeholder={objEmail}></input>
               
                </div>
            </div>
            <div className="px-4 pt-4 text-xl">Address</div>
            <div className="justify-center flex text-gray-600 w-full">
                <div className="justify-center flex text-gray-600 px-4 w-full">
                    <input id="AddressInput" className=" rounded border border-orange-500 h-20 px-5 pr-8 text-sm w-full" type="search" name="search" placeholder={objAddress}></input>
                   
                </div>
            </div>
            <div className="px-4 pt-4 text-xl">Phone</div>
            <div className="justify-center flex text-gray-600 w-full">
                <div className="justify-center flex text-gray-600 px-4 w-full">
                    <input id="PhoneInput" className=" rounded border border-orange-500 h-20 px-5 pr-8 text-sm w-full" type="search" name="search" placeholder={objPhone}></input>
                   
                </div>
            </div>
            <div className="justify-center flex text-gray-600 w-full p-4">
                <button onClick={EditNameButton} type="submit" className="px-4 py-2 border rounded text-gray-700 border-orange-500 bg-white hover:border-orange-500">
                    Submit 
                </button>
            </div>   
        </div>
    );

    const bold_address = (
        <>
        <div className="px-4 flex rounded border-2 border-orange-500 py-4 text-xl">
            <div className="flex-1">
                <div className="py-2">{objName}</div>
                <div className="py-2">{objEmail}</div>
                <div className="py-2">{objAddress}</div>
                <div className="py-2">{objPhone}</div>
            </div>
            <div className="py-2">
            <button>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                    <path className="heroicon-ui" d="M6.3 12.3l10-10a1 1 0 0 1 1.4 0l4 4a1 1 0 0 1 0 1.4l-10 10a1 1 0 0 1-.7.3H7a1 1 0 0 1-1-1v-4a1 1 0 0 1 .3-.7zM8 16h2.59l9-9L17 4.41l-9 9V16zm10-2a1 1 0 0 1 2 0v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6c0-1.1.9-2 2-2h6a1 1 0 0 1 0 2H4v14h14v-6z"/>
                </svg>
            </button>
        </div>
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
           <div className="justify-center w-full rounded border-2 border-orange-500">
               {/* <div className="underline">{uid}</div>
               <div className="underline">{email}</div> */}
               <div className="justify-center flex text-gray-600 w-full pt-4">
                    <button onClick={()=>setEditChange(!editChange)} type="submit" className="underline">
                            My information
                    </button>
                </div>   
                <div className="justify-center flex w-full pt-4">
                <Link to={'/mypassword'}>
                    <div className="underline text-gray-600">
                       My Password
                    </div>
                </Link>
                </div>   
                <div className="justify-center flex w-full pt-4">
                <Link to={'/manageuser/myorders'}>
                    <div className="underline text-gray-600">
                       My Orders
                    </div>
                </Link>
                </div>   
                <div className="justify-center flex w-full pt-4">
                <Link to={'/manageuser/mywishlist'}>
                    <div className="underline text-gray-600">
                       My Wishlist
                    </div>
                </Link>
                </div>   
                <div className="justify-center flex w-full pt-4">
                <Link to={'/help'}>
                    <div className="underline text-gray-600">
                       Help
                    </div>
                </Link>
                </div>   
                <div className="justify-center flex text-gray-600 w-full pt-8 pb-4">
                    <button type="submit" className="underline">
                            Log Out
                    </button>
                </div> 
              
           </div>

       )

    return (
        <> 
        {page_title}
        <div className="block justify-center w-full sm:flex md:flex">
        <div className="w-full pt-10 md:w-1/4 hidden sm:block md:pr-2">{left_menu}</div>
        <div className="w-full pt-10 text-left sm:block md:w-3/4">{editChange ? my_address: bold_address} </div>
        </div>
    
        </>)
}
