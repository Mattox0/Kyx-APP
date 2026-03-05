import { View } from "react-native";
import { Text } from "@/components/ui/Text";
import { OnlineUser } from "@/types/api/User";
import { ScrollView } from "react-native-gesture-handler";
import { parseStyledText } from "@/utils/parseStyledText";
import useTranslations from "@/hooks/use-translations";
import { Avatar } from "@/components/avatar";

export interface ResultEntry {
    label: string;
    percentage: number;
    color: string;
    players: OnlineUser[];
}

interface ResultsScreenProps {
    entries: ResultEntry[];
    question: string;
}

export default function ResultsScreen({ question, entries }: ResultsScreenProps) {
    const i18n = useTranslations();
    return (
        <ScrollView>
            <Text className="text-center text-2xl mt-5 mb-4">
                {parseStyledText(i18n.t("game.neverHave.question", { question: question }))}
            </Text>

            <View className="justify-center gap-6 mt-8">
                {entries.map((entry) => (
                    <View key={entry.label} className="gap-2 bg-background border-border border-2 p-4 rounded-2xl">
                        <View className="flex-row justify-between items-center">
                            <Text className="text-xl font-semibold">{entry.label}</Text>
                        </View>

                        <View className="flex-row items-center gap-3">
                            <View className="flex-1 h-4 rounded-full bg-[#F4F4F4] overflow-hidden">
                                <View
                                    className="h-full rounded-full"
                                    style={{
                                        width: `${entry.percentage}%`,
                                        backgroundColor: entry.color,
                                    }}
                                />
                            </View>
                            <Text className="text-xl font-bold text-right" style={{ color: entry.color }}>
                                {entry.percentage}%
                            </Text>
                        </View>

                        {entry.players.length > 0 && (
                            <View className="flex-row flex-wrap gap-1 mt-1">
                                {entry.players.map((player, index) => (
                                    <View key={player.id} style={{ marginLeft: index === 0 ? 0 : -30 }}>
                                        <Avatar options={player.avatarOptions} size={50} />
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}
