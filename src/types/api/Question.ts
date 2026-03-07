import { Mode } from "@/types/api/Mode";
import { ChallengeType } from "@/types/ChallengeType";

export interface Q {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    mode: Mode;
}

export interface NeverHave extends Q {
    question: string;
}

export interface Prefer extends Q {
    choiceOne: string;
    choiceTwo: string;
}

export interface TruthDare extends Q {
    question: string;
    type: ChallengeType;
}

export type Question = NeverHave | TruthDare | Prefer;