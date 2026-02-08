import {Page} from "@/containers/Page";
import {Text} from "@/components/ui/Text";
import {View} from "react-native";
import {useCallback, useEffect, useState} from "react";
import {useLocalSearchParams, useRouter} from "expo-router";
import Button from "@/components/ui/Button";
import ModeCard from "@/components/cards/ModeCard";
import useTranslations from "@/hooks/use-translations";
import BookIcon from "@/assets/icons/book.svg";
import {GameMode, GameModes} from "@/types/GameMode";

const items = [
    {name: "Classique", description: "Questions fun et décalées pour tous. Parfait pour briser la glace et rigoler entre amis sans gêne.", accent: "#AD46FF"},
    {name: "Honteux", description: "Des situations gênantes et moments embarrassants que tout le monde a vécus mais que personne n'ose avouer", accent: "#4A90D9"},
    {name: "Couple", description: "Des affirmations romantiques et intimes pour renforcer la complicité et mieux se connaître à deux", accent: "#F6339A"},
    {name: "Sexe", description: "Sans limite et très explicite. Contenu adulte uniquement. Assurez-vous que tout le monde est d'accord avant de jouer.", accent: "#F6339A"},
] // à remplacer par une requête à l'API plus tard

export default function ModeSelection() {
    const router = useRouter();
    const i18n = useTranslations();
    const { game } = useLocalSearchParams<{ game?: string }>();

    const [gameData, setGameData] = useState<GameMode | null>(null);
    const [selectedModes, setSelectedModes] = useState<string[]>([]);

    useEffect(() => {
        if (game) {
            setGameData(GameModes.find(g => g.id === game) || null);
        }
    }, [game]);

    const toggleMode = useCallback((name: string) => {
        setSelectedModes(prev =>
            prev.includes(name)
                ? prev.filter(m => m !== name)
                : [...prev, name]
        );
    }, []);

    const selectAll = useCallback(() => {
        setSelectedModes(prev =>
            prev.length === items.length ? [] : items.map(i => i.name)
        );
    }, []);

    const goBack = useCallback(() => {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.push("/");
        }
    }, [router]);

    return (
        <Page
            scrollable={true}
            onBack={goBack}
            logoAction={() => {}}
            headerButtons={[{
                icon: BookIcon,
                action: () => {}
            }]}
            bottomChildren={
                <View className="px-4 flex-row gap-2 pb-2">
                    <Button className="flex-1" disabled={selectedModes.length === 0}>
                        {i18n.t("mode.buttons.playLocal")}
                    </Button>
                    <Button className="flex-1" disabled={selectedModes.length === 0}>
                        {i18n.t("mode.buttons.playOnline")}
                    </Button>
                </View>
            }
        >
            <View className="overflow-visible">
                <Text className="font-kavoon font-bold text-3xl text-center mb-8 -rotate-[25deg] pt-8">
                    {gameData?.name}
                </Text>
                <View className="self-center">
                    <Button textClassName="px-2" onPress={selectAll}>
                        {i18n.t("mode.buttons.selectAllModes")}
                    </Button>
                </View>
            </View>

            <View className="mt-8 gap-4 mb-8">
                {items.map((item, index) => (
                    <ModeCard
                        key={index}
                        name={item.name}
                        description={item.description}
                        accent={item.accent}
                        selected={selectedModes.includes(item.name)}
                        onPress={() => toggleMode(item.name)}
                    />
                ))}
            </View>
        </Page>
    )
}