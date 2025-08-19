import React from 'react';

import {getDictionary} from '@/lib/i18n';
import {EditProfilePage} from "@/components/auth/EditProfilePage";

export default async function ProfilePage({ params: { lang } }: { params: { lang: string } }) {
    const dict = await getDictionary(lang);

    return <EditProfilePage dict={dict.editProfile} />;
}