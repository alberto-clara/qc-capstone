import React from 'react';
import { Link } from 'react-router-dom';

export default props => ( 
    <nav className="flex flex-wrap bg-orange-500 lg:px-20 pr-5 pl-5">
        <div id="main-nav" className="lg:flex">
            <div className="text-sm lg:flex-grow">
                <Link to={'/'}>
                    <div className="lg:text-lg block lg:my-0 sm:my-2 lg:inline-block text-orange-100 hover:text-white hover:font-bold mr-6">
                        Home
                    </div>
                </Link>
                <div href="#responsive-header" className="lg:text-lg block lg:my-0 sm:my-2 lg:inline-block text-orange-100 hover:text-white hover:font-bold mr-6">
                    Departments
                </div>
                <div href="#responsive-header" className="lg:text-lg block lg:my-0 sm:my-2 lg:inline-block text-orange-100 hover:text-white hover:font-bold mr-6">
                    Special & Offers
                </div>
                <Link to={'signinpage'}>
                    <div className="lg:text-lg block lg:my-0 sm:my-2 lg:inline-block text-orange-100 hover:text-white hover:font-bold mr-6">
                        My Account
                    </div>
                </Link>
                <div href="#responsive-header" className="lg:text-lg block lg:my-0 sm:my-2 lg:inline-block text-orange-100 hover:text-white hover:font-bold mr-6">
                    Contact Us
                </div>
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
        // Add a click event on each of them // Toggle the className on "main-nav"
        $navbarBurgers.forEach(function ($el) {$el.addEventListener('click', function(){$target.classList.toggle('hidden');});});
    }
});