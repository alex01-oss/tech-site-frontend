import {getDictionary} from '@/lib/i18n';
import {SignIn} from "@/components/auth/LoginPage";

interface Props {
    params: Promise<{ lang: string }>;
}

export default async function LoginPage({ params }: Props) {
    const { lang } = await params;
    const dict = await getDictionary(lang);

    return <SignIn dict={{
        login: dict.auth.login,
        formWrapper: dict.auth.formWrapper,
        passwordField: dict.auth.passwordField
    }} />;
}