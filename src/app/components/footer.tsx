"use client"

import React, { useEffect, useState } from 'react'
import { FaFacebook, FaInstagram, FaLinkedin, FaYoutube, FaXTwitter } from 'react-icons/fa6'

const Footer = () => {
    const [year, setYear] = useState(new Date().getFullYear())

    useEffect(() => {
        setYear(new Date().getFullYear())
    }, [])

    return (
        <footer
            className="p-4 bg-[#ab2140] dark:bg-[#7a172d] md:p-8 lg:p-10"
            style={{ backgroundImage: "url('/bg.png')", backgroundSize: "cover", backgroundPosition: "center" }}
        >
            <div className="mx-auto max-w-screen-xl text-center">
                {/* logo */}
                <a href="#" className="flex justify-center items-center text-2xl font-semibold text-white">
                    <img className="h-20" src="/logo_white.svg" alt="logo" />
                </a>

                {/* slogan */}
                <p className="my-6 text-white/80 dark:text-white/70">
                    Traditions of Quality since 1966
                </p>

                {/* social networks */}
                <ul className="flex flex-wrap justify-center items-center mb-6 text-white/90 dark:text-white/80">
                    <li>
                        <a href="https://facebook.com" target="_blank" className="transition-colors duration-200">
                            <FaFacebook className="mx-3 w-8 h-8 hover:text-blue-400 dark:hover:text-blue-300" />
                        </a>
                    </li>
                    <li>
                        <a href="https://instagram.com" target="_blank" className="transition-colors duration-200">
                            <FaInstagram className="mx-3 w-8 h-8 hover:text-pink-400 dark:hover:text-pink-300" />
                        </a>
                    </li>
                    <li>
                        <a href="https://youtube.com" target="_blank" className="transition-colors duration-200">
                            <FaYoutube className="mx-3 w-8 h-8 hover:text-red-400 dark:hover:text-red-300" />
                        </a>
                    </li>
                    <li>
                        <a href="https://linkedin.com" target="_blank" className="transition-colors duration-200">
                            <FaLinkedin className="mx-3 w-8 h-8 hover:text-blue-400 dark:hover:text-blue-300" />
                        </a>
                    </li>
                    <li>
                        <a href="https://x.com" target="_blank" className="transition-colors duration-200">
                            <FaXTwitter className="mx-3 w-8 h-8 hover:text-gray-300 dark:hover:text-gray-400" />
                        </a>
                    </li>
                </ul>

                {/* copyright */}
                <span className="text-sm text-white/80 dark:text-white/70 sm:text-center">
                    <a href="https://pdt.tools/" className="hover:text-white dark:hover:text-white transition-colors duration-200">
                        PJSC "POLTAVA DIAMOND TOOLS"
                    </a>. © Copyright {year}.
                </span>
            </div>
        </footer>
    )
}

export default Footer