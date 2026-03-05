import { Text } from "@/components/ui/Text";
import { Page } from "@/containers/Page";
import useGameOnline from "@/hooks/use-game-online";
import { RelativePathString, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import Animated from "react-native-reanimated";
import Clipboard from "@react-native-clipboard/clipboard";
import useTranslations from "@/hooks/use-translations";
import { ScrollView } from "react-native-gesture-handler";
import OnlineUserCard from "@/components/cards/OnlineUserCard";
import Button from "@/components/ui/Button";
import { GameStatus } from "@/types/GameStatus";
import { GameTypeToRoute } from "@/types/GameType";

export default function LobbyOnlinePage() {
    const router = useRouter();
    const i18n = useTranslations();
    const { code } = useLocalSearchParams<{ code: string }>();
    const { players, myUser, kickUser, isKicked, startGame, status, game } = useGameOnline();
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (isKicked) {
            goBack();
        }
    }, [isKicked]);

    useEffect(() => {
        if (status === GameStatus.IN_PROGRESS && game?.gameType) {
            const route = GameTypeToRoute[game.gameType];
            router.push(`/(game-online)/game/${route}?code=${code}` as RelativePathString);
        }
    }, [status])

    const handleCopyCode = () => {
        Clipboard.setString(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const goBack = useCallback(() => {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.push("/");
        }
    }, [router]);

    return (
        <Page
            onBack={goBack}
            containerClassName="mt-24 px-4 mb-8"
            scrollable={false}
            logoAction={() => {}}
            bottomChildren={
                <View className="w-full">
                    <View className="mt-2 flex-row gap-2 px-4">
                        <Button className="flex-1"  variant="outline" onPress={goBack}>
                            {i18n.t("game.online.cancel")}
                        </Button>

                        <Button className="flex-1" onPress={startGame} disabled={players.length < 2 || !myUser?.isHost}>
                            {i18n.t("game.online.start")}
                        </Button>
                    </View>
                </View>
            }
        >
            <View className="items-center gap-6">
                <Animated.View className="mb-4 mt-4 px-4">
                    <Pressable onPress={handleCopyCode} className="items-center gap-1">
                        <Text className="font-semibold text-xs uppercase text-gray" style={{ letterSpacing: 1.5 }}>
                            {i18n.t("game.online.inviteCode")}
                        </Text>
                        <Text className="font-bold text-white" style={{ fontSize: 28, letterSpacing: 6 }}>
                            {code}
                        </Text>
                        <Text className="text-xs" style={{ color: copied ? "#4ADE80" : "rgba(255,255,255,0.35)" }}>
                            {copied ? i18n.t("friends.codeCopied") : i18n.t("friends.tapToCopy")}
                        </Text>
                    </Pressable>
                </Animated.View>

                <ScrollView contentContainerClassName="gap-4" className="w-full">
                    <Text className="text-sm text-gray">
                        {i18n.t("game.online.players", { count: players.length })}
                    </Text>
                    {players.map((player) => (
                        <OnlineUserCard
                            key={player.id}
                            myUserId={myUser?.id}
                            user={player}
                            isHost={myUser?.isHost ?? false}
                            onDelete={() => kickUser(player.id)}
                        />
                    ))}
                    {players.length === 1 && (
                        <Text className="mt-8 text-center text-sm text-gray">{i18n.t("game.online.waiting")}</Text>
                    )}
                </ScrollView>
            </View>
        </Page>
    );
}
