import React, { Component } from "react";
//import { Link, Redirect } from 'react-router-dom';
import { Form, FormGroup, FormControl } from 'react-bootstrap';
import '../css/mainTailwind.css';

export class ForgotPassword extends Component {

    render() {
        const forgotemail = (
            <div>
                <h1 className=" titlePage lg:text-3xl">Reset Password</h1>
                <Form className="relative justify-center flex mb-4 content-center ">
                    <div className="fullPage lg:w-1/3" />
                    <FormGroup className="fullPage lg:w-1/3 " action="#">
                        <p className="largeBold lg:text-lg">Email:</p>
                        <FormControl className="typingArea lg:h-10" type="email" placeholder="Enter Email" />
                        <br /><br />
                        <button className=" signInButton hover:bg-orange-800 lg:h-12 lg:text-xl " type="submit">Reset Password </button>
                    </FormGroup>
                    <div className="fullPage lg:w-1/3" />
                </Form>

            </div>);
        return (
            <div>
                {forgotemail}
            </div>
        )

    }
}
