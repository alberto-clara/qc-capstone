import React, { useState, useContext/*,useEffect*/ } from "react";
import { Auth } from '../authContext';
import { Link } from 'react-router-dom';
import { Form, FormGroup, FormControl } from 'react-bootstrap';
import '../css/mainTailwind.css';
import FireBaseSetup from "../FireBaseSetup";

export const SignUpPage=(props) => {
    const [emailVerify, setEmailVerify] = useState(false);
    const [passwordVerify,setpasswordVerify] = useState(false);
    const [confirmpasswordVerify,setConfirmPasswordVerify] = useState(false);
    // const [zipcodeVerify,setZipcodeVerify] = useState(false);
    // const [phoneVerify,setPhoneVerify ]= useState(false);
    const [emailSignUp, setEmailSignUp] = useState('');
    const [passwordSignUp, setPasswordSignUp] = useState('');

    const { /*state,*/ dispatch } = useContext(Auth);
    const onRegister = async (e) => {
        e.preventDefault();
        console.log(emailVerify);
        console.log(passwordVerify);
        console.log(confirmpasswordVerify );
        // console.log(zipcodeVerify);
        // console.log(phoneVerify);
        console.log(passwordSignUp);
        var notice = document.getElementById('noticeAll');
        if (emailVerify && passwordVerify && confirmpasswordVerify) {
            var response = await FireBaseSetup.register(emailSignUp, passwordSignUp);

            if (response.user == null) {
                //alert(response);
                
                notice.innerHTML=(response);
                 }
                     else {
            dispatch({
                type: "SIGNUP",
                payload: response
            })
                window.location.href = '/';
                 }
        }
        else {
            alert("The register is invalid");
            //window.location.href = '/signuppage';
        }
        

    }

    const ifEmpty = (value) => { return(value === '' ? true : false)}    
    const validEmail = (email, filter) => { return email.test(filter)}
    function validAtleast(value, from) {
        try {
            if (value.length >= from) {
                return true;
            }
        } catch (e) {}
        return false;
    }
    const is_numeric=(str) =>{ return /^\d+$/.test(str); }
   
    const CheckEmail= (event) => {
        // eslint-disable-next-line
        var filter = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var Email = event;
        console.log(Email);
        var notice = document.getElementById('noticeEmail');
        if (ifEmpty(Email)) {
            notice.innerHTML = "The email is empty";
        }
        else if (validEmail(filter, Email) === false) {
            notice.innerHTML = "The email is invalid";
        }
        else {    
            notice.innerHTML = " ";
            setEmailVerify(true);
            setEmailSignUp(Email);
        }
    }

    const CheckPassword = (event) => {
        var filter = /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z].*[a-z]).{8,50}$/;
        var Password = event;
        var notice = document.getElementById('noticePassword');
        if (ifEmpty(Password)) {
            notice.innerHTML = "The Password is empty";
        }
        else if (!validAtleast(Password, 8)) {
            notice.innerHTML = "The Password needs atleast 8 characters";
        }
       else if (!validEmail(filter,Password)) {
            notice.innerHTML = "The password is invalid. It needs at least a lower, upper, and special character";
        }
        else {
            notice.innerHTML = " ";
            setPasswordSignUp(Password);
            setpasswordVerify(true);
        }
    }

    const CheckPasswordConfirm = (event) => {
        var PasswordConfirm = event;
        var Password = document.getElementById('PasswordField').value;
        var notice = document.getElementById('noticePasswordConfirm');

        if (ifEmpty(PasswordConfirm) || (PasswordConfirm !== Password)) {
            notice.innerHTML = "The Password and Confirm Passwordshould need to be the same";
        }
        else {
            notice.innerHTML = " ";
            setConfirmPasswordVerify(true);
        }
    }

    // const CheckZipCode = (event) => {
    //     var ZipCode = event;
    //     var notice = document.getElementById('noticeZipCode');
    //     if (ifEmpty(ZipCode)) {
    //         notice.innerHTML = " The Zip Code is empty";
    //     }
    //     else if (!is_numeric(ZipCode) )
    //     {
    //         notice.innerHTML = " The Zip Code need to be all numbers";
    //     }
    //     else {
    //         notice.innerHTML = " ";
    //         setZipcodeVerify(true);
    //     }
    // }
    // const CheckPhone = (event) => {
    //     var Phone = event;
    //     var notice = document.getElementById('noticePhone');
    //     if (ifEmpty(Phone)) {
    //         notice.innerHTML = "The phone number is empty";
    //     }
    //     else if (!validAtleast(Phone, 10)) {
    //         notice.innerHTML = "The phone number need atleast 10 number";
    //     }
    //     else {
    //         notice.innerHTML = " ";
    //         setPhoneVerify(true);
    //     }
    // }
           const signup = (
            <div>
                <div className=" titlePage py-2 lg:text-3xl"> Sign Up</div>
                   <Form className="relative justify-center flex lg:block lg:mx-20 content-center ">
              
                    <FormGroup className="mx-4  " action="#" >
                        <div className="largeBold lg:text-lg">Email: </div>
                           <FormControl className="typingArea" onChange={e => { CheckEmail(e.target.value) }} type="email" placeholder="Example@gmail.com"/>
                        <br /><div className="text-red-500 pl-4"id="noticeEmail"></div> <br />
                        <div className="largeBold">Password:</div>
                           <FormControl id="PasswordField" className="typingArea" autoComplete="none" onChange={e => CheckPassword(e.target.value)} type="password" placeholder="Enter Password" />
                           <div className="pl-2 lg:text-lg text-gray-500">Your Password must contain:</div>
                           <div className="pl-6 lg:text-lg text-gray-500">
                           <div>At least one lowercase</div>
                           <div>At least one uppercase</div>
                           <div>At least one number</div>
                           <div>At least one special character</div>
                           <div>At least 8 characters</div>
                           </div>
                           <div className="text-red-500 pl-4" id="noticePassword"></div>
                           
                         
                           <br />
                           <div className="largeBold">Confirm Password:</div>
                           <FormControl className="typingArea" autoComplete="none" type="password" placeholder="Confirm Password" onChange={e => CheckPasswordConfirm(e.target.value)} />
                           <br /><div className="text-red-500 pl-4" id="noticePasswordConfirm"></div> <br />
                           {/* <div className="largeBold">Zip Code:</div>
                           <FormControl className="typingArea" maxLength="5" autoComplete="section-red shipping postal-code" placeholder="Example: 12345" onChange={e => CheckZipCode(e.target.value)} />
                           <br /><div className="text-red-500 pl-4" id="noticeZipCode"></div> <br />
                           <div className="largeBold ">Phone:</div> */}
                           {/* <FormControl className="typingArea" placeholder="Example: 123-456-7890" onChange={e => CheckPhone(e.target.value)} />
                           <br /><div className="text-red-500 pl-4" id="noticePhone"></div> <br /> */}
                           <button className="signInButton  " onClick={onRegister} type="submit"  >Create Account</button>
                           
                           <br /> <div className="text-red-500 pl-4" id="noticeAll"></div><br/>
                       
                        <div className="lg:hidden">
                                   <hr className=" bg-orange-600 h-1 " />
                                   <br />
                            <div className="titlePage flex justify-center lg:text-3xl " >Already have an account?</div>
                            <br />
                            <Link to={'/signinpage'}><button className=" signInCreateButton" >Sign In </button></Link>
                            <br /><br />
                            <div className="flex justify-center text-sm lg:text-xl"> By clicking 'Create Account' you are agreeing to the Terms & Conditions and Privacy & Security Statement below</div>
                                   <br />
                        </div>
                        <div className="boldBlueTerm">My Account Terms & Conditions </div>
                        <div className="boldBlueTerm">Privacy & Security Statement</div>
                        <br/>
                    </FormGroup>
                 
                </Form>

            </div>
        );
        return (
            <div>
                {signup}
        </div>
        )

    }
