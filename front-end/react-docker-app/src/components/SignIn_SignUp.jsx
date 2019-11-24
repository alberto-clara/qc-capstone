
import React from 'react';
import '../css/mainTailwind.css';

import { SignUpPage } from './SignUpPage';
import { SignInPage } from './SignInPage';
export function SignIn_SignUp(props) {
  
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