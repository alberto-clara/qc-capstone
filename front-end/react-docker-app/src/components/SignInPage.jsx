import React, { Component } from "react";
import { Link, Redirect } from 'react-router-dom';
import { Form, FormGroup, FormControl } from 'react-bootstrap';
import '../css/mainTailwind.css';

export class SignInPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userid: 'homedepot',
            pasword: '123456',
            authorized: false
        };
        this.triggerFunction = this.triggerFunction.bind(this);
    }
    triggerFunction() {
        const UserState = { id: this.state.userid, pass: this.state.pasword };
        const UserLogin = { id: document.getElementById("emailForm").value, pass: document.getElementById("passForm").value };
        UserLogin.id === UserState.id && UserLogin.pass === UserState.pass ? this.setState({ authorized: true }) : this.setState({ authorize: false });
    }
    render() {      
        const login = (
            <div>
                <h1 className=" titlePage lg:text-3xl"> My Account</h1>
                <Form className="relative justify-center flex mb-4 content-center ">  
                    <div className="fullPage lg:w-1/3"/>
                    <FormGroup className="fullPage lg:w-1/3 " action="#">                  
                        <p className="largeBold lg:text-lg">Email:</p>
                        <FormControl id= 'emailForm' className="typingArea lg:h-10" type="email" placeholder="Enter Email" />
                        <p className="forgetText"><Link to={'/forgotemail'}> Forgot email?</Link></p>
                        <p className="text-lg font-bold">Password:</p>
                        <FormControl id='passForm' className="typingArea lg:h-10" type="password" placeholder="Enter Password" />
                        <p className="forgetText"><Link to={'/forgotpassword'}>Forgot password?</Link></p>
                        <br/>
                        <button className="signInButton hover:bg-orange-800 lg:text-xl lg:h-12" type="submit" onClick={this.triggerFunction}>Sign In</button>
                        <br />
                        <p className=" flex justify-center text-xs lg:text-lg">Please sign in to your account to view  <p className="pl-1 underline">more details</p> </p>
                        <br />
                        <p className="flex justify-center font-bold text-lg lg:text-2xl " >Don't have an account?</p>
                        <p className="flex justify-center text-sm lg:text-xl"> Take a few moments and sign up today!</p>
                        <br/>
                        <Link to={'/signuppage'}><button className=" signInCreateButton hover:bg-gray-200 lg:h-12 lg:text-xl " type="submit">Create Account </button></Link>
                        <p className="boldBlueTerm lg:text-lg">My Account Terms & Conditions </p>
                        <p className="boldBlueTerm lg:text-lg">Privacy & Security Statement</p>
                        <br/>
                    </FormGroup>
                    <div className="fullPage lg:w-1/3"/>
                </Form>

            </div>);
        return (
            <div>
                {this.state.authorized? <Redirect to ='/'/>:login} 
        </div>
        )

    }
}
