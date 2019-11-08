import React from 'react';
import Layout from './Layout';
import { Route } from 'react-router';
import { SignInPage } from './components/SignInPage';
import { Home } from './components/Home'
import { SignUpPage } from './components/SignUpPage';
import { ForgotEmail } from './components/ForgotEmail';
import { ForgotPassword } from './components/ForgotPassword';
export default () => (
    <Layout>
        <Route exact path='/' component={Home} />
        <Route path='/signinpage' component={SignInPage} />
        <Route path='/signuppage' component={SignUpPage} />
        <Route path='/forgotemail' component={ForgotEmail} />
        <Route path='/forgotpassword' component={ForgotPassword} />
    </Layout>
    );