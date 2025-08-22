import {getDictionary} from '@/lib/i18n';
import {SignUp} from "@/components/auth/RegisterPage";

interface Props {
    params: Promise<{ lang: string }>;
}

export default async function RegisterPage({ params }: Props) {
    const { lang } = await params;
    const dict = await getDictionary(lang);

    return <SignUp dict={{
        register: dict.auth.register,
        formWrapper: dict.auth.formWrapper,
        passwordField: dict.auth.passwordField,
    }} />;
}