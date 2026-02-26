import { Slot } from "expo-router";
import { GameLocalProvider } from "@/providers/GameLocalProvider";

export default function GameLocalLayout() {
    return (
        <GameLocalProvider>
            <Slot />
        </GameLocalProvider>
    );
}
