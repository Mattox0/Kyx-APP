import { Redirect, Slot } from "expo-router";
import { GameOnlineProvider } from '@/providers/GameOnlineProvider';
import useUser from "@/hooks/use-user";

export default function GameOnlineLayout() {
    const { user, isLoading } = useUser();

    if (!isLoading && !user) {
        return <Redirect href="/auth" />;
    }

    return (
        <GameOnlineProvider>
            <Slot />
        </GameOnlineProvider>
    );
}
