import React, { useState, useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';
import '../css/mainTailwind.css';
import FireBaseSetup from "../FireBaseSetup";
import { SignUpPage } from './SignUpPage';
// import { CircularProgress } from '@material-ui/core';

export function Home(props) {
   
    const [name, setName] = useState('');
    const [redirect, setRedirect] = useState(false);
    const searchbar = (<div>
        <div class="mt-4 justify-center flex text-gray-600 lg:px-20 pl-5 pr-5">
            <input class="w-full border-2 border-gray-300 bg-white h-10 px-5 pr-8 text-sm" type="search" name="search" placeholder="Search"></input>
            <button type="submit" class="px-4 py-2 border-2 rounded text-gray-300 border-gray-300 bg-white hover:text-white hover:border-orange-400">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path class="heroicon-ui" fill="gray" d="M16.32 14.9l5.39 5.4a1 1 0 0 1-1.42 1.4l-5.38-5.38a8 8 0 1 1 1.41-1.41zM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z"/></svg>
            </button>
        </div>
    </div>);
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
    return (
        <div  >
            {searchbar}
            {homediv}
        </div>
    );
}

