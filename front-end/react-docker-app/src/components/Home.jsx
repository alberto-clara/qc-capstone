import React from 'react';
import { Link } from 'react-router-dom';
export const Home = props => (
    <div>
        <h1>Hello, world Home!</h1>
        <Link to="/signinpage">
            SigninPlease</Link>
        
    </div>
);