import React from 'react';
import { Link } from 'react-router-dom';
import '../css/mainTailwind.css';
export const ForgotEmail = props => (
    <div className='text-center'>
        <h1 className="titlePage" >Hello, ForgotEmail see you later :)</h1>
        <Link to={'/'} ><button className="signInButton text-center w-2/5">
           Home Run </button> </Link>
    </div>
);