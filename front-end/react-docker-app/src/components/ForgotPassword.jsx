import React from 'react';
import { Link } from 'react-router-dom';
import '../css/mainTailwind.css';
export const ForgotPassword = props => (
    <div>
        <h1 className="titlePage" >Hello, Forgotpassword? see you later :)</h1>
        <div className='text-center'>
        <Link to={'/'} ><button className="signInButton text-center w-2/5">
            Home Run </button> </Link>
        </div>
    </div>
);