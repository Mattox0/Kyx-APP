import { Text } from "@/components/ui/Text";
import { Page } from "@/containers/Page";
import useGameOnline from "@/hooks/use-game-online";
import { RelativePathString, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import Clipboard from "@react-native-clipboard/clipboard";
import useTranslations from "@/hooks/use-translations";
import { ScrollView } from "react-native-gesture-handler";
import OnlineUserCard, { FriendStatus } from "@/components/cards/OnlineUserCard";
import Button from "@/components/ui/Button";
import { GameStatus } from "@/types/GameStatus";
import { GameTypeToRoute } from "@/types/GameType";
import { useFriends } from "@/hooks/use-friends";
import useUser from "@/hooks/use-user";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { TanstackQueryKey } from "@/types/TanstackQueryKey";

export default function LobbyOnlinePage() {
    const router = useRouter();
    const i18n = useTranslations();
    const { code } = useLocalSearchParams<{ code: string }>();
    const { players, myUser, kickUser, isKicked, startGame, status, game } = useGameOnline();
    const { user } = useUser();
    const { friends, requestsSent } = useFriends(!!user);
    const queryClient = useQueryClient();

    const { mutate: sendFriendRequest } = useMutation({
        mutationFn: (friendCode: string) => api.post("/friend/request", { friendCode }, { validateStatus: (s) => s < 500 }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: [TanstackQueryKey.FRIEND_REQUESTS_SENT] }),
    });

    const getFriendStatus = useCallback((playerId: string, playerFriendCode: string): FriendStatus => {
        if (friends?.some((f) => f.friend.id === playerId || f.user.id === playerId)) return "friend";
        if (requestsSent?.some((r) => r.userRequested.id === playerId)) return "sent";
        return "none";
    }, [friends, requestsSent]);

    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (isKicked) {
            goBack();
        }
    }, [isKicked]);

    useEffect(() => {
        if (status === GameStatus.IN_PROGRESS && game?.gameType) {
            const route = GameTypeToRoute[game.gameType];
            router.replace(`/(game-online)/game/${route}?code=${code}` as RelativePathString);
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
                    <View className="flex-row justify-between items-center">
                        <Text className="text-sm text-gray">
                            {i18n.t("game.online.players", { count: players.length })}
                        </Text>
                        {players.length >= 2 && (
                            <Animated.View entering={FadeIn.duration(300)} className="flex-row items-center gap-2">
                                <View className="rounded-full h-3 w-3" style={{ backgroundColor: "#05DF72" }} />
                                <Text className="text-sm" style={{ color: "#05DF72" }}>
                                    {i18n.t("lobby.local.readyToPlay")}
                                </Text>
                            </Animated.View>
                        )}
                    </View>
                    {players.map((player) => (
                        <OnlineUserCard
                            key={player.id}
                            myUserId={myUser?.id}
                            user={player}
                            isHost={myUser?.isHost ?? false}
                            onDelete={() => kickUser(player.id)}
                            friendStatus={getFriendStatus(player.id, player.friendCode)}
                            onAddFriend={() => sendFriendRequest(player.friendCode)}
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
