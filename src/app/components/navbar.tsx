"use client"

import React, { useState } from 'react'

const Navbar = () => {
    const [isMobileMenuVisible, setIsMobileMenuVisible] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuVisible(!isMobileMenuVisible);
    };

    return (
        <nav className="bg-[#ab2140] dark:bg-[#7a172d] border-gray-200 relative">
            <div className="max-w-screen-xl flex flex-wrap items-center mx-auto p-4">

                {/* navbar */}
                <div className="flex items-center justify-between w-full md:w-auto">

                    {/* logo */}
                    <a href="https://pdt.tools/" className="flex items-center space-x-3 rtl:space-x-reverse">
                        <img className="h-12" src="/logo_white.svg" alt="logo" />
                    </a>

                    {/* burger menu button */}
                    <button
                        onClick={toggleMobileMenu}
                        type="button"
                        className="inline-flex md:hidden items-center p-2 w-10 h-10 justify-center text-sm text-white rounded-lg hover:bg-[#c13351] focus:outline-none focus:ring-2 focus:ring-[#db4163] dark:hover:bg-[#8f1d36] dark:focus:ring-[#a3223d]"
                    >
                        <span className="sr-only">Open main menu</span>
                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
                        </svg>
                    </button>

                </div>

                {/* navigation */}
                <div className={`${isMobileMenuVisible ? 'block' : 'hidden'} w-full md:flex md:w-auto md:absolute md:left-1/2 md:transform md:-translate-x-1/2`} id="navbar-search">
                    <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 bg-[#ab2140] dark:bg-[#7a172d]">
                        <li>
                            <a href="#" className="block py-2 px-3 text-white bg-[#c13351] rounded-sm md:bg-transparent md:text-white md:p-0 md:dark:text-white font-bold" aria-current="page">Home</a>
                        </li>
                        <li>
                            <a href="#" className="block py-2 px-3 text-white rounded-sm hover:bg-[#c13351] md:hover:bg-transparent md:hover:text-gray-300 md:p-0 md:dark:hover:text-gray-300 dark:text-white dark:hover:bg-[#8f1d36] dark:hover:text-white md:dark:hover:bg-transparent">About</a>
                        </li>
                        <li>
                            <a href="#" className="block py-2 px-3 text-white rounded-sm hover:bg-[#c13351] md:hover:bg-transparent md:hover:text-gray-300 md:p-0 dark:text-white md:dark:hover:text-gray-300 dark:hover:bg-[#8f1d36] dark:hover:text-white md:dark:hover:bg-transparent">Services</a>
                        </li>
                    </ul>
                </div>

                {/* search */}
                <div className="hidden md:flex md:order-2 md:w-auto ml-auto">
                    <div className="relative">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-500 dark:text-gray-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                            </svg>
                            <span className="sr-only">Search icon</span>
                        </div>
                        <input
                            type="text"
                            id="search-navbar"
                            className="block w-full p-2 ps-10 text-sm text-gray-900 border border-[#c13351] rounded-lg bg-white focus:ring-[#db4163] focus:border-[#db4163] dark:bg-[#661424] dark:border-[#8f1d36] dark:placeholder-gray-300 dark:text-white dark:focus:ring-[#a3223d] dark:focus:border-[#a3223d]"
                            placeholder="Search..."
                        />
                    </div>
                </div>

            </div>
        </nav>
    )
}

export default Navbar