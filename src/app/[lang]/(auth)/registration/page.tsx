import {getDictionary} from '@/lib/i18n';
import {SignUp} from "@/components/auth/RegisterPage";

export default async function RegisterPage({ params: { lang } }: { params: { lang: string } }) {
    const dict = await getDictionary(lang);

    return <SignUp dict={{
        register: dict.auth.register,
        authLayout: dict.auth.authLayout
    }} />;
}