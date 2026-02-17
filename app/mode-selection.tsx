import {Page} from "@/containers/Page";
import {Text} from "@/components/ui/Text";
import {Pressable, View} from "react-native";
import {useCallback, useEffect, useState} from "react";
import {useLocalSearchParams, useRouter} from "expo-router";
import Button from "@/components/ui/Button";
import ModeCard from "@/components/cards/ModeCard";
import useTranslations from "@/hooks/use-translations";
import BookIcon from "@/assets/icons/book.svg";
import OnlineIcon from "@/assets/icons/online.svg";
import LocalPhoneIcon from "@/assets/icons/local-phone.svg";
import {GameMode, GameModes} from "@/types/GameMode";
import {useQuery} from "@tanstack/react-query";
import {TanstackQueryKey} from "@/types/TanstackQueryKey";
import {api} from "@/lib/api";
import {Mode} from "@/types/api/Mode";
import ModeCardSkeleton from "@/components/skeletons/ModeCardSkeleton";
import useBottomSheet from "@/hooks/use-bottom-sheet";
import {ModeInformationsBottomSheet} from "@/components/bottom-sheet/ModeInformationsBottomSheet";
import useGame from "@/hooks/use-game";
import Animated, {FadeInDown} from "react-native-reanimated";
import {LinearGradient} from "expo-linear-gradient";

export default function ModeSelection() {
    const router = useRouter();
    const i18n = useTranslations();
    const { showBottomSheet } = useBottomSheet();
    const { setModes, setOnlineMode } = useGame();
    const { game } = useLocalSearchParams<{ game?: string }>();
    const { isPending, data } = useQuery<Mode[]>({
        queryKey: [TanstackQueryKey.MODES, game],
        queryFn: async () => {
            const response = await api.get(`/mode/game/${game}`);
            return response.data;
        },
    })

    const [gameData, setGameData] = useState<GameMode | null>(null);
    const [selectedModes, setSelectedModes] = useState<Mode[]>([]);

    useEffect(() => {
        if (game) {
            setGameData(GameModes.find(g => g.id === game) || null);
        }
    }, [game]);

    useEffect(() => {
        if (data) {
            setSelectedModes(data);
        }
    }, [data]);

    const toggleMode = useCallback((mode: Mode) => {
        setSelectedModes(prev =>
            prev.includes(mode)
                ? prev.filter(m => m.id !== mode.id)
                : [...prev, mode]
        );
    }, []);

    const selectAll = useCallback(() => {
        if (!data) return;
        setSelectedModes(prev =>
            prev.length === data.length ? [] : data
        );
    }, []);

    const goBack = useCallback(() => {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.push("/");
        }
    }, [router]);

    const [showPlayOptions, setShowPlayOptions] = useState(false);

    const createMode = () => {
        setModes(selectedModes);
        setShowPlayOptions(true);
    }

    return (
        <Page
            scrollable={!showPlayOptions}
            onBack={() => {
                if (showPlayOptions) {
                    setShowPlayOptions(false);
                } else {
                    goBack();
                }
            }}
            containerClassName="mt-24 px-4 mb-8"
            logoAction={() => {}}
            headerButtons={showPlayOptions ? [] : [{
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
                !showPlayOptions ? (
                    <View className="absolute bottom-8 px-6 flex-row gap-2 pb-2">
                        <Button className="flex-1" disabled={selectedModes.length === 0} onPress={createMode}>
                            {i18n.t("mode.buttons.play")}
                        </Button>
                    </View>
                ) : undefined
            }
        >
            {showPlayOptions ? (
                <View className="flex-1 items-center justify-center gap-6 px-2">
                    <Animated.View entering={FadeInDown.duration(500).delay(100)} className="w-full">
                        <Pressable onPress={() => {
                            setOnlineMode(true);
                            router.push({
                                pathname: "/lobby/online"
                            })
                        }}>
                            <LinearGradient
                                colors={['#2A2344', '#332850']}
                                start={{x: 0, y: 0}}
                                end={{x: 1, y: 1}}
                                style={{borderRadius: 24, borderWidth: 1, borderColor: '#2F3247', padding: 32, alignItems: 'center', gap: 16}}
                            >
                                <View className="w-16 h-16 rounded-full bg-pink/15 items-center justify-center">
                                    <OnlineIcon width={32} height={32} color="#F6339A" />
                                </View>
                                <Text className="font-semibold text-xl text-center">
                                    {i18n.t("mode.buttons.playOnline")}
                                </Text>
                                <Text className="text-sm text-gray text-center">
                                    {i18n.t("mode.buttons.playOnlineDescription")}
                                </Text>
                            </LinearGradient>
                        </Pressable>
                    </Animated.View>

                    <Animated.View entering={FadeInDown.duration(500).delay(250)} className="w-full">
                        <Pressable onPress={() => {
                            setOnlineMode(false);
                            router.push({
                                pathname: "/lobby/local"
                            })
                        }}>
                            <LinearGradient
                                colors={['#2A2344', '#332850']}
                                start={{x: 0, y: 0}}
                                end={{x: 1, y: 1}}
                                style={{borderRadius: 24, borderWidth: 1, borderColor: '#2F3247', padding: 32, alignItems: 'center', gap: 16}}
                            >
                                <View className="w-16 h-16 rounded-full bg-cyan/15 items-center justify-center">
                                    <LocalPhoneIcon width={32} height={32} color="#06B6D4" />
                                </View>
                                <Text className="font-semibold text-xl text-center">
                                    {i18n.t("mode.buttons.playLocal")}
                                </Text>
                                <Text className="text-sm text-gray text-center">
                                    {i18n.t("mode.buttons.playLocalDescription")}
                                </Text>
                            </LinearGradient>
                        </Pressable>
                    </Animated.View>
                </View>
            ) : (
                <>
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

                    <View className="mt-8 gap-4">
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
                                    selected={selectedModes.includes(item)}
                                    onPress={() => toggleMode(item)}
                                />
                            ))
                        )}
                    </View>
                </>
            )}
        </Page>
    )
}