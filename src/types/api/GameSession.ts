import { GameStatus } from "@/types/GameStatus";
import { Question } from "@/types/api/Question";
import { GameType } from "@/types/GameType";

export interface GameSession {
    gameId: string,
    gameType: GameType,
    status: GameStatus,
    hostId: string,
    modeIds: string[]
    previousQuestionsIds: string[],
    currentQuestion: Question | null;
}