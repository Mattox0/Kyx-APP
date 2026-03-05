import { Page } from "@/containers/Page";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "expo-router";
import CardCount from "@/components/game/CardCount";
import useGameOnline from "@/hooks/use-game-online";
import Button from "@/components/ui/Button";
import SkipIcon from "@/assets/icons/double-chevron.svg";
import FlagIcon from "@/assets/icons/flag.svg";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "@/components/ui/Text";
import { parseStyledText } from "@/utils/parseStyledText";
import Constants from "expo-constants";
import useTranslations from "@/hooks/use-translations";
import PreferCard from "@/components/game/PreferCard";
import useBottomSheet from "@/hooks/use-bottom-sheet";
import { ReportBottomSheet } from "@/components/bottom-sheet/ReportBottomSheet";
import WaitingScreen from "@/components/game/WaitingScreen";
import ResultsScreen, { ResultEntry } from "@/components/game/ResultsScreen";

type Phase = "question" | "waiting" | "results";

export default function NeverHaveOnlinePage() {
    const router = useRouter();
    const i18n = useTranslations();
    const {
        cardsCount,
        currentQuestion,
        questionResults,
        progress,
        submitAnswer,
        players,
        answersCount,
        myUser,
        nextQuestion,
    } = useGameOnline();
    const { showBottomSheet } = useBottomSheet();
    const { bottom } = useSafeAreaInsets();
    const [phase, setPhase] = useState<Phase>("question");

    const neverHaveQuestion = currentQuestion?.questionType === "never-have" ? currentQuestion : null;
    const iconUri = neverHaveQuestion
        ? Constants.expoConfig?.extra?.apiUrl + "/" + neverHaveQuestion.question.mode.icon
        : null;

    useEffect(() => {
        setPhase("question");
    }, [neverHaveQuestion?.question.id]);

    useEffect(() => {
        if (myUser?.hasAnswered) setPhase("waiting");
    }, [myUser?.hasAnswered]);

    useEffect(() => {
        if (questionResults) setPhase("results");
    }, [questionResults]);

    const goBack = useCallback(() => {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.push("/");
        }
    }, [router]);

    const resultEntries = useMemo<ResultEntry[]>(
        () => [
            {
                label: i18n.t("game.neverHave.have"),
                percentage: Number(questionResults?.have ?? 0),
                color: "#2B7FFF",
                players: players.filter((p) => p.answer === "have"),
            },
            {
                label: i18n.t("game.neverHave.never"),
                percentage: Number(questionResults?.never ?? 0),
                color: "#FD9808",
                players: players.filter((p) => p.answer === "never"),
            },
            ...("skip" in (questionResults ?? {})
                ? [
                      {
                          label: i18n.t("game.neverHave.skip"),
                          percentage: Number(questionResults!.skip),
                          color: "#DB4D6C",
                          players: players.filter((p) => p.answer === "skip"),
                      },
                  ]
                : []),
        ],
        [questionResults, players]
    );

    const handleAnswer = useCallback(
        (answer: string | null) => {
            submitAnswer(answer);
            setPhase("waiting");
        },
        [submitAnswer]
    );

    return (
        <View className="flex-1">
            <Page onBack={goBack} containerClassName="mt-24 px-4" scrollable={false} logoAction={() => {}}>
                <CardCount
                    userCount={answersCount}
                    totalUserCount={players.length}
                    total={100}
                    currentCount={cardsCount ?? 1}
                    progress={progress}
                />

                {phase === "question" && (
                    <>
                        <Text className="mb-4 mt-5 text-center text-2xl">
                            {parseStyledText(
                                i18n.t("game.neverHave.question", {
                                    question: neverHaveQuestion?.question.question ?? "",
                                })
                            )}
                        </Text>

                        {neverHaveQuestion && iconUri && (
                            <PreferCard
                                choiceOne={i18n.t("game.neverHave.have")}
                                choiceTwo={i18n.t("game.neverHave.never")}
                                questionId={neverHaveQuestion.question.id}
                                iconUri={iconUri}
                                onChoiceOne={() => handleAnswer("have")}
                                onChoiceTwo={() => handleAnswer("never")}
                            />
                        )}
                    </>
                )}

                {phase === "waiting" && <WaitingScreen players={players} />}

                {phase === "results" && (
                    <ResultsScreen question={neverHaveQuestion?.question.question ?? ""} entries={resultEntries} />
                )}
            </Page>

            {phase === "question" && (
                <View
                    style={{
                        position: "absolute",
                        bottom: bottom + 16,
                        left: 0,
                        right: 0,
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        paddingHorizontal: 24,
                    }}
                >
                    <Button onPress={() => handleAnswer("skip")} iconOnly>
                        <SkipIcon width={30} height={30} color="#FFFFFF" />
                    </Button>

                    <Button
                        onPress={() =>
                            showBottomSheet(<ReportBottomSheet questionId={neverHaveQuestion?.question.id ?? ""} />)
                        }
                        iconOnly
                        className="absolute bottom-0 right-6"
                    >
                        <FlagIcon width={15} height={15} color="#FFFFFF" />
                    </Button>
                </View>
            )}

            {phase === "results" && (
                <View style={{ position: "absolute", bottom: bottom + 16, left: 0, right: 0, paddingHorizontal: 24 }}>
                    <Button onPress={nextQuestion} disabled={!myUser?.isHost}>
                        Continuer
                    </Button>
                </View>
            )}
        </View>
    );
}
