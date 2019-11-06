import React, { Component } from "react";

import { Link } from 'react-router-dom';
import { Form, FormGroup, FormControl } from 'react-bootstrap';
import '../css/mainTailwind.css';

export class SignUpPage extends Component {

    render() {      
        const signup = (
            <div>
                <h1 className=" titlePage lg:text-3xl"> Create Account</h1>
                <Form className="relative justify-center flex mb-4 content-center ">  
                    <div className="fullPage lg:w-1/3"/>
                    <FormGroup className="fullPage lg:w-1/3 " action="#" onSubmit={this.authorize}>
                        <p className="largeBold lg:text-lg">Email: </p>
                        <FormControl className="typingArea lg:h-10" type="email" placeholder="Enter Email"/>
                        <br /> <br />            
                        <p className="text-lg font-bold">Password:</p>
                        <FormControl className="typingArea lg:h-10" type="password" placeholder="Enter Password" />
                        <br/> <br/>
                        <p className="text-lg font-bold">Confirm Password:</p>
                        <FormControl className="typingArea lg:h-10" type="password" placeholder="Confirm Password" /> 
                        <br />  <br /> 
                        <p className="text-lg font-bold">ZipCode:</p>
                        <FormControl className="typingArea lg:h-10" />  
                        <br /> <br />
                        <p className="text-lg font-bold">Phone:</p>
                        <FormControl className="typingArea lg:h-10" /> 
                        <br /> <br />
                        <button className="signInButton hover:bg-orange-800 lg:text-xl lg:h-12" type="submit" onClick={this.triggerFunction}  >Create Account</button>
                        <br /> <br />
                        <hr className=" bg-orange-600 h-1" />
                        <br /> 
                        <p className="flex justify-center font-bold text-lg lg:text-2xl " >Already have an account?</p>
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
}
