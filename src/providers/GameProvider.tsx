import {createContext, ReactNode, useMemo, useState} from 'react';
import {GameMode} from "@/types/GameMode";
import {Mode} from "@/types/api/Mode";
import {GameUser} from "@/types/api/User";

type GameContextType = {
    game: GameMode | null;
    setGame: (game: GameMode) => void;
    modes: Mode[] | null;
    setModes: (modes: Mode[]) => void;
    onlineMode: boolean | null;
    setOnlineMode: (onlineMode: boolean) => void;
    users: GameUser[] | null;
    setUsers: (gameUsers: GameUser[]) => void;
};

export const GameContext = createContext<GameContextType | undefined>(undefined);

type GameProviderProps = {
    children: ReactNode;
};

export function GameProvider({ children }: GameProviderProps) {
    const [game, setGame] = useState<GameMode | null>(null);
    const [modes, setModes] = useState<Mode[] | null>(null);
    const [users, setUsers] = useState<GameUser[] | null>(null);
    const [onlineMode, setOnlineMode] = useState<boolean | null>(null);

    const value = useMemo(() => ({
        game,
        setGame,
        modes,
        setModes,
        onlineMode,
        setOnlineMode,
        users,
        setUsers,
    }), [game, modes, onlineMode, users]);

    return (
        <GameContext.Provider value={value}>
            {children}
        </GameContext.Provider>
    );
}
