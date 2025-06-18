import {useEffect} from "react";
import {useAuthStore} from "@/features/auth/store";

export function AuthInitializer() {
    useEffect(() => {
        useAuthStore.getState().initialize().then(() => {});
    }, [])

    return null;
}