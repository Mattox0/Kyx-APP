import {useRef, useState} from "react";
import {Pressable, useWindowDimensions, View} from "react-native";
import Carousel, {ICarouselInstance} from "react-native-reanimated-carousel";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {Text} from "@/components/ui/Text";
import Button from "@/components/ui/Button";
import useTranslations from "@/hooks/use-translations";
import ChevronUp from "@/assets/icons/chevron-up.svg";
import ChevronDown from "@/assets/icons/chevron-down.svg";
import {GameModes} from "@/types/GameMode";

export default function CreateGamePage() {
    const i18n = useTranslations();
    const {width: screenWidth, height: screenHeight} = useWindowDimensions();
    const insets = useSafeAreaInsets();
    const carouselRef = useRef<ICarouselInstance>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const carouselHeight = screenHeight - insets.top - insets.bottom;

    return (
        <View className="flex-1">
            <View style={{flex: 1, marginTop: insets.top, marginBottom: insets.bottom}}>
                <Carousel
                    ref={carouselRef}
                    data={GameModes}
                    vertical
                    width={screenWidth}
                    loop={false}
                    height={carouselHeight}
                    onSnapToItem={setActiveIndex}
                    scrollAnimationDuration={300}
                    renderItem={({item}) => (
                        <View
                            style={{width: screenWidth, height: carouselHeight}}
                            className="items-center justify-center px-12"
                        >
                            <Text className="font-kavoon font-bold text-5xl text-center mb-20 -rotate-[30deg]">
                                {item.name}
                            </Text>
                            <Text className="text-center text-gray mb-6 text-base">
                                {item.description}
                            </Text>
                            <View className="flex-row flex-wrap justify-center gap-2">
                                {item.tags.map((tag) => (
                                    <View key={tag} className="bg-yellow rounded-full px-4 py-2">
                                        <Text className="text-sm uppercase">{tag}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}
                />

                <View pointerEvents="box-none" className="absolute top-0 bottom-0 left-0 right-0">
                    <Pressable
                        className="absolute top-4 self-center"
                        style={{opacity: activeIndex === 0 ? 0.2 : 1}}
                        disabled={activeIndex === 0}
                        onPress={() => carouselRef.current?.prev()}
                    >
                        <ChevronUp width={40} height={40} color="#FFFFFF"/>
                    </Pressable>

                    <Pressable
                        className="absolute bottom-16 self-center"
                        style={{opacity: activeIndex === GameModes.length - 1 ? 0.2 : 1}}
                        disabled={activeIndex === GameModes.length - 1}
                        onPress={() => carouselRef.current?.next()}
                    >
                        <ChevronDown width={40} height={40} color="#FFFFFF"/>
                    </Pressable>

                    <View pointerEvents="none" className="absolute right-4 top-0 bottom-0 justify-center items-center gap-2">
                        {GameModes.map((_, index) => (
                            <View
                                key={index}
                                className={`rounded-full ${index === activeIndex ? "bg-pink" : "bg-container"}`}
                                style={{width: index === activeIndex ? 10 : 8, height: index === activeIndex ? 10 : 8}}
                            />
                        ))}
                    </View>

                    <View className="absolute bottom-0 left-0 right-0 px-8">
                        <Button onPress={() => {}}>
                            {i18n.t("game.launch")}
                        </Button>
                    </View>
                </View>
            </View>
        </View>
    );
}
