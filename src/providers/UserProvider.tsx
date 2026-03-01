import { createContext, ReactNode, useMemo } from 'react';
import { User } from "@/types/api/User";
import { authClient } from "@/lib/auth";
import { buildAvatarUrl } from "@/components/avatar/Avatar";
import { AvatarOptions } from "@/components/avatar";
import { Gender } from "@/types/Gender";

type UserContextType = {
    user: User | null;
    isLoading: boolean;
};

export const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
    const { data: session, isPending } = authClient.useSession();

    const user = useMemo((): User | null => {
        if (!session?.user) return null;

        const { name, gender, avatarOptions: raw, friendCode } = session.user as typeof session.user & {
            gender: Gender;
            avatarOptions?: string;
            friendCode: string;
        };

        let avatarOptions: AvatarOptions | undefined;
        if (raw) {
            try {
                avatarOptions = typeof raw === 'string' ? JSON.parse(raw) : raw;
            } catch {
                avatarOptions = undefined;
            }
        }

        return {
            name,
            gender,
            avatarOptions,
            avatarUrl: avatarOptions ? buildAvatarUrl(avatarOptions) : undefined,
            friendCode
        };
    }, [session]);

    const value = useMemo(() => ({ user, isLoading: isPending }), [user, isPending]);

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
}
