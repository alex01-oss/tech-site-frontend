"use client"

import React, { useEffect, useState } from 'react'
import { FaFacebook, FaTwitter, FaInstagram, FaGithub, FaLinkedin } from 'react-icons/fa'

const Footer = () => {

    const [year, setYear] = useState(new Date().getFullYear())

    useEffect(() => {
        setYear(new Date().getFullYear())
    }, [])

    return (
        <footer
            className="p-4 bg-rose-600 md:p-8 lg:p-10"
            style={{ backgroundImage: "url('/bg.png')", backgroundSize: "cover", backgroundPosition: "center" }}
        >
            <div className="mx-auto max-w-screen-xl text-center">
                <a href="#" className="flex justify-center items-center text-2xl font-semibold text-gray-900 dark:text-white">
                    <img className="h-20" src="/logo_white.svg" alt="logo" />
                </a>
                <p className="my-6 text-gray-500 dark:text-gray-400">Traditions of Quality since 1966</p>
                <ul className="flex flex-wrap justify-center items-center mb-6 text-gray-900 dark:text-white">
                    <li>
                        <a href="https://facebook.com" target="_blank"><FaFacebook className="mx-4 w-8 h-8 hover:text-blue-500" /></a>
                    </li>
                    <li>
                        <a href="https://twitter.com" target="_blank"><FaTwitter className="mx-4 w-8 h-8 hover:text-blue-400" /></a>
                    </li>
                    <li>
                        <a href="https://instagram.com" target="_blank"><FaInstagram className="mx-4 w-8 h-8 hover:text-pink-500" /></a>
                    </li>
                    <li>
                        <a href="https://github.com" target="_blank"><FaGithub className="mx-4 w-8 h-8 hover:text-gray-300" /></a>
                    </li>
                    <li>
                        <a href="https://linkedin.com" target="_blank"><FaLinkedin className="mx-4 w-8 h-8 hover:text-blue-600" /></a>
                    </li>
                </ul>


                <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
                    <a href="#" className="hover:underline">PJSC “POLTAVA DIAMOND TOOLS”</a>. © Copyright {year}.
                </span>
            </div>
        </footer>
    )
}

export default Footer
