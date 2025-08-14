import {useEffect} from "react";
import {useAuthStore} from "@/features/auth/store";

export function AuthInitializer() {
    useEffect(() => {
        void useAuthStore.getState().initialize();
    }, [])

    return null;
}