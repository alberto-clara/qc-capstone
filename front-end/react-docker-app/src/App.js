import React from 'react';
import Layout from './Layout';
import { Route, Switch } from 'react-router';
import { SignInPage } from './components/SignInPage';
import { Home } from './components/Home'
import { SignUpPage } from './components/SignUpPage';
import { ForgotEmail } from './components/ForgotEmail';
import { ForgotPassword } from './components/ForgotPassword';
import { PostUserInfo } from './components/PostUserInfo';
import { Product } from './components/Product';
import { ManagePage } from './components/ManageUser'
import { SignIn_SignUp } from './components/SignIn_SignUp';
import { BrowsingList } from './components/BrowsingList';
import { Vendors } from './components/Vendors';

export default () => (
    <Layout>
        <Switch>
            <Route exact path='/' component={Home} />
            <Route path='/signin' component={SignInPage} />
            <Route path='/signuppage' component={SignUpPage} />
            <Route path='/manageuser' component={ManagePage} />
            <Route path='/forgotemail' component={ForgotEmail} />
            <Route path='/forgotpassword' component={ForgotPassword} />
            <Route path='/user/:id' component={PostUserInfo} />
            <Route path="/vendors/:idv" component={Vendors} />
            <Route path='/browsing' component={BrowsingList} />
            <Route path='/signinpage' component={SignIn_SignUp} />
            <Route path="/product/:id" component={Product} />
       </Switch>
    </Layout>
    );