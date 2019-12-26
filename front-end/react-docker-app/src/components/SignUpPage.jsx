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
    const [emailSignUp, setEmailSignUp] = useState('');
    const [passwordSignUp, setPasswordSignUp] = useState('');

    const { /*state,*/ dispatch } = useContext(Auth);
    const onRegister = async (e) => {
        e.preventDefault();
        console.log(emailVerify);
        console.log(passwordVerify);
        console.log(confirmpasswordVerify );
       
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
   
    const [l1Color, SetL1Color] = useState('text-gray-500');
    const [l2Color, SetL2Color] = useState('text-gray-500');
    const [l3Color, SetL3Color] = useState('text-gray-500');
    const [l4Color, SetL4Color] = useState('text-gray-500');
    const CheckPassword = (event) => {
        var filter = /^(?=.*[A-Z])(?=.*[\W])(?=.*[0-9])(?=.*[a-z].*[a-z]).{8,50}$/;
        var filter1 = /^[a-z]{0,}$/;
        var filter2 = /^[A-Z]{0,}$/;
        var filter3 = /^[0-9]*$/;
        var filter4 = /^[!@#$%^&*()_+]*$/; 
        var filter12 = /^(?=.*[a-z])(?=.*[A-Z])(?!.*\d)(?!.*[!@#$%^&*()_+]).+$/;
        var filter13 = /^(?=.*\d)(?=.*[a-z])(?!.*[A-Z])(?!.*[!@#$%^&*()_+]).+$/;
        var filter14 = /^(?!.*\d)(?=.*[a-z])(?=.*[!@#$%^&*()_+])(?!.*[A-Z]).+$/;
        var filter23 = /^(?=.*\d)(?=.*[A-Z])(?!.*[a-z])(?!.*[!@#$%^&*()_+]).+$/;
        var filter24 = /^(?!.*\d)(?!.*[a-z])(?=.*[!@#$%^&*()_+])(?=.*[A-Z]).+$/;
        var filter124 = /^(?!.*\d)(?=.*[a-z])(?=.*[!@#$%^&*()_+])(?=.*[A-Z]).+$/;
        var filter134 = /^(?=.*\d)(?=.*[a-z])(?=.*[!@#$%^&*()_+])(?!.*[A-Z]).+$/;
        var filter234 = /^(?=.*\d)(?!.*[a-z])(?=.*[!@#$%^&*()_+])(?=.*[A-Z]).+$/;
        var filter34 = /^(?=.*\d)(?!.*[a-z])(?=.*[!@#$%^&*()_+])(?!.*[A-Z]).+$/;
        var filter123 = /^(?=.*\d)(?=.*[a-z])(?!.*[!@#$%^&*()_+])(?=.*[A-Z]).+$/;
       
        var Password = event;
        var notice = document.getElementById('noticePassword');
     
        SetL1Color('text-gray-500');
        SetL2Color('text-gray-500');
        SetL3Color('text-gray-500');
        SetL4Color('text-gray-500');
        if (ifEmpty(Password)) {
            notice.innerHTML = "The Password is empty";
        }
        else if (validEmail(filter1, Password)) {
            SetL1Color('text-green-400');
        }
        else if (validEmail(filter2, Password)) {
            SetL2Color('text-green-400');
        }
        else if (validEmail(filter3, Password)) {
            SetL3Color('text-green-400');
        }
        else if (validEmail(filter4, Password)) {
            SetL4Color('text-green-400');
        }
        else if (validEmail(filter12, Password)) {
            SetL1Color('text-green-400');
            SetL2Color('text-green-400');
        }
        else if (validEmail(filter13, Password)) {
            SetL1Color('text-green-400');
            SetL3Color('text-green-400');
        }
        else if (validEmail(filter14, Password)) {
            SetL1Color('text-green-400');
            SetL4Color('text-green-400');
        }
        else if (validEmail(filter124, Password)) {
            SetL1Color('text-green-400');
            SetL2Color('text-green-400');
            SetL4Color('text-green-400');
        }
        else if (validEmail(filter134, Password)) {
            SetL1Color('text-green-400');
            SetL3Color('text-green-400');
            SetL4Color('text-green-400');
        }
        else if (validEmail(filter23, Password)) {
            SetL2Color('text-green-400');
            SetL3Color('text-green-400');
        }
        else if (validEmail(filter234, Password)) {
            SetL2Color('text-green-400');
            SetL3Color('text-green-400');
            SetL4Color('text-green-400');
        }
        else if (validEmail(filter24, Password)) {
            SetL2Color('text-green-400');
            SetL4Color('text-green-400');
        }
        else if (validEmail(filter34, Password)) {
            SetL3Color('text-green-400');
            SetL4Color('text-green-400');
        }
        else if (validEmail(filter123, Password)) {
            SetL1Color('text-green-400');
            SetL2Color('text-green-400');
            SetL3Color('text-green-400');
        }

        else if (!validAtleast(Password, 8)) {
            notice.innerHTML = "The Password needs atleast 8 characters";
        }
        else if (!validEmail(filter, Password)) {
            notice.innerHTML = "The password is invalid. It needs at least a lower, upper, and special character";
        }
        else if (validEmail(filter,Password)){
            notice.innerHTML = " ";
            SetL1Color('text-green-400');
            SetL2Color('text-green-400');
            SetL3Color('text-green-400');
            SetL4Color('text-green-400');
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
                           <div className="pl-2 lg:text-lg text-gray-800">Your Password must contain at least 8 characters:</div>
                           <div className="pl-6 lg:text-lg text-gray-500">
                           <div id="line1" className={l1Color}>At least one lowercase</div>
                           <div id="line2" className={l2Color}>At least one uppercase</div>
                           <div id="line3" className={l3Color}>At least one number</div>
                           <div id="line4" className={l4Color}>At least one special character</div>
                
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
