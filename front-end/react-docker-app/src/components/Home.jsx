import React, { useState, useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';
import '../css/mainTailwind.css';
import FireBaseSetup from "../FireBaseSetup";
import { SignUpPage } from './SignUpPage';
import { CircularProgress } from '@material-ui/core';

export function Home(props) {
   
    const [name, setName] = useState('');
    const [redirect, setRedirect] = useState(false);
    const homediv = (<div>
        <div className="text text-red-500 text-center font-black" >Hello, HomeDepot!</div>
        <div className="titlePage" id="userEmail" >{FireBaseSetup.displayEmail()}  </div>
        <button className="signInButton" onClick={() => { reload() }} >Redirect</button> <br/> <br/>
        <button className="signInButton" onClick={() => { logoutClick() }} >Log out</button>
    </div>);
   
    function reload() {
       setName(FireBaseSetup.displayEmail());
        console.log(name);
      //  window.location.reload(true);
    }   
    async function logoutClick() {
        await FireBaseSetup.logout();
        props.history.push('/signinpage');
    }
/*
    useEffect(() => {       //Run after DOM 
         //  setName(FireBaseSetup.displayEmail());
       // console.log(name);
 
    }, []);
 */
    return (
        <div  >
            {homediv}
        </div>
    );
}

