import { WordingKey } from "@/utils/i18n-service";

export interface GameMode {
    id: GameModeId;
    name: WordingKey;
    description: WordingKey;
    tags: string[];
    howToPlay: WordingKey;
    example: WordingKey;
}

export enum GameModeId {
    TRUTHDARE = "truth-dare",
    NEVERHAVE = "never-have",
    PREFER = "prefer"
}

export const GameModes: GameMode[] = [
    {
        id: GameModeId.TRUTHDARE,
        name: "mode.games.truth-dare.name",
        description: "mode.games.truth-dare.description",
        tags: ["4 Modes", "Local ou en ligne"],
        howToPlay: "mode.games.truth-dare.howToPlay",
        example: "mode.games.truth-dare.example",
    },
    {
        id: GameModeId.NEVERHAVE,
        name: "mode.games.never-have.name",
        description: "mode.games.never-have.description",
        tags: ["4 Modes", "Local ou en ligne"],
        howToPlay: "mode.games.never-have.howToPlay",
        example: "mode.games.never-have.example",
    },
    {
        id: GameModeId.PREFER,
        name: "mode.games.prefer.name",
        description: "mode.games.prefer.description",
        tags: ["5 Modes", "Local ou en ligne"],
        howToPlay: "mode.games.prefer.howToPlay",
        example: "mode.games.prefer.example",
    },
]
