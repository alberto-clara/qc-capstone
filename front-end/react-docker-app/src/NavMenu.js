import React, { useState, useContext, useEffect, Fragment } from 'react';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { Auth } from '../src/authContext';
import FireBaseSetup from './FireBaseSetup';
 function NavMenu(props) {
    const [stateNav, setStateNave] = useState(null);
    const [userEmail, setUserEmail] = useState("");
    const { state, dispatch } = useContext(Auth);
    let buttons ;
    useEffect(() => {
        FireBaseSetup.isInitialized().then(user => {
            if (user) {
                setStateNave(user);
                setUserEmail(user.email);
            }
        });
    });

    const logout = () => {
        FireBaseSetup.logout();
        setStateNave(null);
        props.history.replace("/");
        return dispatch(
            {
                type: "LOGOUT",
                payload: {}
            });

    }
    if (stateNav != null || state.user.hasOwnProperty("user")) {
        buttons = (<Fragment>
            <div>{userEmail} <div className="inline"> | </div><button className="hover:text-white hover:font-bold" onClick={logout}>Log Out</button></div>

        </Fragment>)}
    else {
        buttons = (<Fragment>
            <Link to="/signinpage"> Sign In </Link>
            <Link to="/signuppage"> Sign Up</Link>
        </Fragment>)
    }
    return (
        <nav className="flex flex-wrap bg-orange-500 lg:px-20 pr-5 pl-5">
            <div id="main-nav" className="lg:flex flex-1">
                <div className="text-sm lg:flex-grow">
                    <Link to={'/'}>
                    <div className="lg:text-lg block lg:my-0 sm:my-2 lg:inline-block text-orange-100 hover:text-white hover:font-bold mr-6">
                        Home
                    </div>
                    </Link>
                    <div href="#responsive-header" className="lg:text-lg block lg:my-0 sm:my-2 lg:inline-block text-orange-100 hover:text-white hover:font-bold mr-6">
                        Browse
                    </div>
                    <div href="#responsive-header" className="lg:text-lg block lg:my-0 sm:my-2 lg:inline-block text-orange-100 hover:text-white hover:font-bold mr-6">
                        Special & Offers
                    </div>
                    <div href="#responsive-header" className="lg:text-lg block lg:my-0 sm:my-2 lg:inline-block text-orange-100 hover:text-white hover:font-bold mr-6">
                        Contact Us
                    </div>
                </div>
            </div>
            <div className="hidden lg:flex">
                <div className="lg:text-lg lg:block lg:my-0 lg:inline-block lg:text-orange-100">
                    {buttons}
                </div>
               
            </div>
            <div className="sm:hidden lg:flex">
                <div className="lg:text-lg block lg:my-0 sm:my-2 lg:inline-block text-orange-100">
                    {buttons}
            </div>
            </div>
        </nav>
    );
}
// Navbar Toggle
document.addEventListener('DOMContentLoaded', function () {
    var $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0); // Get all "navbar-burger" elements
    if ($navbarBurgers.length > 0) { // Check if there are any navbar burgers
        var $target = document.getElementById('main-nav') // Get the "main-nav" element
        $target.classList.toggle('hidden');
        // Add a click event on each of them // Toggle the className on "main-nav"
        $navbarBurgers.forEach(function ($el) {$el.addEventListener('click', function(){$target.classList.toggle('hidden');});});
    }
});
export default withRouter(NavMenu);
