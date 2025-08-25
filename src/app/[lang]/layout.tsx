import "../../styles/globals.css";
import ClientProvider from "@/providers/СlientsProvider";
import React from "react";
import LayoutContent from "@/components/layout/LayoutContent";
import {getDictionary} from "@/lib/i18n";
import {Metadata} from "next";
import {DictionaryProvider} from "@/providers/DictionaryProvider";

interface Props {
    children: React.ReactNode;
    params: Promise<{ lang: string }>;
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
    const {lang} = await params;
    const dict = await getDictionary(lang);

    return {
        title: {
            default: dict.metadata.title,
            template: "%s | PDT Tools",
        },
        description: dict.metadata.description,
        keywords: dict.metadata.keywords.split(', '),
        openGraph: {
            title: dict.metadata.title,
            description: dict.metadata.description,
            url: "https://pdt.tools",
            siteName: "PDTools",
            images: [
                {
                    url: "/og-image.jpg",
                    width: 1200,
                    height: 630,
                },
            ],
            locale: lang === 'uk' ? 'uk_UA' : 'en_US',
            type: "website",
        },
    };
}

const LanguageLayout = async ({children, params}: Props) => {
    const {lang} = await params;
    const dict = await getDictionary(lang);

    return (
        <div lang={lang}>
            <DictionaryProvider dict={dict}>
                <ClientProvider>
                    <LayoutContent>
                        {children}
                    </LayoutContent>
                </ClientProvider>
            </DictionaryProvider>
        </div>
    );
};

export default LanguageLayout;