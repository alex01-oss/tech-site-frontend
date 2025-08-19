import "../../styles/globals.css";
import ClientProvider from "@/providers/clientsProvider";
import React from "react";
import {LayoutProvider} from "@/contexts/LayoutContext";
import LayoutContent from "@/components/layout/LayoutContent";
import {getDictionary} from "@/lib/i18n";

interface Props {
    children: React.ReactNode;
    params: {
        lang: string;
    };
}

const LanguageLayout = async ({ children, params: { lang } }: Props) => {
    const dict = await getDictionary(lang);

    return (
        <div lang={lang}>
            <ClientProvider>
                <LayoutProvider>
                    <LayoutContent dict={{
                        layout: dict.layout,
                        errorBoundary: dict.errorBoundary
                    }}>
                        {children}
                    </LayoutContent>
                </LayoutProvider>
            </ClientProvider>
        </div>
    );
};

export default LanguageLayout;