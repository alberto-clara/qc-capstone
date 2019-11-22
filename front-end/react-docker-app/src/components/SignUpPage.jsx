import React, { useState, useContext,useEffect } from "react";
import { Auth } from '../authContext';
import { Link } from 'react-router-dom';
import { Form, FormGroup, FormControl } from 'react-bootstrap';
import '../css/mainTailwind.css';
import FireBaseSetup from "../FireBaseSetup";

export function SignUpPage(props) {
    const [emailSignUp, setEmailSignUp] = useState('');
    const [passwordSignUp, setPasswordSignUp] = useState('');
<<<<<<< Updated upstream
    const [zipcodeSignUp, setZipcodeSignUp] = useState('');
    const [phoneSignUp, setPhoneSignUp] = useState('');
    const [loading, setLoading] = useState(false);
=======
>>>>>>> Stashed changes

    const { state, dispatch } = useContext(Auth);
    const onRegister = async (e) => {
        e.preventDefault();
<<<<<<< Updated upstream
        //console.log(state);

        let response = await FireBaseSetup.register(emailSignUp, passwordSignUp);
        if (response.user == null) {
            alert(response);
        }
        else {
=======
        console.log(CheckEmail());
        console.log(CheckPassword());
        console.log(CheckPasswordConfirm() );
        console.log(CheckZipCode());
        console.log(CheckPhone());
        if (CheckEmail() && CheckPassword() && CheckPasswordConfirm() && CheckZipCode() && CheckPhone()) {
            var response = await FireBaseSetup.register(emailSignUp, passwordSignUp);

                    if (response.user == null) {
             alert(response);
                 }
                     else {
>>>>>>> Stashed changes
            dispatch({
                type: "SIGNUP",
                payload: response
            })
<<<<<<< Updated upstream


=======
>>>>>>> Stashed changes
            props.history.push('/');
                 }
        }
        else {
            props.history.replace('/signuppage');
        }
<<<<<<< Updated upstream

=======
        

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
        var filter = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var Email = event;
        console.log(Email);
        var notice = document.getElementById('noticeEmail');
        if (ifEmpty(Email)) {
            notice.innerHTML = "The email is empty";
            return false;
        }
        else if (validEmail(filter, Email) === false) {
            notice.innerHTML = "The email is invalid";
            return false;
        }
        else {    

            return true;
        }
    }

    const CheckPassword = (event) => {
        var filter = /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z].*[a-z]).{8,50}$/;
        var Password = event;
        var notice = document.getElementById('noticePassword');
        if (ifEmpty(Password)) {
            notice.innerHTML = "The Password is empty";
            return false;
        }
        else if (!validAtleast(Password, 8)) {
            notice.innerHTML = "The Password needs atleast 8 characters";
            return false;
        }
       else if (!validEmail(filter,Password)) {
            notice.innerHTML = "The password is invalid";
            return false;
        }
      
        else {
            notice.innerHTML = " ";
            return true;
        }
    }

    const CheckPasswordConfirm = (event) => {
        var PasswordConfirm = event;
        var Password = passwordSignUp;
        var notice = document.getElementById('noticePasswordConfirm');

        if (ifEmpty(PasswordConfirm) || (PasswordConfirm !== Password)) {
            notice.innerHTML = "The Password and Confirm Passwordshould need to be the same";
            return false;
        }
        else {
            notice.innerHTML = "";
            return true;
        }
    }

    const CheckZipCode = (event) => {
        var ZipCode = event;
        var notice = document.getElementById('noticeZipCode');
        if (ifEmpty(ZipCode)) {
            notice.innerHTML = " The Zip Code is empty";
            return false;
        }
        else if (!is_numeric(ZipCode) )
        {
            notice.innerHTML = " The Zip Code need to be all numbers";
            return false;
        }
        else {
            notice.innerHTML = "";
            return true;
        }
    }
    const CheckPhone = (event) => {
        var Phone = event;
        var notice = document.getElementById('noticePhone');
        if (ifEmpty(Phone)) {
            notice.innerHTML = "The phone number is empty";
            return false;
        }
        else if (!validAtleast(Phone, 10)) {
            notice.innerHTML = "The phone number need atleast 10 number";
            return false;
        }
        else {
            notice.innerHTML = "";
            return true;
        }
>>>>>>> Stashed changes
    }
           const signup = (
            <div>
                <h1 className=" titlePage py-2 lg:text-3xl"> Create Account</h1>
<<<<<<< Updated upstream
                <Form className="relative justify-center flex mb-4 content-center ">
                    <div className="fullPage lg:w-1/3"/>
                    <FormGroup className="fullPage lg:w-1/3 " action="#" >
                        <p className="largeBold lg:text-lg">Email: </p>
                        <FormControl className="typingArea lg:h-10" onChange={e => setEmailSignUp(e.target.value)} type="email" placeholder="Enter Email"/>
                        <br /> <br />
                        <p className="largeBold text-lg font-bold">Password:</p>
                        <FormControl className="typingArea lg:h-10"  autoComplete="none" onChange={e => setPasswordSignUp(e.target.value)} type="password" placeholder="Enter Password" />
                        <br/> <br/>
                        <p className="largeBold text-lg font-bold">Confirm Password:</p>
                        <FormControl className="typingArea lg:h-10"  autoComplete="none"  type="password" placeholder="Confirm Password" />
                        <br />  <br />
                        <p className="largeBold text-lg font-bold">Zip Code:</p>
                           <FormControl className="typingArea lg:h-10" autoComplete="section-red shipping postal-code" onChange={e => setZipcodeSignUp(e.target.value)}/>
                        <br /> <br />
                        <p className="largeBold text-lg font-bold">Phone:</p>
                        <FormControl className="typingArea lg:h-10" onChange={e => setPhoneSignUp(e.target.value)} />
                        <br /> <br />
                        <button className="signInButton hover:bg-orange-800 lg:text-xl lg:h-12" onClick={onRegister} type="submit"  >Create Account</button>
                        <br /> <br />
                        <hr className=" bg-orange-600 h-1" />
                        <br />
                        <p className="largeBold flex justify-center font-bold text-lg lg:text-2xl " >Already have an account?</p>
                        <br />
                        <Link to={'/signinpage'}><button className=" signInCreateButton hover:bg-gray-200 lg:h-12 lg:text-xl " type="submit">Sign In </button></Link>
                        <br />  <br />
                        <p className="flex justify-center text-sm lg:text-xl"> By clicking 'Create Account' you are agreeing to the Terms & Conditions and Privacy & Security Statement below</p>
                        <br />
                        <p className="boldBlueTerm lg:text-lg">My Account Terms & Conditions </p>
                        <p className="boldBlueTerm lg:text-lg">Privacy & Security Statement</p>
=======
                <Form className="relative justify-center flex content-center ">
                    <div className="mx-4 lg:w-1/3"/>
                    <FormGroup className="mx-4 lg:w-1/3 " action="#" >
                        <p className="largeBold lg:text-lg">Email: </p>
                           <FormControl className="typingArea" onChange={e => { CheckEmail(e.target.value) }} type="email" placeholder="Example@gmail.com"/>
                        <br /><div className="text-red-500 pl-4"id="noticeEmail"></div> <br />
                        <p className="largeBold">Password:</p>
                           <FormControl className="typingArea" autoComplete="none" onChange={e => CheckPassword(e.target.value)} type="password" placeholder="Enter Password" />
                           <br /><div className="text-red-500 pl-4" id="noticePassword"></div> <br />
                           <div className="pl-2">Your Password must contain at least:</div>
                           <li className="passwordHint"> 8 charaters. </li>
                           <li className="passwordHint"> Lowercase character. </li>
                           <li className="passwordHint"> Uppercase character. </li>
                           <li className="passwordHint"> Digits(0-9) character. </li>
                           <li className="passwordHint"> Special character </li>
                           <br />
                           <p className="largeBold">Confirm Password:</p>
                           <FormControl className="typingArea" autoComplete="none" type="password" placeholder="Confirm Password" onChange={e => CheckPasswordConfirm(e.target.value)} />
                           <br /><div className="text-red-500 pl-4" id="noticePasswordConfirm"></div> <br />
                           <p className="largeBold">Zip Code:</p>
                           <FormControl className="typingArea" maxLength="5" autoComplete="section-red shipping postal-code" placeholder="Example: 12345" onChange={e => CheckZipCode(e.target.value)} />
                           <br /><div className="text-red-500 pl-4" id="noticeZipCode"></div> <br />
                        <p className="largeBold ">Phone:</p>
                           <FormControl className="typingArea" placeholder="Example: 123-456-7890" onChange={e => CheckPhone(e.target.value)} />
                           <br /><div className="text-red-500 pl-4" id="noticePhone"></div> <br />
                           <button className="signInButton " onClick={onRegister} type="submit"  >Create Account</button>
                          <br/><br/>
                        <hr className=" bg-orange-600 h-1 " />
                        <br />
                        <p className="titlePage flex justify-center lg:text-3xl " >Already have an account?</p>
                        <br />
                        <Link to={'/signinpage'}><button className=" signInCreateButton" >Sign In </button></Link>
                        <br />  <br />
                        <p className="flex justify-center text-sm lg:text-xl"> By clicking 'Create Account' you are agreeing to the Terms & Conditions and Privacy & Security Statement below</p>
                        <br />
                        <p className="boldBlueTerm">My Account Terms & Conditions </p>
                        <p className="boldBlueTerm">Privacy & Security Statement</p>
>>>>>>> Stashed changes
                        <br/>
                    </FormGroup>
                    <div className="mx-4 lg:w-1/3"/>
                </Form>

            </div>
        );
        return (
            <div>
                {signup}
        </div>
        )

    }
