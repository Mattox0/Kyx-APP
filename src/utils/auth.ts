import * as SecureStore from "expo-secure-store";
import Constants from "expo-constants";

const slug = Constants.expoConfig?.extra?.slug as string;

export async function getCookieHeader(): Promise<string | undefined> {
    const cookieJson = await SecureStore.getItemAsync(`${slug}_cookie`);
    if (!cookieJson) return undefined;
    try {
        const cookies: Record<string, { value: string; expires?: string }> = JSON.parse(cookieJson);
        const cookieHeader = Object.entries(cookies)
            .filter(([, c]) => !c.expires || new Date(c.expires) > new Date())
            .map(([key, c]) => `${key}=${c.value}`)
            .join("; ");
        return cookieHeader || undefined;
    } catch {
        return undefined;
    }
}

export async function getSessionToken(): Promise<string | undefined> {
    const cookieJson = await SecureStore.getItemAsync(`${slug}_cookie`);
    if (!cookieJson) return undefined;
    try {
        const cookies: Record<string, { value: string; expires?: string }> = JSON.parse(cookieJson);
        const entry = cookies["better-auth.session_token"];
        if (!entry) return undefined;
        if (entry.expires && new Date(entry.expires) <= new Date()) return undefined;
        return entry.value;
    } catch {
        return undefined;
    }
}
