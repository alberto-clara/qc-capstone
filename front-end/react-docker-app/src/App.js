import React from 'react';
import Layout from './Layout';
import { Route } from 'react-router';
import { SignInPage } from './components/SignInPage';
import { Home } from './components/Home'
export default () => (
    <Layout>
        <Route exact path='/' component={Home} />
        <Route path='/signinpage' component={SignInPage} />
    </Layout>
    );