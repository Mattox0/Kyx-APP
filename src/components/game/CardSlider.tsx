import { View } from "react-native";
import Swiper from "react-native-deck-swiper";
import { forwardRef, memo, useImperativeHandle, useRef } from "react";
import GameCard from "@/components/game/GameCard";
import { GameQuestion } from "@/types/GameQuestion";

interface CardSliderProps {
    questions: GameQuestion[] | null;
    onSwiped: () => void;
    onSwipedLeft?: () => void;
    onSwipedRight?: () => void;
    onSwiping?: (x: number) => void;
    onSwipedAborted?: () => void;
}

export interface CardSliderHandle {
    swipeRight: () => void;
}

const CardSlider = memo(
    forwardRef<CardSliderHandle, CardSliderProps>(
        ({ questions, onSwiped, onSwipedLeft, onSwipedRight, onSwiping, onSwipedAborted }, ref) => {
            const swiperRef = useRef<Swiper<GameQuestion>>(null);

            useImperativeHandle(ref, () => ({
                swipeRight: () => swiperRef.current?.swipeRight(),
            }));

            if (!questions || questions.length === 0) return null;

            return (
                <View className="flex-1">
                    <Swiper<GameQuestion>
                        ref={swiperRef}
                        cards={questions}
                        cardIndex={0}
                        renderCard={(gameQuestion) => (
                            <GameCard gameQuestion={gameQuestion} key={gameQuestion.question.id} />
                        )}
                        onSwiping={(x) => onSwiping?.(x)}
                        onSwiped={() => onSwiped()}
                        onSwipedLeft={() => onSwipedLeft?.()}
                        onSwipedRight={() => onSwipedRight?.()}
                        onSwipedAborted={() => onSwipedAborted?.()}
                        keyExtractor={(q) => q?.question?.id ?? ""}
                        stackSize={5}
                        stackSeparation={12}
                        stackScale={4}
                        showSecondCard
                        secondCardZoom={0.97}
                        zoomAnimationDuration={150}
                        stackAnimationFriction={7}
                        stackAnimationTension={40}
                        animateCardOpacity
                        backgroundColor="transparent"
                        cardVerticalMargin={8}
                        cardHorizontalMargin={0}
                        disableTopSwipe
                        disableBottomSwipe
                        infinite={false}
                        swipeAnimationDuration={100}
                    />
                </View>
            );
        }
    )
);

CardSlider.displayName = "CardSlider";

export default CardSlider;
