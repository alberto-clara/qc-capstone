import React from 'react';
import Layout from './Layout';
import { Route } from 'react-router';
import { SignInPage } from './components/SignInPage';
import { Home } from './components/Home'
import { SignUpPage } from './components/SignUpPage';
import { ForgotEmail } from './components/ForgotEmail';
import { ForgotPassword } from './components/ForgotPassword';

import { Product } from './components/Product';

import { SignIn_SignUp } from './components/SignIn_SignUp';
import { BrowsingList } from './components/BrowsingList';
import { Vendors } from './components/Vendors';

export default () => (
    <Layout>
        <Route exact path='/' component={Home} />
        <Route path='/signin' component={SignInPage} />
        <Route path='/signuppage' component={SignUpPage} />
        <Route path='/forgotemail' component={ForgotEmail} />
        <Route path='/forgotpassword' component={ForgotPassword} />

        <Route path="/vendors/:idv" component={Vendors} />
        <Route path='/browsing' component={BrowsingList} />
        <Route path='/signinpage' component={SignIn_SignUp} />

        <Route path="/product/:id" component={Product} />
      

    </Layout>
    );