import axios from "axios";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";

const apiUrl = Constants.expoConfig?.extra?.apiUrl as string;
const slug = Constants.expoConfig?.extra?.slug as string;

export const api = axios.create({
    baseURL: apiUrl + "/api",
    timeout: 30000,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(async (config) => {
    const cookieJson = await SecureStore.getItemAsync(`${slug}_cookie`);
    if (cookieJson) {
        try {
            const cookies: Record<string, { value: string; expires?: string }> = JSON.parse(cookieJson);
            const cookieHeader = Object.entries(cookies)
                .filter(([, c]) => !c.expires || new Date(c.expires) > new Date())
                .map(([key, c]) => `${key}=${c.value}`)
                .join('; ');
            if (cookieHeader) {
                config.headers.Cookie = cookieHeader;
            }
        } catch {}
    }
    return config;
});
