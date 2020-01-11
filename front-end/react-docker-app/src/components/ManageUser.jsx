import React, { useState, useEffect } from 'react';
import FireBaseSetup from '../FireBaseSetup';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Dropdown from 'react-dropdown';
import '../css/mainStyle.css';
//var url = "mongodb+srv://gum:Gumgum123@cluster0-ycsux.azure.mongodb.net/test?retryWrites=true&w=majority";

export const ManagePage = (props) => {
    const [email, setEmail] = useState("");
    const [uid, setUID] = useState("");
    const [objFirstName, setObjFirstName] = useState("");
    const [objMiddleName, setObjMiddleName] = useState("");
    const [objLastName, setObjLastName] = useState("");

    const [objStreet1, setObjStreet1] = useState("");
    const [objStreet2, setObjStreet2] = useState("");
    const [objState1, setObjState1] = useState("");
    const [objState2, setObjState2] = useState("");
    const [objCity1, setObjCity1] = useState("");
    const [objCity2, setObjCity2] = useState("");
    const [objApt1, setObjApt1] = useState("");
    const [objApt2, setObjApt2] = useState("");
    const [objZipCode1, setObjZipCode1] = useState("");
    const [objZipCode2, setObjZipCode2] = useState("");

    const [objPhone1, setObjPhone1] = useState("");
    const [objPhone2, setObjPhone2] = useState("");
    const [objExt1, setObjExt1] = useState("");
    const [objExt2, setObjExt2] = useState("");
   
    const [objEmail, setObjEmail] = useState("");

  
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
            const myinfo = res.data[0];
            console.log(
                "all", res.data,
                "uid: ", myinfo.uid,
                "email: ", myinfo.email,
                "firstname: ", myinfo.full_name.first_name,
                "middlename: ", myinfo.full_name.middle_name,
                "lastname: ", myinfo.full_name.last_name,
                "street1: ", myinfo.first_address.street,
                "apt1: ", myinfo.first_address.apt,
                "city1: ", myinfo.first_address.city,
                "state1: ", myinfo.first_address.state,
                "zipcode1: ", myinfo.first_address.zip_code,
                "street2: ", myinfo.second_address.street,
                "apt2: ", myinfo.second_address.apt,
                "city2: ", myinfo.second_address.city,
                "state2: ", myinfo.second_address.state,
                "zipcode2: ", myinfo.second_address.zip_code,
                "phone1: ", myinfo.phone_number.primary_phone.phone,
                "ext1: ", myinfo.phone_number.primary_phone.ext,
                "phone2: ", myinfo.phone_number.secondary_phone.phone,
                "ext2: ", myinfo.phone_number.secondary_phone.ext
            );
           for (var i = 0; i < res.data.length; i++) {
                initValue.push({ 
                    uid: res.data[i].uid,
         //           email: res.data[i].email,
                    first_name: res.data[i].full_name.first_name,
                    middle_name: res.data[i].full_name.middle_name,
                    last_name: res.data[i].full_name.last_name,
                    street1: res.data[i].first_address.street,
                    apt1: res.data[i].first_address.apt,
                    city1: res.data[i].first_address.city,
                    state1: res.data[i].first_address.state,
                    zipcode1: res.data[i].first_address.zip_code,
                    street2: res.data[i].second_address.street,
                    apt2: res.data[i].second_address.apt,
                    city2: res.data[i].second_address.city,
                    state2: res.data[i].second_address.state,
                    zipcode2: res.data[i].second_address.zip_code,
                    phone1: res.data[i].phone_number.primary_phone.phone,
                    ext1: res.data[i].phone_number.primary_phone.ext,
                    phone2: res.data[i].phone_number.secondary_phone.phone,
                    ext2: res.data[i].phone_number.secondary_phone.ext
                });
            }
            initValue.forEach(element => {
              
                var x = "oY2wCvKmahVnG7ZtoNuBp22K6ko2";
                if (element.uid === uidValue) {
                    found = true;
                    console.log(element);
           //         setObjEmail(element.email);
                    setObjFirstName(element.first_name);
                    setObjMiddleName(element.middle_name);
                    setObjLastName(element.last_name);
                    setObjStreet1(element.street1);
                    setObjStreet2(element.street2);
                    setObjApt1(element.apt1);
                    setObjApt2(element.apt2);
                    setObjCity1(element.city1);
                    setObjCity2(element.city2);
                    setObjState1(element.state1);
                    setObjState2(element.state2);
                    setObjZipCode1(element.zipcode1);
                    setObjZipCode2(element.zipcode2);
                    setObjPhone1(element.phone1);
                    setObjPhone2(element.phone2);
                    setObjExt1(element.ext1);
                    setObjExt2(element.ext2);
                   
                }
            });
            if (found == false) {
               
                 axios.post('http://localhost:3001/insert-user', {
                     id: uidInsert,
                    email: emailInser,
                 }).then((res) => {
                     window.location.href = '/manageuser';
                })
            }
        })
        
    };
     
    const page_title = (
        <div className="mt-4 justify-center w-full h-auto md:h-auto">
            <div className=" titlePage pt-4 lg:text-3xl"> My Account </div>
        </div>
    );     
 
    const EditInfoButton = async () => {

        var firstnameTyping = document.getElementById('firstname_input');
        var middlenameTyping = document.getElementById('middlename_input');
        var lastnameTyping = document.getElementById('lastname_input');
        //var emailTyping = document.getElementById('email_input');
        var street1Typing = document.getElementById('street1_input');
        var apt1Typing = document.getElementById('apt1_input');
        var city1Typing = document.getElementById('city1_input');
        var state1Typing = document.getElementById('state1_input');
        var zipcode1Typing = document.getElementById('zipcode1_input');
        var street2Typing = document.getElementById('street2_input');
        var apt2Typing = document.getElementById('apt2_input');
        var city2Typing = document.getElementById('city2_input');
        var state2Typing = document.getElementById('state2_input');
        var zipcode2Typing = document.getElementById('zipcode2_input');
        var phone1Typing = document.getElementById('phone1_input');
        var ext1Typing = document.getElementById('ext1_input');
        var phone2Typing = document.getElementById('phone2_input');
        var ext2Typing = document.getElementById('ext2_input');

        await axios.post('http://localhost:3001/post-user', {
            id: uid,
            //objEmailAddress: emailTyping.value === '' ? emailTyping.placeholder : emailTyping.value,
            objFirstName: firstnameTyping.value === '' ? firstnameTyping.placeholder : firstnameTyping.value,
            objMiddleName: middlenameTyping.value === '' ? middlenameTyping.placeholder : middlenameTyping.value,
            objLastName: lastnameTyping.value === '' ? lastnameTyping.placeholder : lastnameTyping.value,
            objStreet1: street1Typing.value === '' ? street1Typing.placeholder : street1Typing.value,
            objStreet2: street2Typing.value === '' ? street2Typing.placeholder : street2Typing.value,
            objapt1: apt1Typing.value === '' ? apt1Typing.placeholder : apt1Typing.value,
            objapt2: apt2Typing.value === '' ? apt2Typing.placeholder : apt2Typing.value,
            objCity1: city1Typing.value === '' ? city1Typing.placeholder : city1Typing.value,
            objCity2: city2Typing.value === '' ? city2Typing.placeholder : city2Typing.value,
            objState1: state1Typing.value === '' ? state1Typing.placeholder : state1Typing.value,
            objState2: state2Typing.value === '' ? state2Typing.placeholder : state2Typing.value,
            objZipcode1: zipcode1Typing.value === '' ? zipcode1Typing.placeholder : zipcode1Typing.value,
            objZipcode2: zipcode2Typing.value === '' ? zipcode2Typing.placeholder : zipcode2Typing.value,
            objPhone1: phone1Typing.value === '' ? phone1Typing.placeholder : phone1Typing.value,
            objPhone2: phone2Typing.value === '' ? phone2Typing.placeholder : phone2Typing.value,
            objExt1: ext1Typing.value === '' ? ext1Typing.placeholder : ext1Typing.value,
            objExt2: ext2Typing.value === '' ? ext2Typing.placeholder : ext2Typing.value
        }).then((res)=>{
            if (res.data !== null) {
              
                console.log(res);
                window.location.href = '/manageuser';
            };
        })
     
       // window.location.href = '/manageuser';
    }
    const states = ["AL","AK","AZ","AR","CA","CO","CT","DE","DC","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"];

    const State1Change = (e) => {
        setObjState1(e);
    }
    const State2Change = (e) => {
        setObjState2(e);
    }
    const my_address = (
        <div className="justify-center w-full rounded border-2 border-orange-500">
            <div className="flex w-full">
                <div className="block w-1/2">
                    <div className="px-4 pt-4 text-xl">First Name</div>
                        <div className="justify-center flex text-gray-600 px-4 w-full">
                            <input id="firstname_input" className=" rounded border border-orange-500 h-20 px-5 pr-8 text-sm w-full" type="search" name="search" placeholder={objFirstName}></input>
                        </div>
                </div>
                <div className="block w-1/6">
                    <div className="px-4 pt-4 text-xl">Middle</div>
                    <div className="justify-center flex text-gray-600 px-4 w-full">
                        <input id="middlename_input" className=" rounded border border-orange-500 h-20 px-5 pr-8 text-sm w-full" type="search" name="search" placeholder={objMiddleName}></input>
                    </div>
                </div>
                <div className="block w-1/2">
                    <div className="px-4 pt-4 text-xl">Last Name</div>
                        <div className="justify-center flex text-gray-600 px-4 w-full">
                        <input id="lastname_input" className=" rounded border border-orange-500 h-20 px-5 pr-8 text-sm w-full" type="search" name="search" placeholder={objLastName}></input>
                    </div>
                </div>
            </div>

            {/*   <div className="px-4 pt-4 text-xl">Email</div>
            <div className="justify-center flex text-gray-600 w-full">
                <div className="justify-center flex text-gray-600 px-4 w-full">
                    <input id="email_input" className=" rounded border border-orange-500 h-20 px-5 pr-8 text-sm w-full" type="search" name="search" placeholder={objEmail}></input>

                </div>
            </div>*/}
            
            <div className="flex w-full">
                <div className="block w-3/4">
                    <div className="px-4 pt-4 text-xl">Street</div>
                    <div className="justify-center flex text-gray-600 w-full">
                        <div className="justify-center flex text-gray-600 px-4 w-full">
                            <input id="street1_input" className=" rounded border border-orange-500 h-20 px-5 pr-8 text-sm w-full" type="search" name="search" placeholder={objStreet1}></input>                  
                        </div>
                    </div>       
                    </div>
                    <div className="block w-1/4">
                    <div className="px-4 pt-4 text-xl">Apt</div>
                    <div className="justify-center flex text-gray-600 w-full">
                        <div className="justify-center flex text-gray-600 px-4 w-full">
                            <input id="apt1_input" className=" rounded border border-orange-500 h-20 px-5 pr-8 text-sm w-full" type="search" name="search" placeholder={objApt1}></input>                  
                        </div>
                    </div>      
                </div>
            </div>

            <div className="flex w-full">
                <div className="block w-1/3">
                    <div className="px-4 pt-4 text-xl">City</div>
                    <div className="justify-center flex text-gray-600 w-full">
                        <div className="justify-center flex text-gray-600 px-4 w-full">
                            <input id="city1_input" className="rounded border border-orange-500 h-20 px-5 pr-8 text-sm w-full" type="search" name="search" placeholder={objCity1}></input>                  
                        </div>
                    </div>    
                </div>
                
                {/* <div className="block w-1/3">
                    <div className="px-4 pt-4 text-xl">State</div>
                    <div className="justify-center flex text-gray-600 px-4 w-full">
                        <Dropdown value={objState1} id="state1_input" options={states} placeholder={objState1 == "" ? '---' : objState1} onChange={e => State1Change(e)}/>              
                    </div> 
                </div>*/}

                <div className="block w-1/4">
                    <div className="px-4 pt-4 text-xl">State</div>
                    <div className="justify-right flex text-gray-600 w-full">
                        <div className="justify-center flex text-gray-600 px-4 w-full">
                            <input id="state1_input" className=" rounded border border-orange-500 h-20 px-5 pr-8 text-sm w-full" type="search" name="search" placeholder={objState1}></input>
                        </div>
                    </div>
                </div> 

                <div className="block w-1/4">
                    <div className="px-4 pt-4 text-xl">Zip Code</div>
                    <div className="justify-right flex text-gray-600 w-full">
                        <div className="justify-center flex text-gray-600 px-4 w-full">
                            <input id="zipcode1_input" className=" rounded border border-orange-500 h-20 px-5 pr-8 text-sm w-full" type="search" name="search" placeholder={objZipCode1}></input>   
                        </div>
                    </div>
                </div>              
            </div>
            <div className="flex w-full">
                <div className="block w-3/4">
                    <div className="px-4 pt-4 text-xl">Phone 1</div>
                    <div className="justify-center flex text-gray-600 w-full">
                        <div className="justify-center flex text-gray-600 px-4 w-full">
                            <input id="phone1_input" className=" rounded border border-orange-500 h-20 px-5 pr-8 text-sm w-full" type="search" name="search" placeholder={objPhone1}></input>
                        </div>
                    </div>
                </div>
                <div className="block w-1/4">
                    <div className="px-4 pt-4 text-xl">Ext#</div>
                    <div className="justify-center flex text-gray-600 w-full">
                        <div className="justify-center flex text-gray-600 px-4 w-full">
                            <input id="ext1_input" className=" rounded border border-orange-500 h-20 px-5 pr-8 text-sm w-full" type="search" name="search" placeholder={objExt1}></input>
                        </div>
                    </div>
                </div>
            </div>
            <hr className="m-2 pt-1 bg-orange-500"/>
            <div className="flex w-full">
                <div className="block w-3/4">
                    <div className="px-4 pt-4 text-xl">Street 2</div>
                    <div className="justify-center flex text-gray-600 w-full">
                        <div className="justify-center flex text-gray-600 px-4 w-full">
                            <input id="street2_input" className=" rounded border border-orange-500 h-20 px-5 pr-8 text-sm w-full" type="search" name="search" placeholder={objStreet1}></input>
                        </div>
                    </div>
                </div>
                <div className="block w-1/4">
                    <div className="px-4 pt-4 text-xl">Apt 2</div>
                    <div className="justify-center flex text-gray-600 w-full">
                        <div className="justify-center flex text-gray-600 px-4 w-full">
                            <input id="apt2_input" className=" rounded border border-orange-500 h-20 px-5 pr-8 text-sm w-full" type="search" name="search" placeholder={objApt1}></input>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex w-full">
                <div className="block w-1/3">
                    <div className="px-4 pt-4 text-xl">City 2</div>
                    <div className="justify-center flex text-gray-600 w-full">
                        <div className="justify-center flex text-gray-600 px-4 w-full">
                            <input id="city2_input" className="rounded border border-orange-500 h-20 px-5 pr-8 text-sm w-full" type="search" name="search" placeholder={objCity1}></input>
                        </div>
                    </div>
                </div>

                {/*  <div className="block w-1/3">
                    <div className="px-4 pt-4 text-xl">State 2</div>
                    <div className="justify-center flex text-gray-600 px-4 w-full">
                        <Dropdown value={objState2} id="dropdown_manageuser" options={states} placeholder={objState1 == "" ? '---' : objState1} onChange={e => State2Change(e)} />
                    </div>
                </div>*/}
                <div className="block w-1/3">
                    <div className="px-4 pt-4 text-xl"> State 2</div>
                    <div className="justify-center flex text-gray-600 w-full">
                        <div className="justify-center flex text-gray-600 px-4 w-full">
                            <input id="state2_input" className="rounded border border-orange-500 h-20 px-5 pr-8 text-sm w-full" type="search" name="search" placeholder={objState2}></input>
                        </div>
                    </div>
                </div>
                <div className="block w-1/4">
                    <div className="px-4 pt-4 text-xl">Zip Code 2</div>
                    <div className="justify-right flex text-gray-600 w-full">
                        <div className="justify-center flex text-gray-600 px-4 w-full">
                            <input id="zipcode2_input" className=" rounded border border-orange-500 h-20 px-5 pr-8 text-sm w-full" type="search" name="search" placeholder={objZipCode1}></input>
                        </div>
                    </div>
                </div>
            </div>

       
                
            <div className="flex w-full">
                <div className="block w-3/4">
                    <div className="px-4 pt-4 text-xl">Phone 2</div>
                    <div className="justify-center flex text-gray-600 w-full">
                        <div className="justify-center flex text-gray-600 px-4 w-full">
                            <input id="phone2_input" className=" rounded border border-orange-500 h-20 px-5 pr-8 text-sm w-full" type="search" name="search" placeholder={objPhone2}></input>                   
                        </div>
                    </div>
                </div>
                <div className="block w-1/4">
                    <div className="px-4 pt-4 text-xl">Ext#</div>
                    <div className="justify-center flex text-gray-600 w-full">
                        <div className="justify-center flex text-gray-600 px-4 w-full">
                            <input id="ext2_input" className=" rounded border border-orange-500 h-20 px-5 pr-8 text-sm w-full" type="search" name="search" placeholder={objExt2}></input>   
                        </div>
                    </div>
                </div>
            </div>

            <div className="justify-center flex text-gray-600 w-full p-4">
                <button onClick={EditInfoButton} type="submit" className="px-4 py-2 border rounded text-gray-700 border-orange-500 bg-white hover:border-orange-500">
                    Submit 
                </button>
            </div>   
        </div>
    );

    const bold_address = (
        <>
        <div className="px-4 flex rounded border-2 border-orange-500 py-4 text-xl">
            <div className="flex-1">
                <div className="py-2">Name: {objFirstName} {objMiddleName} {objLastName}</div>
                    {/*   <div className="py-2">Email: {objEmail}</div>*/}
                <div>
                    <div className="py-2">
                        <div>Primary Address:</div>
                        <div className="py-2 px-2">{objStreet1} {objApt1}</div>
                        <div className="py-2 px-2">{objCity1} {objState1} {objZipCode1}</div>
                    </div>   
                    <div className="py-2">
                        <div>Secondary Address:</div>
                        <div className="py-2 px-2">{objStreet2} {objApt2}</div>
                        <div className="py-2 px-2">{objCity2} {objState2} {objZipCode2}</div>
                    </div>
                </div>
                <div>
                    <div className="py-2">
                        <div>Primary Phone:</div>
                        <div className="py-2 px-2">{objPhone1} # {objExt1}</div>
                    </div>
                    <div className="py-2">
                        <div>Second Phone:</div>
                        <div className="py-2 px-2">{objPhone2} # {objExt2}</div>
                    </div> 
                </div>  
            </div>
            <div className="py-2">
            <button>
                <svg onClick={() => setEditChange(!editChange)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
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
                   <button onClick={() => { if(editChange) setEditChange(!editChange) }} type="submit" className="underline">
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
