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
import Constants from "expo-constants";
import useTranslations from "@/hooks/use-translations";
import PreferCard from "@/components/game/PreferCard";
import useBottomSheet from "@/hooks/use-bottom-sheet";
import { ReportBottomSheet } from "@/components/bottom-sheet/ReportBottomSheet";
import WaitingScreen from "@/components/game/WaitingScreen";
import ResultsScreen, { ResultEntry } from "@/components/game/ResultsScreen";
import GameFinishedOnline from "@/components/game/GameFinishedOnline";

type Phase = "question" | "waiting" | "results";

export default function PreferOnlinePage() {
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
        startGame,
        isGameOver,
    } = useGameOnline();
    const { showBottomSheet } = useBottomSheet();
    const { bottom } = useSafeAreaInsets();
    const [phase, setPhase] = useState<Phase>("question");

    const preferQuestion = currentQuestion?.questionType === "prefer" ? currentQuestion : null;
    const iconUri = preferQuestion
        ? Constants.expoConfig?.extra?.apiUrl + "/" + preferQuestion.question.mode.icon
        : null;

    useEffect(() => {
        setPhase("question");
    }, [preferQuestion?.question.id]);

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

    const resultEntries = useMemo<ResultEntry[]>(() => [
        {
            label: preferQuestion?.question.choiceOne ?? "",
            percentage: Number(questionResults?.choiceOne ?? 0),
            color: "#F6339A",
            players: players.filter((p) => p.answer === "choiceOne"),
        },
        {
            label: preferQuestion?.question.choiceTwo ?? "",
            percentage: Number(questionResults?.choiceTwo ?? 0),
            color: "#2B7FFF",
            players: players.filter((p) => p.answer === "choiceTwo"),
        },
        ...("skip" in (questionResults ?? {})
            ? [{
                label: i18n.t("game.neverHave.skip"),
                percentage: Number(questionResults!.skip),
                color: "#DB4D6C",
                players: players.filter((p) => p.answer === "skip"),
            }]
            : []),
    ], [questionResults, players, preferQuestion]);

    const handleAnswer = useCallback((answer: string | null) => {
        submitAnswer(answer);
        setPhase("waiting");
    }, [submitAnswer]);

    if (isGameOver) {
        return (
            <GameFinishedOnline
                isHost={myUser?.isHost ?? false}
                onReplay={startGame}
                onBack={goBack}
            />
        );
    }

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
                        <Text className="mb-4 mt-5 text-center text-2xl font-bold">
                            {i18n.t("game.prefer.title")}
                        </Text>

                        {preferQuestion && iconUri && (
                            <PreferCard
                                choiceOne={preferQuestion.question.choiceOne}
                                choiceTwo={preferQuestion.question.choiceTwo}
                                questionId={preferQuestion.question.id}
                                iconUri={iconUri}
                                onChoiceOne={() => handleAnswer("choiceOne")}
                                onChoiceTwo={() => handleAnswer("choiceTwo")}
                            />
                        )}
                    </>
                )}

                {phase === "waiting" && <WaitingScreen players={players} />}

                {phase === "results" && (
                    <ResultsScreen
                        question={i18n.t("game.prefer.titleBold")}
                        entries={resultEntries}
                    />
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
                        onPress={() => showBottomSheet(<ReportBottomSheet questionId={preferQuestion?.question.id ?? ""} />)}
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
