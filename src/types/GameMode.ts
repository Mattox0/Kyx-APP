export interface GameMode {
    id: string;
    name: string;
    description: string;
    tags: string[];
}

export const GameModes: GameMode[] = [
    {
        id: "truth_or_dare",
        name: 'Action ou\nvérité',
        description: 'Les joueurs doivent choisir entre Action ou Vérité, et doivent relever le défi ou répondre à la question posée',
        tags: ["4 Modes", "Local ou en ligne"]
    },
    {
        id: "never_have_i_ever",
        name: "Je n'ai\njamais",
        description: "Les joueurs indiquent s’ils ont déjà vécu la situation décrite par l’affirmation",
        tags: ["4 Modes", "Local ou en ligne"]
    },
    {
        id: "would_you_rather",
        name: 'Tu\npréfères ?',
        description: "Les joueurs doivent choisir entre deux options et expliquer leur choix",
        tags: ["5 Modes", "Local ou en ligne"]
    }
]