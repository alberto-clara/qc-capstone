import React, { useEffect } from 'react';
import '../css/mainTailwind.css';

import { SignUpPage } from './SignUpPage';
import { SignInPage } from './SignInPage';

export const SignIn_SignUp=(props) => {

    useEffect(() => {
        document.title = `Home Depot - Account`;
    });
    return (
        <div>
            <div className="lg:hidden">
                <SignInPage/>
            </div>
            <div className="hidden lg:flex lg:mx-10 ">
                <div className="w-1/2  border-r-4 border-orange-600">
                    <SignInPage/>
                </div>
                <div className=" lg:w-1/2 ">
                    <SignUpPage/>
                </div>
            </div>
        </div>
        );
}