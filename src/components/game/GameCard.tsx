import { Pressable, useWindowDimensions, View } from "react-native";
import { Text } from "@/components/ui/Text";
import { SvgUri } from "react-native-svg";
import Constants from "expo-constants";
import DotsIcon from "@/assets/icons/dots.svg";
import useBottomSheet from "@/hooks/use-bottom-sheet";
import { ReportBottomSheet } from "@/components/bottom-sheet/ReportBottomSheet";
import useTranslations from "@/hooks/use-translations";
import { GameQuestion } from "@/types/GameQuestion";
import { ChallengeType } from "@/types/ChallengeType";
import { Gender } from "@/types/Gender";

interface GameCardProps {
    gameQuestion: GameQuestion;
}

export default function GameCard({ gameQuestion }: GameCardProps) {
    const { width } = useWindowDimensions();
    const { showBottomSheet } = useBottomSheet();
    const i18n = useTranslations();
    const iconUri = Constants.expoConfig?.extra?.apiUrl + "/" + gameQuestion.question.mode.icon;

    return (
        <View
            className="relative overflow-hidden rounded-3xl border border-border bg-background"
            style={{
                width: width - 32,
                aspectRatio: 0.68,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.5,
                shadowRadius: 20,
                elevation: 14,
            }}
        >
            <View className="absolute left-6 top-6 overflow-hidden rounded-xl">
                <SvgUri uri={iconUri} width={40} height={40} />
            </View>

            <View className="flex-1 items-center justify-center gap-4 px-7">
                {gameQuestion.questionType === "never-have" && (
                    <>
                        <Text className="mb-8 font-bold text-2xl text-white">{i18n.t("game.neverHave.title")}</Text>
                        <Text className="text-center text-lg text-white">{gameQuestion.question.question}</Text>
                    </>
                )}
                {gameQuestion.questionType === "truth-dare" && (
                    <>
                        <Text className="font-bold text-3xl text-white">
                            {gameQuestion.question.challengeType === ChallengeType.DARE
                                ? i18n.t("game.truthDare.dare")
                                : i18n.t("game.truthDare.truth")}
                        </Text>
                        {gameQuestion.userTarget && (
                            <Text
                                className={`text-2xl ${gameQuestion.userTarget.gender === Gender.MAN ? "text-[#2B7FFF]" : "text-[#F6339A]"}`}
                            >
                                {gameQuestion.userTarget.name}
                            </Text>
                        )}
                        <Text className="text-center text-lg text-white">{gameQuestion.question.question}</Text>
                    </>
                )}
            </View>

            <Pressable
                onPress={() => showBottomSheet(<ReportBottomSheet />)}
                className="absolute bottom-6 left-1/2 -translate-x-1/2"
                hitSlop={12}
            >
                <DotsIcon width={20} height={20} color="#FFFFFF" />
            </Pressable>
        </View>
    );
}
