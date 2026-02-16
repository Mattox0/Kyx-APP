import axios from "axios";
import Constants from "expo-constants";

const apiUrl = Constants.expoConfig?.extra?.apiUrl as string;

export const api = axios.create({
    baseURL: apiUrl,
    timeout: 30000,
    headers: {
        "Content-Type": "application/json",
    },
});

// Interceptor pour ajouter le token d'authentification
api.interceptors.request.use((config) => {
    // TODO: récupérer le token depuis expo-secure-store
    // const token = await SecureStore.getItemAsync("authToken");
    // if (token) {
    //     config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
});
