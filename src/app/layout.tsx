import "../styles/globals.css";
import React from "react";
import {Montserrat} from "next/font/google";
import {Metadata} from "next";

const montserrat = Montserrat({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
    metadataBase: new URL("https://yourdomain.com"),
    robots: {
        index: true,
        follow: true,
    },
    icons: {
        icon: "/logo.ico",
        shortcut: "/favicon-16x16.png",
        apple: "/apple-touch-icon.png",
    },
};

export default function RootLayout({children}: { children: React.ReactNode }) {
    return (
        <html suppressHydrationWarning>
        <body
            className={`${montserrat.className} antialiased`}
            suppressHydrationWarning
        >
        {children}
        </body>
        </html>
    );
}