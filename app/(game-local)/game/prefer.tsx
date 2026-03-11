import { Page } from "@/containers/Page";
import { useCallback } from "react";
import { useRouter } from "expo-router";
import CardCount from "@/components/game/CardCount";
import useGameLocal from "@/hooks/use-game-local";
import Button from "@/components/ui/Button";
import SkipIcon from "@/assets/icons/double-chevron.svg";
import FlagIcon from "@/assets/icons/flag.svg";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "@/components/ui/Text";
import Constants from "expo-constants";
import useTranslations from "@/hooks/use-translations";
import PreferCard from "@/components/game/PreferCard";
import useBottomSheet from "@/hooks/use-bottom-sheet";
import { ReportBottomSheet } from "@/components/bottom-sheet/ReportBottomSheet";
import GameFinished from "@/components/game/GameFinished";

export default function PreferLocalPage() {
    const router = useRouter();
    const i18n = useTranslations();
    const { showBottomSheet } = useBottomSheet();
    const { total, currentIndex, progress, currentQuestion, nextQuestion, isFinished, endGame } = useGameLocal();
    const preferQuestion = currentQuestion?.questionType === "prefer" ? currentQuestion : null;
    const { bottom } = useSafeAreaInsets();

    const goBack = useCallback(() => {
        endGame();
        if (router.canGoBack()) {
            router.back();
        } else {
            router.push("/");
        }
    }, [router, endGame]);

    const iconUri = preferQuestion
        ? Constants.expoConfig?.extra?.apiUrl + "/" + preferQuestion.question.mode.icon
        : null;

    if (isFinished) {
        return <GameFinished onBack={goBack} />;
    }

    return (
        <View className="flex-1">
            <Page
                onBack={goBack}
                containerClassName="mt-24 px-4"
                scrollable={false}
                logoAction={() => {}}
            >
                <CardCount total={total} currentCount={currentIndex + 1} progress={progress} />

                <Text className="text-center text-2xl font-bold mt-5 mb-4">
                    {i18n.t("game.prefer.title")}
                </Text>

                {preferQuestion && iconUri && (
                    <PreferCard
                        choiceOne={preferQuestion.question.choiceOne}
                        choiceTwo={preferQuestion.question.choiceTwo}
                        questionId={preferQuestion.question.id}
                        iconUri={iconUri}
                        userMentionedOne={preferQuestion.userMentionedOne}
                        userMentionedTwo={preferQuestion.userMentionedTwo}
                        onChoiceOne={nextQuestion}
                        onChoiceTwo={nextQuestion}
                    />
                )}
            </Page>

            <View style={{ position: "absolute", bottom: bottom + 16, left: 0, right: 0, flexDirection: "row", justifyContent: "center", alignItems: "center", paddingHorizontal: 24 }}>
                <Button onPress={nextQuestion} iconOnly>
                    <SkipIcon width={30} height={30} color="#FFFFFF" />
                </Button>

                <Button
                    onPress={() => showBottomSheet(<ReportBottomSheet questionId={currentQuestion?.question.id ?? ""} />)}
                    iconOnly
                    className="absolute right-6 bottom-0"
                >
                    <FlagIcon width={15} height={15} color="#FFFFFF" />
                </Button>
            </View>
        </View>
    );
}
