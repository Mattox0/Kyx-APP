import { useContext } from "react";
import { GameOnlineContext } from "@/providers/GameOnlineProvider";

export default function useGameOnline() {
    const context = useContext(GameOnlineContext);
    if (!context) {
        throw new Error("useGameOnline must be used within a GameOnlineProvider");
    }
    return context;
}
