import { useContext } from 'react';
import { GameLocalContext } from "@/providers/GameLocalProvider";

export default function useGameLocal() {
    const context = useContext(GameLocalContext);

    if (!context) {
        throw new Error('useGameLocal must be used within a GameLocalProvider');
    }

    return context;
}
