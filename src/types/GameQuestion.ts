import { NeverHave, Prefer, TruthDare } from "@/types/api/Question";
import { GameUser } from "@/types/api/User";

type GameQuestionBase = { userTarget?: GameUser; userMentioned?: GameUser };

export type NeverHaveQuestion = GameQuestionBase & { questionType: "never-have"; question: NeverHave };
export type PreferQuestion = { userTarget?: GameUser; userMentioned?: GameUser; questionType: "prefer"; question: Prefer };
export type TruthDareQuestion = GameQuestionBase & { questionType: "truth-dare"; question: TruthDare };

export type GameQuestion = NeverHaveQuestion | PreferQuestion | TruthDareQuestion;

export type OnlineGameQuestion = GameQuestion & { questionNumber: number };