import { createContext, ReactNode, useCallback, useMemo, useState } from "react";
import { GameQuestion } from "@/types/GameQuestion";

type GameLocalContextType = {
    questions: GameQuestion[] | null;
    currentQuestion: GameQuestion | null;
    currentIndex: number;
    total: number;
    isFirst: boolean;
    isLast: boolean;
    isFinished: boolean;
    progress: number;
    initQuestions: (gameQuestions: GameQuestion[]) => void;
    nextQuestion: () => void;
    previousQuestion: () => void;
};

export const GameLocalContext = createContext<GameLocalContextType | undefined>(undefined);

type GameLocalProviderProps = {
    children: ReactNode;
};

export function GameLocalProvider({ children }: GameLocalProviderProps) {
    const [questions, setQuestions] = useState<GameQuestion[] | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFinished, setIsFinished] = useState(false);

    const total = questions?.length ?? 0;
    const currentQuestion = questions ? (questions[currentIndex] ?? null) : null;
    const isFirst = currentIndex === 0;
    const isLast = total > 0 ? currentIndex === total - 1 : false;
    const progress = total > 0 ? (currentIndex + 1) / total : 0;

    const initQuestions = useCallback((gameQuestions: GameQuestion[]) => {
        setQuestions(gameQuestions);
        setCurrentIndex(0);
        setIsFinished(false);
    }, []);

    const nextQuestion = useCallback(() => {
        const maxIndex = (questions?.length ?? 1) - 1;
        if (currentIndex >= maxIndex) {
            setIsFinished(true);
        } else {
            setCurrentIndex(prev => prev + 1);
        }
    }, [currentIndex, questions?.length]);

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
        initQuestions,
        nextQuestion,
        previousQuestion,
    }), [questions, currentIndex, currentQuestion, total, isFirst, isLast, isFinished, progress]);

    return (
        <GameLocalContext.Provider value={value}>
            {children}
        </GameLocalContext.Provider>
    );
}
