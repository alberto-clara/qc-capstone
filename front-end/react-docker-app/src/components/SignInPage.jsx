import { Link, Redirect } from 'react-router-dom';
import { Form, FormGroup, FormControl } from 'react-bootstrap';
import React, { useState, useContext } from 'react';
import '../css/mainTailwind.css';
import FireBaseSetup from '../FireBaseSetup';

import { Auth } from '../authContext';

export function SignInPage(props) {
    const [emailLogin, setEmail] = useState('');
    const [passwordLogin, setPassword] = useState('');
    const [routeRedirect, setRouteRedirect] = useState(false);

    const { state, dispatch } = useContext(Auth);
    const loginHandle = async (e) => {
        e.preventDefault();
        let response = await FireBaseSetup.login(emailLogin, passwordLogin);
        if (response.user == null) {
            alert(response);
        }
        else {
          
            dispatch({
                type: "LOGIN",
                payload: response.user
            });

            props.history.push("/");
        }
    }
    if (routeRedirect)
        return <Redirect to="/" />
    const login = (
        <div>
            <div className=" titlePage lg:text-3xl"> My Account</div>
            <Form className="relative justify-center flex mb-4 content-center ">
                <div  className="fullPage lg:w-1/3" />
                <FormGroup className="fullPage lg:w-1/3 " action="#">
                    <div className="largeBold lg:text-lg">Email:</div>
                    <FormControl id='emailLogin' autoComplete="none" onChange={e => setEmail(e.target.value)} className="typingArea lg:h-10" type="email" placeholder="Enter Email" />
                    <div className="forgetText"><Link to={'/forgotemail'}> Forgot email?</Link></div>
                    <div className="text-lg font-bold">Password:</div>
                    <FormControl id='passLogin' autoComplete="none" onChange={e => setPassword(e.target.value)} className="current-password typingArea lg:h-10" type="password" placeholder="Enter Password" />
                    <div className="forgetText"><Link to={'/forgotpassword'}>Forgot password?</Link></div>
                    <br />
                    <button  className="signInButton hover:bg-orange-800 lg:text-xl lg:h-12" onClick={loginHandle} type="submit">Sign In</button>
                    <br />
                    <div className=" flex justify-center text-xs lg:text-lg">Please sign in to your account to view <div className="pl-1 underline">more details</div> </div>
                    <br />
                    <div className="flex justify-center font-bold text-lg lg:text-2xl " >Don't have an account?</div>
                    <div className="flex justify-center text-sm lg:text-xl"> Take a few moments and sign up today!</div>
                    <br />
                    <Link to={'/signuppage'}><button className=" signInCreateButton hover:bg-gray-200 lg:h-12 lg:text-xl " >Create Account </button></Link>
                    <div className="boldBlueTerm lg:text-lg">My Account Terms & Conditions </div>
                    <div className="boldBlueTerm lg:text-lg">Privacy & Security Statement</div>
                    <br />
                </FormGroup>
                <div className="fullPage lg:w-1/3" />
            </Form>

        </div>);
    return (
        <div>
            {login}
        </div>
        )
}
