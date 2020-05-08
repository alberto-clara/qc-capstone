import React, { useEffect, useState, useContext, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import { Auth } from '../src/authContext';
import FireBaseSetup from './FireBaseSetup';
import axios from 'axios';
import { GetCart, TokenHeader } from './ListOfLinks';

const NavTitle = (props)=> {
    const [stateNav, setStateNave] = useState(null);
    const { state } = useContext(Auth);
    const [countItem, setCountItem] = useState(0);
    const [/*userToken*/, setUserToken] = useState("");
    let buttonManage;
    useEffect(() => {
        FireBaseSetup.isInitialized().then(user => {
            if (user) {
                user.getIdToken().then(function (idToken) {      
                    setUserToken(idToken); 
                    fetching(idToken);
                });
                setStateNave(user);
            }
        });
            
        
    }, []);
    const fetching =(idToken) => {
        axios.get(GetCart, TokenHeader(idToken)).then((res) => {
  
            setCountItem(res.data.offerings.length);
        }).catch((e) => { setCountItem(0); });
       
    }

    if (stateNav != null || state.user.hasOwnProperty("user")) {
  
        buttonManage = (<Fragment>
            <Link to={'/manageuser'}>
                <button alt="button">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><title>Account</title><path fill="white" d="M12 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0-2a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm9 11a1 1 0 0 1-2 0v-2a3 3 0 0 0-3-3H8a3 3 0 0 0-3 3v2a1 1 0 0 1-2 0v-2a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5v2z" /></svg>
                </button>
            </Link>
        </Fragment>)
    }
    else {
        buttonManage = (<Fragment>
            <Link to={'/signinpage'}>
                <button alt="button">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><title>Account</title><path fill="white" d="M12 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0-2a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm9 11a1 1 0 0 1-2 0v-2a3 3 0 0 0-3-3H8a3 3 0 0 0-3 3v2a1 1 0 0 1-2 0v-2a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5v2z" /></svg>
                </button>
            </Link>
        </Fragment>)
    }
    return (
        <nav className="flex px-5">
            <div className="lg:hidden pt-4 pr-4">
                <button className="navbar-burger NavTitle_Icons_Boxed" alt="button">
                    <svg className="fill-current h-6 w-6" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Menu</title><path fill="white" d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" /></svg>
                </button>
            </div>
            <div className="flex-1 text-white text-lg mr-6 lg:pl-0 sm:pl-2 pt-4">
                <Link to={'/'}>
                    <span className="font-bold lg:text-3xl sm:text-2xl text-white">Quote Center</span>
                </Link>
            </div>
            <div className="flex p-4">
               
                <Link to={'/cart'}>
              
                    <button onClick={() => { if (props.location.pathname === "/cart") window.location.href = '/cart'; }} alt="button">
                        <div className="flex mr-6">
                            <svg className="h-8 w-8" fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 70">
                                <circle cx="82.5" cy="62.5" r="7.5" />
                                <rect x="30" y="45" width="60" height="5" />
                                <circle cx="37.5" cy="62.5" r="7.5" />
                                <rect width="15" height="5" />
                                <polygon points="35 50 30 50 10 0 15 0 35 50" />
                                </svg>
                            <div className="text-white text-sm flex font-bold -ml-4"> {countItem}</div>       
                        </div>             
                    </button>
                
                </Link>
               
                <div>{buttonManage}</div>
            </div>
        </nav>
    )
}
export default withRouter(NavTitle);