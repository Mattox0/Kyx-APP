export interface GameMode {
    id: string;
    name: string;
    description: string;
    tags: string[];
    howToPlay: string;
    example: string;
}

export const GameModes: GameMode[] = [
    {
        id: "truth-dare",
        name: 'Action ou\nvérité',
        description: 'Les joueurs doivent choisir entre Action ou Vérité, et doivent relever le défi ou répondre à la question posée',
        tags: ["4 Modes", "Local ou en ligne"],
        howToPlay: "Les joueurs se mettent en cercle et chacun leur tour, ils choisissent entre \"Action\" ou \"Vérité\". L'application propose alors un défi à réaliser ou une question à laquelle répondre honnêtement. Un jeu parfait pour créer des fous rires, briser la glace et découvrir de nouveaux côtés de vos amis",
        example: "<b>Action</b> : Imite la personne à ta gauche\n<b>Vérité</b> : Raconte ton moment le plus gênant"
    },
    {
        id: "never-have",
        name: "Je n'ai\njamais",
        description: "Les joueurs indiquent s’ils ont déjà vécu la situation décrite par l’affirmation",
        tags: ["4 Modes", "Local ou en ligne"],
        howToPlay: "Le mode affiche des affirmations commençant par \"Je n'ai jamais...\" et tous ceux qui l'ont déjà fait doivent se signaler. C'est un jeu parfait pour mieux connaître vos amis, partager des anecdotes amusantes et passer un bon moment ensemble",
        example: "<b>Je n’ai jamais</b> repensé à mon ex"
    },
    {
        id: "prefer",
        name: 'Tu\npréfères ?',
        description: "Les joueurs doivent choisir entre deux options et expliquer leur choix",
        tags: ["5 Modes", "Local ou en ligne"],
        howToPlay: "L'application propose deux options et chaque joueur doit choisir celle qu'il préfère, même si les deux choix sont difficiles. Ensuite, débattez ensemble pour comprendre et défendre vos choix.\nUn jeu idéal pour lancer des débats animés et découvrir les préférences surprenantes de vos amis.",
        example: "<b>Tu préfères</b> avoir la capacité de voler ou être invisible ?"
    }
]