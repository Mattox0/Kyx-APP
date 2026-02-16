import {createContext, ReactNode, useCallback, useEffect, useMemo, useState} from 'react';
import * as SecureStore from 'expo-secure-store';
import {User} from "@/types/api/User";

const USER_STORAGE_KEY = 'user';

type UserContextType = {
    user: User | null;
    setUser: (user: User | null) => void;
    isLoading: boolean;
};

export const UserContext = createContext<UserContextType | undefined>(undefined);

type UserProviderProps = {
    children: ReactNode;
};

export function UserProvider({ children }: UserProviderProps) {
    const [user, setUserState] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const stored = await SecureStore.getItemAsync(USER_STORAGE_KEY);
                if (stored) {
                    setUserState(JSON.parse(stored));
                }
            } catch (e) {
                console.error('Failed to load user from secure storage', e);
            } finally {
                setIsLoading(false);
            }
        };
        loadUser();
    }, []);

    const setUser = useCallback(async (newUser: User | null) => {
        setUserState(newUser);
        try {
            if (newUser) {
                await SecureStore.setItemAsync(USER_STORAGE_KEY, JSON.stringify(newUser));
            } else {
                await SecureStore.deleteItemAsync(USER_STORAGE_KEY);
            }
        } catch (e) {
            console.error('Failed to save user to secure storage', e);
        }
    }, []);

    const value = useMemo(() => ({
        user,
        setUser,
        isLoading,
    }), [user, setUser, isLoading]);

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
}
