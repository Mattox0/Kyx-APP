import axios from "axios";
import Constants from "expo-constants";
import { getCookieHeader } from "@/utils/auth";

const apiUrl = Constants.expoConfig?.extra?.apiUrl as string;

export const api = axios.create({
    baseURL: apiUrl,
    timeout: 30000,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(async (config) => {
    const cookieHeader = await getCookieHeader();
    if (cookieHeader) {
        config.headers.Cookie = cookieHeader;
    }
    return config;
});
