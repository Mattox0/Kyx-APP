import { createAuthClient } from "better-auth/react";
import { expoClient } from "@better-auth/expo/client";
import * as SecureStore from "expo-secure-store";
import Constants from "expo-constants";

const apiUrl = Constants.expoConfig?.extra?.apiUrl as string;
const slug = Constants.expoConfig?.extra?.slug as string;

export const authClient = createAuthClient({
    baseURL: apiUrl,
    plugins: [
        expoClient({
            scheme: slug,
            storagePrefix: slug,
            storage: SecureStore,
        }),
    ],
});
