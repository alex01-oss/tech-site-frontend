import {Geist, Geist_Mono} from "next/font/google";
import "../styles/globals.css";
import {Metadata} from "next";
import ClientProvider from "@/providers/clientsProvider";
import React from "react";
import {LayoutProvider} from "@/contexts/LayoutContext";
import LayoutContent from "@/components/layout/LayoutContent";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    metadataBase: new URL("https://yourdomain.com"),
    title: {
        default: "PDTools - Poltava Diamond Tools",
        template: "%s | PDT Tools",
    },
    description:
        "Professional diamond tools manufacturer since 1966. High-quality construction and stone processing tools.",
    keywords: [
        "diamond tools",
        "construction tools",
        "stone processing",
        "PDTools",
    ],
    openGraph: {
        title: "PDTools - Poltava Diamond Tools",
        description: "Professional diamond tools manufacturer since 1966",
        url: "https://pdt.tools",
        siteName: "PDTools",
        images: [
            {
                url: "/og-image.jpg",
                width: 1200,
                height: 630,
            },
        ],
        locale: "en_US",
        type: "website",
    },
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

export default function RootLayout({children}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ClientProvider>
            <LayoutProvider>
                <LayoutContent>
                    {children}
                </LayoutContent>
            </LayoutProvider>
        </ClientProvider>
        </body>
        </html>
    );
}