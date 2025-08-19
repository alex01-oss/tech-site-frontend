import {getDictionary} from '@/lib/i18n';
import {SignIn} from "@/components/auth/LoginPage";

export default async function LoginPage({ params: { lang } }: { params: { lang: string } }) {
    const dict = await getDictionary(lang);

    return <SignIn dict={{
        login: dict.auth.login,
        authLayout: dict.auth.authLayout
    }} />;
}