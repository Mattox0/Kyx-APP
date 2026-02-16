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
import {useQuery} from "@tanstack/react-query";
import {TanstackQueryKey} from "@/types/TanstackQueryKey";
import {api} from "@/lib/api";
import {Mode} from "@/types/api/Mode";
import ModeCardSkeleton from "@/components/skeletons/ModeCardSkeleton";
import useBottomSheet from "@/hooks/use-bottom-sheet";
import {ModeInformationsBottomSheet} from "@/components/bottom-sheet/ModeInformationsBottomSheet";

export default function ModeSelection() {
    const router = useRouter();
    const i18n = useTranslations();
    const { showBottomSheet } = useBottomSheet();
    const { game } = useLocalSearchParams<{ game?: string }>();
    const { isPending, data } = useQuery<Mode[]>({
        queryKey: [TanstackQueryKey.MODES, game],
        queryFn: async () => {
            const response = await api.get(`/mode/game/${game}`);
            return response.data;
        }
    })

    const [gameData, setGameData] = useState<GameMode | null>(null);
    const [selectedModes, setSelectedModes] = useState<string[]>([]);

    useEffect(() => {
        if (game) {
            setGameData(GameModes.find(g => g.id === game) || null);
        }
    }, [game]);

    useEffect(() => {
        if (data) {
            setSelectedModes(data.map(m => m.name));
        }
    }, [data]);

    const toggleMode = useCallback((name: string) => {
        setSelectedModes(prev =>
            prev.includes(name)
                ? prev.filter(m => m !== name)
                : [...prev, name]
        );
    }, []);

    const selectAll = useCallback(() => {
        if (!data) return;
        setSelectedModes(prev =>
            prev.length === data.length ? [] : data.map(i => i.name)
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
            containerClassName="mt-24 px-4"
            logoAction={() => {}}
            headerButtons={[{
                icon: BookIcon,
                action: () => {

                    showBottomSheet(
                        <ModeInformationsBottomSheet
                            howToPlayText={gameData?.howToPlay}
                            exampleText={gameData?.example}
                        />
                    )
                }
            }]}
            bottomChildren={
                <View className="absolute bottom-8 px-6 flex-row gap-2 pb-2">
                    <Button className="flex-1" disabled={selectedModes.length === 0}>
                        {i18n.t("mode.buttons.play")}
                    </Button>
                </View>
            }
        >
            <View className="overflow-visible">
                <Text className="font-kavoon font-bold text-3xl text-center mb-8 -rotate-[25deg] pt-8">
                    {gameData?.name}
                </Text>
                <View className="self-center">
                    <Button textClassName="px-2" onPress={selectAll} disabled={isPending}>
                        {selectedModes.length === data?.length ? i18n.t("mode.buttons.unselectAllModes") : i18n.t("mode.buttons.selectAllModes")}
                    </Button>
                </View>
            </View>

            <View className="mt-8 gap-4 mb-8">
                {isPending ? (
                    <>
                        <ModeCardSkeleton />
                        <ModeCardSkeleton />
                        <ModeCardSkeleton />
                        <ModeCardSkeleton />
                    </>
                ) : (
                    data?.map((item, index) => (
                        <ModeCard
                            key={index}
                            name={item.name}
                            description={item.description}
                            image={item.icon}
                            selected={selectedModes.includes(item.name)}
                            onPress={() => toggleMode(item.name)}
                        />
                    ))
                )}
            </View>
        </Page>
    )
}