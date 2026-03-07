import { User } from "@/types/api/User";
import { Mode } from "@/types/api/Mode";
import { GameType } from "@/types/GameType";

export interface Game {
    id: string;
    gameType: GameType;
    modes: Mode[];
    creator: User | null;
    isLocal: boolean;
    code: string | null;
    startedAt: Date;
    endedAt: Date | null;
}