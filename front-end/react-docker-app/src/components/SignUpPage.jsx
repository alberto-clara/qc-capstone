import React, { useState, useContext } from "react";
import { Auth } from '../authContext';
import { Link } from 'react-router-dom';
import { Form, FormGroup, FormControl } from 'react-bootstrap';
import '../css/mainTailwind.css';
import FireBaseSetup from "../FireBaseSetup";

export function SignUpPage(props) {
    const [emailSignUp, setEmailSignUp] = useState('');
    const [passwordSignUp, setPasswordSignUp] = useState('');
    const [zipcodeSignUp, setZipcodeSignUp] = useState('');
    const [phoneSignUp, setPhoneSignUp] = useState('');
    const [loading, setLoading] = useState(false);

    const { state, dispatch } = useContext(Auth);
    const onRegister = async (e) => {
        e.preventDefault();
        //console.log(state);

        let response = await FireBaseSetup.register(emailSignUp, passwordSignUp);
        if (response.user == null) {
            alert(response);
        }
        else {
            dispatch({
                type: "SIGNUP",
                payload: response
            })


            props.history.push('/');
        }

    }
           const signup = (
            <div>
                <h1 className=" titlePage py-2 lg:text-3xl"> Create Account</h1>
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
                        <br/>
                    </FormGroup>
                    <div className="fullPage lg:w-1/3"/>
                </Form>

            </div>
        );
        return (
            <div>
                {signup}
        </div>
        )

    }
