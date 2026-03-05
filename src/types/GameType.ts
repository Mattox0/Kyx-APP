export enum GameType {
    NEVER_HAVE = 'neverHave',
    PREFER = 'prefer',
    TRUTH_DARE = 'truthDare',
}

export const GameTypeToRoute: Record<GameType, string> = {
    [GameType.NEVER_HAVE]: 'never-have',
    [GameType.PREFER]: 'prefer',
    [GameType.TRUTH_DARE]: 'truth-dare',
};