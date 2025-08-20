import React from 'react';

import {getDictionary} from '@/lib/i18n';
import {EditProfilePage} from "@/components/auth/EditProfilePage";

interface Props {
    params: Promise<{ lang: string }>;
}

export default async function ProfilePage({ params}: Props) {
    const { lang } = await params;
    const dict = await getDictionary(lang);

    return <EditProfilePage dict={dict.editProfile} />;
}