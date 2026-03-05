import { Pressable, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Button from "@/components/ui/Button";
import { Page } from "@/containers/Page";
import useTranslations from "@/hooks/use-translations";
import { useCallback, useEffect, useState } from "react";
import { RelativePathString, useRouter } from "expo-router";
import Input from "@/components/ui/Input";
import { LinearGradient } from "expo-linear-gradient";
import PlusIcon from "@/assets/icons/plus.svg"
import { Text } from "@/components/ui/Text";
import LocalUserCard from "@/components/cards/LocalUserCard";
import { LocalUser } from "@/types/api/User";
import { Gender } from "@/types/Gender";
import Animated, { FadeIn } from "react-native-reanimated";
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import useGame from "@/hooks/use-game";
import useGameLocal from "@/hooks/use-game-local";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { GameQuestion } from "@/types/GameQuestion";
import useUser from "@/hooks/use-user";

export default function LocalPage() {
    const i18n = useTranslations();
    const router = useRouter();
    const { user } = useUser();
    const { game, setUsers: setGameUsers, modes } = useGame();
    const { initQuestions, setGameId } = useGameLocal();
    const [userToAdd, setUserToAdd] = useState<string>("");
    const [users, setUsers] = useState<LocalUser[]>([]);

    const addUser = useCallback(() => {
        if (!userToAdd.trim()) return;
        setUsers(prev => [...prev, { name: userToAdd, gender: Gender.MAN, id: uuidv4() }]);
        setUserToAdd("");
    }, [userToAdd]);

    const goBack = useCallback(() => {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.push("/");
        }
    }, [router]);

    useEffect(() => {
        if (user) {
            setUsers([{ name: user.name, gender: user.gender, id: user.id }])
        }
    }, [user]);

    const updateUser = (localUser: LocalUser, gender: Gender) => {
        setUsers(prev => prev.map(user => user.id === localUser.id ? { ...user, gender } : user));
    }

    const deleteUser = (localUser: LocalUser) => {
        setUsers(prev => prev.filter(user => user.id !== localUser.id));
    }

    const { mutate: startGame, isPending } = useMutation({
        mutationFn: async () => {
            const response = await api.post<{ gameId: string, questions: GameQuestion[]}>(`/${game?.id}/create-party/local`, { users, modes: modes?.map(mode => mode.id) ?? [] });
            return response.data;
        },
        onSuccess: (data) => {
            setGameUsers(users);
            setGameId(data.gameId);
            initQuestions(data.questions);
            if (game?.id) {
                router.push(`/(game-local)/game/${game?.id}` as RelativePathString);
            }
        },
    });

    return (
        <Page
            onBack={goBack}
            containerClassName="mt-24 px-4 mb-8"
            scrollable={false}
            logoAction={() => {}}
            bottomChildren={
                <View className="absolute bottom-8 px-6 flex-row gap-2 pb-2">
                    <Button className="flex-1" disabled={users.length < 2 || isPending} onPress={() => startGame()}>
                        {i18n.t("mode.buttons.play")}
                    </Button>
                </View>
            }
        >
            <View className="flex-row items-center gap-3">
                <Input
                    value={userToAdd}
                    onChangeText={setUserToAdd}
                    placeholder={i18n.t("lobby.local.placeholder")}
                    containerClassName="flex-1"
                    returnKeyType="done"
                    onSubmitEditing={addUser}
                />

                <Pressable disabled={!userToAdd.trim()} onPress={addUser}>
                    <LinearGradient
                        colors={['#F6339A', '#AD46FF']}
                        start={{x: 0, y: 0}}
                        end={{x: 1, y: 1}}
                        style={{width: 50, height: 50, alignItems: "center", justifyContent: "center", borderRadius: 16, opacity: !userToAdd.trim() ? 0.5 : 1}}
                    >
                        <PlusIcon color="#FFFFFF" width={24} height={24} />
                    </LinearGradient>
                </Pressable>
            </View>

            <View className="flex-row justify-between my-6 px-4">
                <Text style={{color: "#99A1AF"}} className="text-lg">{i18n.t("lobby.local.nbPlayers", { nb: users.length })}</Text>
                {users.length >= 2 && (
                    <Animated.View entering={FadeIn.duration(300)} className="flex-row items-center gap-2">
                        <View className="rounded-full h-4 w-4" style={{backgroundColor: "#05DF72"}}/>
                        <Text style={{color: "#05DF72"}} className="text-lg">{i18n.t("lobby.local.readyToPlay")}</Text>
                    </Animated.View>
                )}
            </View>

            <ScrollView className="flex-1" contentContainerStyle={{gap: 16, paddingBottom: 40}} showsVerticalScrollIndicator={false}>
                {users.map(user => (
                    <LocalUserCard key={user.id} user={user} setUser={updateUser} deleteUser={deleteUser}/>
                ))}
            </ScrollView>
        </Page>
    )
}
