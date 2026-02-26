import { View } from "react-native";
import Swiper from "react-native-deck-swiper";
import { useRef } from "react";
import useGameLocal from "@/hooks/use-game-local";
import GameCard from "@/components/game/GameCard";
import { GameQuestion } from "@/providers/GameLocalProvider";

export default function CardSlider() {
    const { questions, nextQuestion } = useGameLocal();
    const swiperRef = useRef<Swiper<GameQuestion>>(null);

    if (!questions || questions.length === 0) return null;

    // mettre une animation pour chaque swipe sur les côtés
    // faire en sorte que le game card prenne en compte toute les questions
    return (
        <View className="flex-1">
            <Swiper<GameQuestion>
                ref={swiperRef}
                cards={questions}
                cardIndex={0}
                renderCard={(gameQuestion) => (
                    <GameCard gameQuestion={gameQuestion} />
                )}
                onSwiped={() => nextQuestion()}
                keyExtractor={(q) => q.question.id}
                stackSize={5}
                stackSeparation={12}
                stackScale={4}
                showSecondCard
                secondCardZoom={0.97}
                zoomAnimationDuration={150}
                stackAnimationFriction={7}
                stackAnimationTension={40}
                overlayLabels={{
                    left: {
                        title: "J'AI",
                        style: {
                            label: {
                                color: "#f87171",
                                fontSize: 32,
                                fontWeight: "900",
                                borderColor: "#f87171",
                                borderWidth: 3,
                                borderRadius: 10,
                                padding: 10,
                            },
                            wrapper: {
                                flexDirection: "column",
                                alignItems: "flex-end",
                                justifyContent: "flex-start",
                                marginTop: 40,
                                marginLeft: -30,
                            },
                        },
                    },
                    right: {
                        title: "JAMAIS",
                        style: {
                            label: {
                                color: "#34d399",
                                fontSize: 32,
                                fontWeight: "900",
                                borderColor: "#34d399",
                                borderWidth: 3,
                                borderRadius: 10,
                                padding: 10,
                            },
                            wrapper: {
                                flexDirection: "column",
                                alignItems: "flex-start",
                                justifyContent: "flex-start",
                                marginTop: 40,
                                marginLeft: 30,
                            },
                        },
                    },
                }}
                animateCardOpacity
                animateOverlayLabelsOpacity
                backgroundColor="transparent"
                cardVerticalMargin={8}
                cardHorizontalMargin={0}
                disableTopSwipe
                disableBottomSwipe
                infinite={false}
            />
        </View>
    );
}
