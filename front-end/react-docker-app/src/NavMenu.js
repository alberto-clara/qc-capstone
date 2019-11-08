import React from 'react';
import { Link } from 'react-router-dom';
import NavTitle from './NavTitle';

export default props => ( 
    <nav class="lg:w-full justify-end flex items-center flex-wrap bg-orange-600 lg:px-20 pb-5 pr-5 pl-5">
        <div id="main-nav" class="flex-row w-full block flex-grow lg:flex lg:flex-grow lg:items-center w-auto">
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
            <div class="object-center .w-3/4 lg:pt-0 sm:pt-12">
                <a href="SignInPage" class="lg:text-lg inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-orange-500 hover:bg-white">
                    Sign-In
                </a>
            </div>
            <div class="object-center .w-3/4 lg:pt-0 sm:pt-2">
                <a href="SignUpPage" class="lg:text-lg inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-orange-500 hover:bg-white">
                    Create Account
                </a>
            </div>
        </div>
    </nav>
    );

    // Navbar Toggle
document.addEventListener('DOMContentLoaded', function () {

    // Get all "navbar-burger" elements
    var $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);
  
    // Check if there are any navbar burgers
    if ($navbarBurgers.length > 0) {
        // Get the "main-nav" element
        var $target = document.getElementById('main-nav')
        $target.classList.toggle('hidden');

      // Add a click event on each of them
      $navbarBurgers.forEach(function ($el) {
        $el.addEventListener('click', function () {  
          // Toggle the class on "main-nav"
          $target.classList.toggle('hidden');
  
        });
      });
    }
  });