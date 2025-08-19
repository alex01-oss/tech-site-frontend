import React from 'react';

import {getDictionary} from "@/lib/i18n";
import {ProfilePage} from "@/components/auth/ProfilePage";

export default async function Profile({params: {lang}}: { params: { lang: string }}) {
    const dict = await getDictionary(lang);

    return <ProfilePage dict={dict.profile}/>
}

