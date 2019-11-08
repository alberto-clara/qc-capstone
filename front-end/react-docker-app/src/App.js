import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import './css/mainTailwind.css';
import { Route, Switch } from 'react-router';
import { SignInPage } from './components/SignInPage';
import { Home } from './components/Home'
import { SignUpPage } from './components/SignUpPage';
import { ForgotEmail } from './components/ForgotEmail';
import { ForgotPassword } from './components/ForgotPassword';
import './FireBaseSetup';
import FireBaseSetup from './FireBaseSetup';
import {CircularProgress } from '@material-ui/core'
export default function App() {

    const [firebaseInitialized, setFirebaseInitialized] = useState(false)

    useEffect(() => {
        FireBaseSetup.isInitialized().then(val => {
            setFirebaseInitialized(val)
        })
    });
    const AllRoute=(
        <Switch>
            <Route exact path='/' component={Home} />
            <Route path='/signinpage' component={SignInPage} />
            <Route path='/signuppage' component={SignUpPage} />
            <Route path='/forgotemail' component={ForgotEmail} />
            <Route path='/forgotpassword' component={ForgotPassword} />
        </Switch>);
    const loader = (
        <div className="flex">
            <div className="w-5/12"></div>
            <div className="w-1/12 "><CircularProgress  className="justify-center relative text-center" /></div>
            <div className="w-5/12 "></div>
        </div>
    );

    return firebaseInitialized !== false ? (
        <Layout> {AllRoute}</Layout>) : (< Layout>{loader}</ Layout >);
}
