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
    const token = await SecureStore.getItemAsync(`${slug}.better-auth.session_token`);
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
