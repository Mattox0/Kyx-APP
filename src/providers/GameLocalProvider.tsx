import { createContext, ReactNode, useCallback, useMemo, useRef, useState } from "react";
import { GameQuestion } from "@/types/GameQuestion";
import { api } from "@/lib/api";

type GameLocalContextType = {
    questions: GameQuestion[] | null;
    currentQuestion: GameQuestion | null;
    currentIndex: number;
    total: number;
    isFirst: boolean;
    isLast: boolean;
    isFinished: boolean;
    progress: number;
    gameId: string | null;
    setGameId: (gameId: string) => void;
    initQuestions: (gameQuestions: GameQuestion[]) => void;
    nextQuestion: () => void;
    previousQuestion: () => void;
    endGame: () => void;
};

export const GameLocalContext = createContext<GameLocalContextType | undefined>(undefined);

type GameLocalProviderProps = {
    children: ReactNode;
};

export function GameLocalProvider({ children }: GameLocalProviderProps) {
    const [questions, setQuestions] = useState<GameQuestion[] | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [gameId, setGameId] = useState<string | null>(null);
    const hasEndedRef = useRef(false);
    const currentIndexRef = useRef(0);
    currentIndexRef.current = currentIndex;

    const endGame = useCallback(() => {
        if (!gameId || hasEndedRef.current) return;
        hasEndedRef.current = true;
        api.post(`/game/${gameId}/ended`).catch(() => {});
    }, [gameId]);

    const total = questions?.length ?? 0;
    const currentQuestion = questions ? (questions[currentIndex] ?? null) : null;
    const isFirst = currentIndex === 0;
    const isLast = total > 0 ? currentIndex === total - 1 : false;
    const progress = total > 0 ? (currentIndex + 1) / total : 0;

    const initQuestions = useCallback((gameQuestions: GameQuestion[]) => {
        hasEndedRef.current = false;
        setQuestions(gameQuestions);
        setCurrentIndex(0);
        setIsFinished(false);
    }, []);

    const nextQuestion = useCallback(() => {
        const maxIndex = (questions?.length ?? 1) - 1;
        if (currentIndexRef.current >= maxIndex) {
            setIsFinished(true);
        } else {
            setCurrentIndex(prev => prev + 1);
        }
    }, [questions?.length]);

    const previousQuestion = useCallback(() => {
        setCurrentIndex(prev => Math.max(prev - 1, 0));
    }, []);

    const value = useMemo(() => ({
        questions,
        currentQuestion,
        currentIndex,
        total,
        isFirst,
        isLast,
        isFinished,
        progress,
        gameId,
        setGameId,
        initQuestions,
        nextQuestion,
        previousQuestion,
        endGame,
    }), [questions, currentIndex, currentQuestion, total, isFirst, isLast, isFinished, progress, gameId]);

    return (
        <GameLocalContext.Provider value={value}>
            {children}
        </GameLocalContext.Provider>
    );
}
