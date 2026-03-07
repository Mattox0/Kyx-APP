import { WordingKey } from "@/utils/i18n-service";

export interface GameMode {
    id: GameModeId;
    name: WordingKey;
    description: WordingKey;
    tags: WordingKey[];
    howToPlay: WordingKey;
    example: WordingKey;
    comingSoon?: boolean;
}

export enum GameModeId {
    TRUTHDARE = "truth-dare",
    NEVERHAVE = "never-have",
    PREFER = "prefer",
    PURITYTEST = "purity-test",
    DEBATS = "debats",
}

export const GameModes: GameMode[] = [
    {
        id: GameModeId.TRUTHDARE,
        name: "mode.games.truth-dare.name",
        description: "mode.games.truth-dare.description",
        tags: ["mode.tags.4modes", "mode.tags.localOrOnline"],
        howToPlay: "mode.games.truth-dare.howToPlay",
        example: "mode.games.truth-dare.example",
    },
    {
        id: GameModeId.NEVERHAVE,
        name: "mode.games.never-have.name",
        description: "mode.games.never-have.description",
        tags: ["mode.tags.4modes", "mode.tags.localOrOnline"],
        howToPlay: "mode.games.never-have.howToPlay",
        example: "mode.games.never-have.example",
    },
    {
        id: GameModeId.PREFER,
        name: "mode.games.prefer.name",
        description: "mode.games.prefer.description",
        tags: ["mode.tags.5modes", "mode.tags.localOrOnline"],
        howToPlay: "mode.games.prefer.howToPlay",
        example: "mode.games.prefer.example",
    },
    {
        id: GameModeId.PURITYTEST,
        name: "mode.games.purity-test.name",
        description: "mode.games.purity-test.description",
        tags: ["mode.tags.6categories", "mode.tags.local"],
        howToPlay: "mode.games.purity-test.howToPlay",
        example: "mode.games.purity-test.example",
        comingSoon: true,
    },
    {
        id: GameModeId.DEBATS,
        name: "mode.games.debats.name",
        description: "mode.games.debats.description",
        tags: ["mode.tags.4modes", "mode.tags.localOrOnline"],
        howToPlay: "mode.games.debats.howToPlay",
        example: "mode.games.debats.example",
        comingSoon: true,
    },
]
