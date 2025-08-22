import React from 'react';

import {getDictionary} from "@/lib/i18n";
import {ProfilePage} from "@/components/auth/ProfilePage";

interface Props {
    params: Promise<{ lang: string }>;
}

export default async function Profile({params}: Props) {
    const { lang } = await params;
    const dict = await getDictionary(lang);

    return <ProfilePage dict={{
        profile: dict.profile,
        avatar: dict.layout.avatar,
    }}/>
}

