import { createContext, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import Constants from "expo-constants";
import { getCookieHeader } from "@/utils/auth";
import { OnlineUser } from "@/types/api/User";
import { GameStatus } from "@/types/GameStatus";
import { GameSession } from "@/types/api/GameSession";
import { useLocalSearchParams } from "expo-router";
import { GameQuestion, OnlineGameQuestion } from "@/types/GameQuestion";

const apiUrl = Constants.expoConfig?.extra?.apiUrl as string;

export type QuestionResults = Record<string, number>;

type GameOnlineContextType = {
    players: OnlineUser[];
    myUser: OnlineUser | null;
    isConnected: boolean;
    isKicked: boolean;
    isGameOver: boolean;
    code: string | null;
    game: GameSession | null;
    currentQuestion: GameQuestion | null;
    questionResults: QuestionResults | null;
    cardsCount: number | null;
    status: GameStatus | null;
    answersCount: number;
    progress: number;
    kickUser: (userId: string) => void;
    startGame: () => void;
    submitAnswer: (answer: string | null) => void;
    nextQuestion: () => void;
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
    const [currentQuestion, setCurrentQuestion] = useState<GameQuestion | null>(null);
    const [questionResults, setQuestionResults] = useState<QuestionResults | null>(null);
    const [cardsCount, setCardsCount] = useState<number | null>(null);
    const [answersCount, setAnswersCount] = useState<number>(0);
    const [isGameOver, setIsGameOver] = useState(false);

    const kickUser = useCallback((userId: string) => {
        socketRef.current?.emit('kickUser', { userId });
    }, []);

    const startGame = useCallback(() => {
        socketRef.current?.emit('startGame');
    }, []);

    const submitAnswer = useCallback((answer: string | null) => {
        socketRef.current?.emit('submitAnswer', { answer });
    }, []);

    const nextQuestion = useCallback(() => {
        socketRef.current?.emit('nextQuestion');
    }, []);

    const progress = useMemo(() => cardsCount ? (cardsCount + 1) / 100 : 0, [cardsCount]);

    useEffect(() => {
        if (!code) return;

        (async () => {
            const cookie = await getCookieHeader();

            const socket = io(`${apiUrl}/game`, {
                auth: { cookie },
                query: { code },
                transports: ["websocket"],
            });

            socketRef.current = socket;

            socket.on("connect", () => setIsConnected(true));
            socket.on("disconnect", () => setIsConnected(false));

            socket.on("game", (game: GameSession) => {
                setGame(game);
            });

            socket.on("kicked", () => {
                setIsKicked(true);
            });

            socket.on("status", (status: GameStatus) => {
                setStatus(status);
            });

            socket.on("currentQuestion", (question: OnlineGameQuestion) => {
                const { questionNumber, ...questionWithoutCards } = question;
                setQuestionResults(null);
                setCardsCount(questionNumber);
                setCurrentQuestion(questionWithoutCards);
                setIsGameOver(false);
            });

            socket.on("players", (players: OnlineUser[]) => {
                setPlayers(players);
                setMyUser(players.find(p => p.socketId === socket.id) || null);
            });

            socket.on("answersCount", (count: number) => {
                setAnswersCount(count);
            });

            socket.on("results", (results: QuestionResults) => {
                setQuestionResults(results);
            });

            socket.on("gameOver", () => {
                setIsGameOver(true);
            });
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
        isGameOver,
        code,
        game,
        status,
        currentQuestion,
        questionResults,
        cardsCount,
        progress,
        answersCount,
        kickUser,
        startGame,
        submitAnswer,
        nextQuestion
    }), [players, isConnected, isKicked, isGameOver, code, game, myUser, status, currentQuestion, questionResults, cardsCount, progress, answersCount]);

    return (
        <GameOnlineContext.Provider value={value}>
            {children}
        </GameOnlineContext.Provider>
    );
}
