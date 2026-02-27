import { NeverHave, Prefer, TruthDare } from "@/types/api/Question";
import { GameUser } from "@/types/api/User";

type GameQuestionBase = { userTarget?: GameUser };

export type NeverHaveQuestion = GameQuestionBase & { questionType: "never-have"; question: NeverHave };
export type PreferQuestion = GameQuestionBase & { questionType: "prefer"; question: Prefer };
export type TruthDareQuestion = GameQuestionBase & { questionType: "truth-dare"; question: TruthDare };

export type GameQuestion = NeverHaveQuestion | PreferQuestion | TruthDareQuestion;