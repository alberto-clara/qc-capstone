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
        return dispatch({
            type: "LOGOUT",
            payload: {}
        });

    }
    if (stateNav != null || state.user.hasOwnProperty("user")) {
        buttons = (<Fragment>
            {userEmail}
            <div className="inline"> | </div>
            <button onClick={logout}>
                Log Out
            </button>

        </Fragment>)}
    else {
        buttons = (<Fragment></Fragment>)
    }
    return (
        <nav className="NavMenu_Container">
            <div id="main-nav" className="lg:flex lg:flex-grow flex-1">
                <Link to={'/'}>
                    <div className="NavMenu_Text">
                        Home
                    </div>
                </Link>
                <Link to={'/'}>
                    <div className="NavMenu_Text">
                        Browse
                    </div>
                </Link>
                <Link to={'/'}>
                    <div className="NavMenu_Text">
                        Special & Offers
                    </div>
                </Link>
                <Link to={'/'}>
                    <div className="NavMenu_Text">
                        Contact Us
                    </div>
                </Link>
                <Link to={'/product'}>
                    <div className="NavMenu_Text">
                        Product
                    </div>
                </Link>
            </div>
            <div className="hidden lg:flex">
                <div className="NavMenu_Sign_Text">
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
