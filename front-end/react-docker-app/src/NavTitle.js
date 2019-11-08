import React from 'react';
import { Link } from 'react-router-dom';

export default props => ( 
    <nav class="flex items-center justify-between flex-wrap bg-orange-600 lg:pt-4 lg:px-20 pt-5 pl-5 pr-5">
        <div class="flex items-center flex-shrink-0 text-white mr-6">
            <span class="font-bold lg:text-3xl sm:text-xl tracking-tight">Quote Center</span>
        </div>
        <div class="block lg:hidden">
            <button class="navbar-burger flex items-center px-3 py-2 border rounded text-orange-200 border-orange-600 hover:text-white hover:border-white">
            <svg class="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/></svg>
            </button>
        </div>
    </nav>
    );