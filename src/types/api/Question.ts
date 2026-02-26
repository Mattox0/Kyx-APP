export interface NeverHave {
    id: string;
    question: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Prefer {
    id: string;
    choiceOne: string;
    choiceTwo: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface TruthDare {
    id: string;
    question: string;
}

export type Question = NeverHave | TruthDare | Prefer;