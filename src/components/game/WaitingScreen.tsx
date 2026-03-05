import { OnlineUser } from "@/types/api/User";
import { View } from "react-native";
import { Avatar } from "@/components/avatar";
import CheckmarckIcon from "@/assets/icons/checkmark.svg";
import HourglassIcon from "@/assets/icons/HourglassIcon";
import { Fragment } from "react";
import { Text } from "@/components/ui/Text";
import useTranslations from "@/hooks/use-translations";

interface WaitingScreenProps {
    players: OnlineUser[];
}

export default function WaitingScreen({ players }: WaitingScreenProps) {
    const i18n = useTranslations();
    return (
        <Fragment>
            <View className="flex-row flex-wrap gap-6 mt-8 justify-center">
                {players.map((player) => (
                    <View key={player.id} className="relative">
                        <Avatar options={player.avatarOptions} size={64} />
                        <View className="absolute bottom-0 right-0">
                            {player.hasAnswered ? (
                                <CheckmarckIcon width={20} height={20} color="#05DF72" />
                            ) : (
                                <HourglassIcon width={20} height={20} color="#FFFFFF" />
                            )}
                        </View>
                    </View>
                ))}
            </View>
            <View>
                <Text className="text-white font-semibold text-center mt-6">
                    {i18n.t("game.online.waitingForAnswers", { count: players.filter(p => !p.hasAnswered).length })}
                </Text>
            </View>
        </Fragment>
    );
}