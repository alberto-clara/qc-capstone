import React, { useState, useEffect } from 'react';
import FireBaseSetup from '../FireBaseSetup';
import axios from 'axios';
import Dropdown from 'react-dropdown';
import '../css/mainStyle.css';
import './myStyle.css';
import { GetUserInfo, PostUserInfo, TokenHeader, OrderHistoryLink } from '../ListOfLinks';
import { OrderHistory } from './OrderHistory';

export const ManagePage = (props) => {
    const [email, setEmail] = useState("");
    const [load, setLoad] = useState(false);
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
    const [objZipCode1, setObjZipCode1] = useState(0);
    const [objZipCode2, setObjZipCode2] = useState(0);

    const [objPhone1, setObjPhone1] = useState("");
    const [objPhone2, setObjPhone2] = useState("");
    const [objExt1, setObjExt1] = useState("");
    const [objExt2, setObjExt2] = useState("");
    const [historyItem, setHistoryItem] = useState([]);

    const [userToken, setUserToken] = useState("");

    const [Page, setPage] = useState("default");


    useEffect(() => {
        FireBaseSetup.isInitialized().then(user => {
            if (user) {
                user.getIdToken().then(function (idToken) {  // <------ Check this line

                    setUserToken(idToken); // It shows the Firebase token now
                    mongoFetch(user.uid, idToken);
                });
                setUID(user.uid);
                setEmail(user.email);
            }
        });

       
    }, [Page]);

    const mongoFetch = async (uidValue, idToken) => {
        var initValue = [];
        var found = false;

        await axios.get(GetUserInfo, TokenHeader(idToken)).then((res) => {
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
            /*       console.log("res print statement: ", res);
                   console.log("first_name", res.data.full_name.first_name);*/
            found = true;
            setObjFirstName(res.data.full_name.first_name);
            setObjMiddleName(res.data.full_name.middle_name);
            setObjLastName(res.data.full_name.last_name);
            setObjStreet1(res.data.first_address.street);
            setObjStreet2(res.data.second_address.street);
            setObjApt1(res.data.first_address.apt);
            setObjApt2(res.data.second_address.apt);
            setObjCity1(res.data.first_address.city);
            setObjCity2(res.data.second_address.city);
            setObjState1(res.data.first_address.state);
            setObjState2(res.data.second_address.state);
            setObjZipCode1(res.data.first_address.zip_code);
            setObjZipCode2(res.data.second_address.zip_code);
            setObjPhone1(res.data.phone_number.primary_phone.phone);
            setObjPhone2(res.data.phone_number.secondary_phone.phone);
            setObjExt1(res.data.phone_number.primary_phone.ext);
            setObjExt2(res.data.phone_number.secondary_phone.ext);


        })

        await axios.get(OrderHistoryLink, TokenHeader(idToken)).then((res) => {
            setHistoryItem(res.data.orders);
            setLoad(true);
        }).catch((err) => { });

    };
     
    const page_title = (
        <div className="justify-center w-full h-auto md:h-auto">
            <div className=" titlePage py-6 md:py-10 lg:text-3xl"> My Account </div>
        </div>
    );     
 
    const EditInfoButton = async () => {
        var firstnameTyping = document.getElementById('firstname_input');
        var middlenameTyping = document.getElementById('middlename_input');
        var lastnameTyping = document.getElementById('lastname_input');
        var street1Typing = document.getElementById('street1_input');
        var apt1Typing = document.getElementById('apt1_input');
        var city1Typing = document.getElementById('city1_input');
       
        var zipcode1Typing = document.getElementById('zipcode1_input');
        var street2Typing = document.getElementById('street2_input');
        var apt2Typing = document.getElementById('apt2_input');
        var city2Typing = document.getElementById('city2_input');
        var zipcode2Typing = document.getElementById('zipcode2_input');
        var phone1Typing = document.getElementById('phone1_input');
        var ext1Typing = document.getElementById('ext1_input');
        var phone2Typing = document.getElementById('phone2_input');
        var ext2Typing = document.getElementById('ext2_input');


  
        var submit_obj = {
            "Uid": null,
            "Email": 'test@test.com',
            "Full_name": {
                "First_name": firstnameTyping.value === '' ? firstnameTyping.placeholder : firstnameTyping.value,
                "Middle_name": middlenameTyping.value === '' ? middlenameTyping.placeholder : middlenameTyping.value,
                "Last_name": lastnameTyping.value === '' ? lastnameTyping.placeholder : lastnameTyping.value,
            },
            "First_address": {
                "Street": street1Typing.value === '' ? street1Typing.placeholder : street1Typing.value,
                "apt": apt1Typing.value === '' ? apt1Typing.placeholder : apt1Typing.value,
                "city": city1Typing.value === '' ? city1Typing.placeholder : city1Typing.value,
                "state": objState1,
                "zip_code": zipcode1Typing.value === '' ? zipcode1Typing.placeholder : zipcode1Typing.value,
            },
            "second_address": {
                "street": street2Typing.value === '' ? street2Typing.placeholder : street2Typing.value,
                "apt": apt2Typing.value === '' ? apt2Typing.placeholder : apt2Typing.value,
                "city": city2Typing.value === '' ? city2Typing.placeholder : city2Typing.value,
                "state": objState2,
                "zip_code": zipcode2Typing.value === '' ? zipcode2Typing.placeholder : zipcode2Typing.value,
            },
            "phone_number": {
                "primary_phone": {
                    "phone": phone1Typing.value === '' ? phone1Typing.placeholder : phone1Typing.value,
                    "ext": ext1Typing.value === '' ? ext1Typing.placeholder : ext1Typing.value,
                },
                "secondary_phone": {
                    "phone": phone2Typing.value === '' ? phone2Typing.placeholder : phone2Typing.value,
                    "ext": ext2Typing.value === '' ? ext2Typing.placeholder : ext2Typing.value
                }
            }
        }

        // console.log("body : ", submit_obj);
        console.log("input" + document.getElementById('firstname_input').placeholder);
        await axios.post(PostUserInfo, 
        {...submit_obj},
        TokenHeader(userToken)).then((res)=>{
        //       window.location.href = '/';
        })
        setPage("bold_address");
      
    }
    const states = ["AL","AK","AZ","AR","CA","CO","CT","DE","DC","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"];
   
    const my_address = (
        <div className="justify-center w-full rounded border-2 border-orange-500">
            <div className="px-4 py-4 text-2xl">User</div>
            <div className="block md:flex w-full">
                <div className="block w-full md:w-1/2">
                    <div className="px-4 pt-4 text-xl">First Name</div>
                    <div className="justify-center flex text-gray-600 px-4 w-full">
                        <input id="firstname_input" className=" rounded border border-gray-600 h-10 px-5 pr-8 text-sm w-full" type="search" name="search" placeholder={objFirstName}></input>
                        </div>
                </div>
                <div className="block w-full md:w-1/6">
                    <div className="px-4 pt-4 text-xl">Middle</div>
                        <div className="justify-center flex text-gray-600 px-4 w-full">
                            <input id="middlename_input" className=" rounded border border-gray-600 h-10 px-5 pr-8 text-sm w-full" type="search" name="search" placeholder={objMiddleName}></input>
                        </div>
                </div>
                <div className="block w-full md:w-1/2">
                    <div className="px-4 pt-4 text-xl">Last Name</div>
                        <div className="justify-center flex text-gray-600 px-4 w-full">
                        <input id="lastname_input" className=" rounded border border-gray-600 h-10 px-5 pr-8 text-sm w-full" type="search" name="search" placeholder={objLastName}></input>
                    </div>
                </div>
            </div>

              <div className="px-4 pt-4 text-xl">Email</div>
            <div className="justify-center flex text-gray-600 w-full pb-4">
                <div className="justify-center flex text-gray-600 px-4 w-full">
                    {email}
                </div>
            </div>

            <hr className="m-1 px-4 pt-1 bg-orange-500"/>
            <div className="p-4 text-2xl">Phone Number</div>
            <div className="flex w-full">
                <div className="block w-3/4">
                    <div className="px-4 pt-4 text-xl">Phone 1</div>
                    <div className="justify-center flex text-gray-600 w-full">
                        <div className="justify-center flex text-gray-600 px-4 w-full">
                            <input id="phone1_input" className=" rounded border border-gray-600 h-10 px-5 pr-8 text-sm w-full" type="search" name="search" placeholder={objPhone1}></input>
                        </div>
                    </div>
                </div>
                <div className="block w-1/4">
                    <div className="px-4 pt-4 text-xl">Ext#</div>
                    <div className="justify-center flex text-gray-600 w-full">
                        <div className="justify-center flex text-gray-600 px-4 w-full">
                            <input id="ext1_input" className=" rounded border border-gray-600 h-10 px-5 pr-8 text-sm w-full" type="search" name="search" placeholder={objExt1}></input>
                        </div>
                    </div>
                </div>
            </div>
                
            <div className="flex w-full">
                <div className="block w-3/4">
                    <div className="px-4 pt-4 text-xl">Phone 2</div>
                    <div className="justify-center flex text-gray-600 w-full">
                        <div className="justify-center flex text-gray-600 px-4 w-full">
                            <input id="phone2_input" className=" rounded border border-gray-600 h-10 px-5 pr-8 text-sm w-full" type="search" name="search" placeholder={objPhone2}></input>                   
                        </div>
                    </div>
                </div>
                <div className="block w-1/4">
                    <div className="px-4 pt-4 text-xl">Ext#</div>
                    <div className="justify-center flex text-gray-600 w-full">
                        <div className="justify-center flex text-gray-600 px-4 pb-4 w-full">
                            <input id="ext2_input" className=" rounded border border-gray-600 h-10 px-5 pr-8 text-sm w-full" type="search" name="search" placeholder={objExt2}></input>   
                        </div>
                    </div>
                </div>
            </div>

            <hr className="m-1 px-4 pt-1 bg-orange-500"/>
            <div className="px-4 py-4 text-2xl"> Primary Address</div>
            <div className="block md:flex w-full">
                <div className="block w-full md:w-3/4">
                    <div className="px-4 pt-4 text-xl">Street</div>
                    <div className="justify-center flex text-gray-600 w-full">
                        <div className="justify-center flex text-gray-600 px-4 w-full">
                            <input id="street1_input" className=" rounded border border-gray-600 h-10 px-5 pr-8 text-sm w-full" type="search" name="search" placeholder={objStreet1}></input>                  
                        </div>
                    </div>       
                    </div>
                    <div className="block w-full md:w-1/4">
                    <div className="px-4 pt-4 text-xl">Apt</div>
                    <div className="justify-center flex text-gray-600 w-full">
                        <div className="justify-center flex text-gray-600 px-4 w-full">
                            <input id="apt1_input" className=" rounded border border-gray-600 h-10 px-5 pr-8 text-sm w-full" type="search" name="search" placeholder={objApt1}></input>                  
                        </div>
                    </div>      
                </div>
            </div>

            <div className="block md:flex w-full">
                <div className="block w-full md:w-1/3">
                    <div className="px-4 pt-4 text-xl">City</div>
                    <div className="justify-center flex text-gray-600 w-full">
                        <div className="justify-center flex text-gray-600 px-4 w-full">
                            <input id="city1_input" className="rounded border border-gray-600 h-10 px-5 pr-8 text-sm w-full" type="search" name="search" placeholder={objCity1}></input>                  
                        </div>
                    </div>    
                </div>
                
                <div className="block w-full md:w-1/3">
                    <div className="px-4 pt-4 text-xl">State</div>
                    <div className="justify-center flex text-gray-600 px-4 w-full">
                        <Dropdown id="state1_input" options={states} value={objState1 == null ? '---' : objState1} onChange={e => setObjState1(e.value)}/>              
                    </div> 
                </div>

                <div className="block w-full md:w-1/4">
                    <div className="px-4 pt-4 text-xl">Zip Code</div>
                    <div className="justify-right flex text-gray-600 w-full pb-4">
                        <div className="justify-center flex text-gray-600 px-4 w-full">
                            <input id="zipcode1_input" className=" rounded border border-gray-600 h-10 px-5 pr-8 text-sm w-full" type="search" name="search" placeholder={objZipCode1}></input>   
                        </div>
                    </div>
                </div>              
            </div>
      
            <hr className="m-1 px-4 pt-1 bg-orange-500"/>
            <div className="px-4 py-4 text-2xl"> Secondary Address</div>
            <div className="block md:flex w-full">
                <div className="block w-full md:w-3/4">
                    <div className="px-4 pt-4 text-xl">Street</div>
                    <div className="justify-center flex text-gray-600 w-full">
                        <div className="justify-center flex text-gray-600 px-4 w-full">
                            <input id="street2_input" className=" rounded border border-gray-600 h-10 px-5 pr-8 text-sm w-full" type="search" name="search" placeholder={objStreet2}></input>                  
                        </div>
                    </div>       
                    </div>
                    <div className="block w-full md:w-1/4">
                    <div className="px-4 pt-4 text-xl">Apt</div>
                    <div className="justify-center flex text-gray-600 w-full">
                        <div className="justify-center flex text-gray-600 px-4 w-full">
                            <input id="apt2_input" className=" rounded border border-gray-600 h-10 px-5 pr-8 text-sm w-full" type="search" name="search" placeholder={objApt2}></input>                  
                        </div>
                    </div>      
                </div>
            </div>

            <div className="block md:flex w-full">
                <div className="block w-full md:w-1/3">
                    <div className="px-4 pt-4 text-xl">City</div>
                    <div className="justify-center flex text-gray-600 w-full">
                        <div className="justify-center flex text-gray-600 px-4 w-full">
                            <input id="city2_input" className="rounded border border-gray-600 h-10 px-5 pr-8 text-sm w-full" type="search" name="search" placeholder={objCity2}></input>                  
                        </div>
                    </div>    
                </div>
                
                <div className="block w-full md:w-1/3">
                    <div className="px-4 pt-4 text-xl">State</div>
                    <div className="justify-center flex text-gray-600 px-4 w-full">
                        <Dropdown id="state2_input" options={states} value={objState2 == null ? '---' : objState2} onChange={e => setObjState2(e.value)}/>              
                    </div> 
                </div>

                <div className="block w-full md:w-1/4">
                    <div className="px-4 pt-4 text-xl">Zip Code</div>
                    <div className="justify-right flex text-gray-600 w-full pb-4">
                        <div className="justify-center flex text-gray-600 px-4 w-full">
                            <input id="zipcode2_input" className=" rounded border border-gray-600 h-10 px-5 pr-8 text-sm w-full" type="search" name="search" placeholder={objZipCode2}></input>   
                        </div>
                    </div>
                </div>              
            </div>

            <div className="justify-center flex text-gray-600 w-full p-4">
                <button onClick={EditInfoButton} type="submit" className="px-4 py-2 border rounded text-white border-orange-500 bg-orange-500 hover:border-orange-500">
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
                <div className="py-2">Email: {email}</div>
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
                <svg onClick={() => setPage("editPage")} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                    <path className="heroicon-ui" d="M6.3 12.3l10-10a1 1 0 0 1 1.4 0l4 4a1 1 0 0 1 0 1.4l-10 10a1 1 0 0 1-.7.3H7a1 1 0 0 1-1-1v-4a1 1 0 0 1 .3-.7zM8 16h2.59l9-9L17 4.41l-9 9V16zm10-2a1 1 0 0 1 2 0v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6c0-1.1.9-2 2-2h6a1 1 0 0 1 0 2H4v14h14v-6z"/>
                </svg>
            </button>
        </div>
        </div>
        </> 
        );

    const logout = () => {
        FireBaseSetup.logout();
        window.location.href = '/';
    }
    const PasswordChange = () => {
        var newPass = document.getElementById('newPass').value;
        var confirmPass = document.getElementById('confirmPass').value;
        if (newPass === confirmPass)
        {
            FireBaseSetup.changePassword(newPass);
            window.location.href = '/manageuser';
        }
        else
            alert("New Password and Confirm Password need to be the same");
     
    }
    const PasswordPage = () => {
        const [show, setShow] = useState(false);
        const [show2, setShow2] = useState(false);
        return (
            <>
                <div className="justify-center w-full rounded border-2 border-orange-500">
                    <div className="px-4 py-4 text-2xl text-center"> Change Password</div>
                    <div className="block w-full px-4">
                        {/*<div className="pt-4 text-xl">Old Password</div>
                <div className="justify-center flex text-gray-600 w-full">
                    <input id="oldPass" className="rounded border border-gray-600 h-10 px-5 pr-8 text-sm w-full"></input>
                </div>*/}
                        <div className="flex">
                            <div className="pt-4 text-xl w-4/5">New Password</div>
                            <div onClick={() => setShow(!show) } className = "pt-4 text-xl hover:font-bold cursor-pointer md:hidden">Show</div>
                        </div>
                        <div className="flex w-full pt-2">
                            <input type={!show ? "password" : null} id="newPass" className="text-gray-600 h-10 rounded border border-gray-600 bg-white w-full md:mr-4"></input>
                            <div onClick={() => setShow(!show) } className = "hidden md:flex text-xl hover:font-bold cursor-pointer pt-2">Show</div>
                        </div>
                        
                        <div className="flex">
                            <div className="pt-4 text-xl w-4/5">Confirm Password</div>
                            <div onClick={() => setShow2(!show2)} className="pt-4 text-xl hover:font-bold cursor-pointer md:hidden">Show</div>
                        </div>
                        <div className="flex w-full pt-2">
                            <input type={!show2 ? "password" : null} id="confirmPass" className="text-gray-600 h-10 rounded border border-gray-600 bg-white w-full md:mr-4"></input>
                            <div onClick={() => setShow2(!show2) } className = "hidden md:flex text-xl hover:font-bold cursor-pointer pt-2">Show</div>
                        </div>
{/* 
                        <div className="flex">
                            <div className="pt-4 text-xl w-4/5">Confirm Password</div>
                            <div onClick={() => setShow2(!show2)} className="pt-4 text-xl right hover:font-bold cursor-pointer" > Show</div>
                        </div>
                        <div className="justify-center flex text-gray-600 w-full pt-2">
                            <input type={!show2 ? "password" : null} id="confirmPass" className="h-10 rounded border border-gray-600 bg-white w-full"></input>
                        </div> */}

                        <div className="justify-center flex text-gray-600 w-full p-4">
                            <button onClick={PasswordChange} className="px-4 py-2 border rounded text-white border-orange-500 bg-orange-500 hover:border-orange-500">
                                Submit
                </button>
                        </div>
                    </div>
                </div>
            </>
        )
    }
    const OrderPage = () => {  
        const ListItem =
            historyItem.map(e => {
                return (<>
                    <br />
                    <OrderHistory value={e}/>
                </>);
            });
        return (<div className="border-orange-500 border-2 p-2"> 
            {load?ListItem:null}
        </div>
        )
    }


    const WishListPage = (
        <>
            Hi WishListPage
        </>
    )
    const HelpPage = (
        <>
            Hi Help what?
        </>
    )

       const left_menu_web = (
           <div className="justify-center w-full rounded border-2 h-full border-orange-500">
                <div className="justify-center flex w-full pt-4">
                    <div className="font-bold text-lg text-gray-800">
                       Settings
                    </div>
                </div>  
               <div className="justify-center flex w-full pt-4">
                   <button onClick={() => { if(Page!=="bold_address") setPage("bold_address") }} type="submit" className="underline">
                            My information
                    </button>
                </div>   
                <div className="justify-center flex w-full pt-4">
                   <button onClick={() => { setPage("passwordPage"); }} type="submit" className="underline">
                       My Password
                </button>
                
                </div>   
                <div className="justify-center flex w-full pt-4">
                   <button onClick={() => { setPage("orderPage"); }} type="submit" className="underline">
                       My Order
                    </button>
                </div>   
                <div className="justify-center flex w-full pt-4">
                   <button onClick={() => { setPage("wishlistPage"); }} type="submit" className="underline">
                       My WishList
                    </button>
                </div>   
                <div className="justify-center flex w-full pt-4">
                   <button onClick={() => { setPage("helpPage"); }} type="submit" className="underline">
                       Help
                    </button>
                </div>   
               <div className="justify-center flex text-gray-600 w-full pt-8 pb-4">
                   <button onClick={logout} type="submit" className="underline">
                            Log Out
                    </button>
                </div>       
           </div>
       )

       const left_menu_mobile = (<>
      
            <div className="justify-center flex  w-full">
                <button onClick={() => { if(Page!=="left_menu_mobile") setPage("bold_address") }} type="submit" className="justify-center w-full rounded border-2 h-10 border-orange-500">
                         My information
                 </button>
             </div>   
             <div className="justify-center flex w-full pt-4">
                <button onClick={() => { setPage("passwordPage"); }} type="submit" className="justify-center w-full rounded border-2 h-10 border-orange-500">
                    My Password
                </button>
             </div>   
             <div className="justify-center flex w-full pt-4">
                <button onClick={() => { setPage("orderPage"); }} type="submit" className="justify-center w-full rounded border-2 h-10 border-orange-500">
                    My Order
                 </button>
             </div>   
             <div className="justify-center flex w-full pt-4">
                <button onClick={() => { setPage("wishlistPage"); }} type="submit" className="justify-center w-full rounded border-2 h-10 border-orange-500">
                    My WishList
                 </button>
             </div>   
             <div className="justify-center flex w-full pt-4">
                <button onClick={() => { setPage("helpPage"); }} type="submit" className="justify-center w-full rounded border-2 h-10 border-orange-500">
                    Help
                 </button>
             </div>   
            <div className="justify-center flex w-full pt-8 pb-4">
                <button onClick={logout} type="submit" className="underline">
                         Log Out
                 </button>
             </div>       
        </>
       )
  
    const backButton = (<> <br/>
        <button className="justify-center w-full rounded border-2 h-full border-orange-500" onClick={() => setPage("default")}> BackButton</button>
    </>);
  

    const web = (<div className="hidden block justify-center w-full sm:flex md:flex">
        <div className="w-full md:w-1/4 hidden sm:block md:pr-2 ">{left_menu_web}</div>
        <div className="w-full text-left sm:block md:w-3/4">
            {(() => {
                switch (Page) {
                    case "bold_address": return bold_address;
                    case "editPage": return my_address;
                    case "passwordPage": return <PasswordPage/>;
                    case "orderPage": return <OrderPage/>;
                    case "wishlistPage": return WishListPage;
                    case "helpPage": return HelpPage;
                    default: return bold_address;
                }
            })()}
        </div>

    </div>)

    const mobile = (<div className="block justify-center w-full sm:flex md:flex md:hidden lg:hidden">
        <div className="w-full md:w-1/4 hidden sm:block md:pr-2">{left_menu_mobile}</div>
        <div className="w-full text-left sm:block md:w-3/4">
            {(() => {
                switch (Page) {
                    case "bold_address": return bold_address;
                    case "editPage": return my_address;
                    case "passwordPage": return <PasswordPage/>;
                    case "orderPage": return <OrderPage/>;
                    case "wishlistPage": return WishListPage;
                    case "helpPage": return HelpPage;
                    default: return left_menu_mobile;
                }
            })()}
        </div>
        {Page == "default" ? null : backButton}

    </div>)
    return (
        <>  
       
            {page_title}
           
        {window.screen.width < 450?mobile:web}
        </>)
}


