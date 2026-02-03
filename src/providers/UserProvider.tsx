import {createContext, ReactNode, useMemo} from 'react';

type UserContextType = {
    name: string;
    gender: string;
    skinOptions: string[];
};

export const UserContext = createContext<UserContextType | undefined>(undefined);

type UserProviderProps = {
    children: ReactNode;
};

export function UserProvider({ children }: UserProviderProps) {
    /*return (
        <UserContext.Provider value={{ }}>
            {children}
        </UserContext.Provider>
    );*/
}
