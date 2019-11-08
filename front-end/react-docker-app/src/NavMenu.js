import React from 'react';
import { Link } from 'react-router-dom';
import NavTitle from './NavTitle';

export default props => ( 
    <nav class="lg:w-full justify-end flex items-center flex-wrap bg-orange-600 lg:px-20 pb-5 pr-5 pl-5">
        <div id="main-nav" class="flex-row w-full block flex-grow lg:flex lg:flex-grow w-auto">
            <div class="text-sm lg:flex-grow">
                <a href="/" class="lg:text-lg block mt-4 lg:inline-block text-orange-100 hover:text-white hover:font-bold mr-6">
                    Home
                </a>
                <a href="SignInPage" class="lg:text-lg block mt-4 lg:inline-block text-orange-100 hover:text-white hover:font-bold mr-6">
                    My Account
                </a>
                <a href="#responsive-header" class="lg:text-lg block mt-4 lg:inline-block text-orange-100 hover:text-white hover:font-bold mr-6">
                    Cart
                </a>
                <a href="#responsive-header" class="lg:text-lg block mt-4 lg:inline-block text-orange-100 hover:text-white hover:font-bold mr-6">
                    Contact
                </a>
            </div>
            <div class="pt-2">
                <Link to={'/signinpage'}>
                    <button class="lg:w-auto sm:w-24 py-2 px-4 inline-block leading-none border rounded text-white text-sm lg:text-lg hover:border-transparent hover:text-orange-500 hover:bg-white">
                            Sign-In
                    </button>
                </Link>
            </div>
            <div class="pt-2">
                <Link to={'/signuppage'}>
                    <button class="lg:w-auto sm:w-24 py-2 px-4 inline-block leading-none border rounded text-white text-sm lg:text-lg hover:border-transparent hover:text-orange-500 hover:bg-white">
                            Sign-Up
                    </button>
                </Link>
            </div>
        </div>
    </nav>
    );

    // Navbar Toggle
document.addEventListener('DOMContentLoaded', function () {
    var $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0); // Get all "navbar-burger" elements
    if ($navbarBurgers.length > 0) { // Check if there are any navbar burgers
        var $target = document.getElementById('main-nav') // Get the "main-nav" element
        $target.classList.toggle('hidden');
        // Add a click event on each of them // Toggle the class on "main-nav"
        $navbarBurgers.forEach(function ($el) {$el.addEventListener('click', function(){$target.classList.toggle('hidden');});});
    }
  });