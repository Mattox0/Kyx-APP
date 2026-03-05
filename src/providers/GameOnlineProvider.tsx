import { createContext, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import Constants from "expo-constants";
import { getSessionToken } from "@/utils/auth";
import { OnlineUser } from "@/types/api/User";
import { GameStatus } from "@/types/GameStatus";
import { GameSession } from "@/types/api/GameSession";
import { useLocalSearchParams } from "expo-router";

const apiUrl = Constants.expoConfig?.extra?.apiUrl as string;

type GameOnlineContextType = {
    players: OnlineUser[];
    myUser: OnlineUser | null;
    isConnected: boolean;
    isKicked: boolean;
    code: string | null;
    game: GameSession | null;
    status: GameStatus | null;
    kickUser: (userId: string) => void;
    startGame: () => void;
};

export const GameOnlineContext = createContext<GameOnlineContextType | undefined>(undefined);

export function GameOnlineProvider({ children }: { children: ReactNode }) {
    const { code: codeParam } = useLocalSearchParams<{ code: string }>();
    const code = codeParam ?? null;

    const socketRef = useRef<Socket | null>(null);
    const [players, setPlayers] = useState<OnlineUser[]>([]);
    const [myUser, setMyUser] = useState<OnlineUser | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isKicked, setIsKicked] = useState(false);
    const [status, setStatus] = useState<GameStatus | null>(null);
    const [game, setGame] = useState<GameSession | null>(null);

    const kickUser = useCallback((userId: string) => {
        socketRef.current?.emit('kickUser', { userId });
    }, []);

    const startGame = useCallback(() => {
        socketRef.current?.emit('startGame');
    }, []);

    useEffect(() => {
        if (!code) return;

        (async () => {
            const token = await getSessionToken();

            const socket = io(`${apiUrl}/game`, {
                auth: { token },
                query: { code },
                transports: ["websocket"],
            });

            socketRef.current = socket;

            socket.on("connect", () => setIsConnected(true));
            socket.on("disconnect", () => setIsConnected(false));

            socket.on("game", ({ game }: { game: GameSession }) => {
                setGame(game);
            });

            socket.on("playerJoined", ({ player, players }: { player: OnlineUser, players: OnlineUser[] }) => {
                setPlayers(players);
                setMyUser(players.find(p => p.socketId === socket.id) || null);
            });

            socket.on("playerLeft", ({ userId, players }: { userId: string, players: OnlineUser[] }) => {
                setPlayers(players);
            });

            socket.on("kicked", () => {
                setIsKicked(true);
            });

            socket.on("status", ({ status }: { status: GameStatus }) => {
                setStatus(status);
            })
        })();

        return () => {
            socketRef.current?.disconnect();
            socketRef.current = null;
            setPlayers([]);
            setIsConnected(false);
            setIsKicked(false);
        };
    }, [code]);

    const value = useMemo(() => ({
        players,
        myUser,
        isConnected,
        isKicked,
        code,
        game,
        status,
        kickUser,
        startGame
    }), [players, isConnected, isKicked, code, game, myUser, status]);

    return (
        <GameOnlineContext.Provider value={value}>
            {children}
        </GameOnlineContext.Provider>
    );
}
