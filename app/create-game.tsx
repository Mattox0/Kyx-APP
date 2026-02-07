import {useCallback, useEffect, useRef, useState} from "react";
import {Pressable, useWindowDimensions, View} from "react-native";
import Carousel, {ICarouselInstance, Pagination} from "react-native-reanimated-carousel";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {Text} from "@/components/ui/Text";
import Button from "@/components/ui/Button";
import useTranslations from "@/hooks/use-translations";
import ChevronUp from "@/assets/icons/chevron-up.svg";
import ChevronDown from "@/assets/icons/chevron-down.svg";
import {GameModes} from "@/types/GameMode";
import Animated, {Easing, Extrapolation, interpolate, interpolateColor, useAnimatedStyle, useSharedValue, withRepeat, withTiming} from "react-native-reanimated";
import {useRouter} from "expo-router";
import {Page} from "@/containers/Page";

export default function CreateGamePage() {
    const i18n = useTranslations();
    const router = useRouter();
    const {width: screenWidth, height: screenHeight} = useWindowDimensions();
    const insets = useSafeAreaInsets();
    const carouselRef = useRef<ICarouselInstance>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const carouselHeight = screenHeight - insets.top - insets.bottom;

    const chevronOffset = useSharedValue(0);

    const goBack = useCallback(() => {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.push("/");
        }
    }, [router]);

    useEffect(() => {
        chevronOffset.value = withRepeat(
            withTiming(-20, {duration: 600, easing: Easing.inOut(Easing.ease)}),
            -1,
            true
        );
    }, []);

    const chevronUpStyle = useAnimatedStyle(() => ({
        transform: [{translateY: chevronOffset.value}],
    }));

    const chevronDownStyle = useAnimatedStyle(() => ({
        transform: [{translateY: -chevronOffset.value}],
    }));
    const progress = useSharedValue<number>(0);

    return (
        <Page
            scrollable={false}
            onBack={goBack}
            showSettings={true}
            containerClassName="px-0 mt-0"
        >
            <View style={{flex: 1}}>
                <Carousel
                    ref={carouselRef}
                    data={GameModes}
                    vertical
                    width={screenWidth}
                    loop={false}
                    height={carouselHeight}
                    onSnapToItem={setActiveIndex}
                    onProgressChange={(_, absoluteProgress) => (progress.value = absoluteProgress)}
                    scrollAnimationDuration={300}
                    renderItem={({item}) => (
                        <View
                            style={{width: screenWidth, height: carouselHeight}}
                            className="items-center justify-center px-12"
                        >
                            <View className="flex-1 items-center justify-center overflow-visible">
                                <View className="overflow-visible">
                                    <Text className="font-kavoon font-bold text-5xl text-center mb-20 -rotate-[30deg] pt-2">
                                        {item.name}
                                    </Text>
                                </View>
                                <Text className="text-center text-gray mb-6 text-base">
                                    {item.description}
                                </Text>
                                <View className="flex-row flex-wrap justify-center gap-2 mb-12">
                                    {item.tags.map((tag) => (
                                        <View key={tag} className="bg-yellow rounded-full px-4 py-2">
                                            <Text className="text-sm uppercase">{tag}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>

                            <View className="w-full pb-20">
                                <Button onPress={() => {}}>
                                    {i18n.t("game.launch")}
                                </Button>
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
                        <Animated.View style={chevronUpStyle}>
                            <ChevronUp width={40} height={40} color="#FFFFFF"/>
                        </Animated.View>
                    </Pressable>

                    <Pressable
                        className="absolute bottom-4 self-center"
                        style={{opacity: activeIndex === GameModes.length - 1 ? 0.2 : 1}}
                        disabled={activeIndex === GameModes.length - 1}
                        onPress={() => carouselRef.current?.next()}
                    >
                        <Animated.View style={chevronDownStyle}>
                            <ChevronDown width={40} height={40} color="#FFFFFF"/>
                        </Animated.View>
                    </Pressable>

                    <View pointerEvents="box-none" className="absolute right-4 top-0 bottom-0 justify-center">
                        <Pagination.Custom
                            progress={progress}
                            data={GameModes}
                            dotStyle={{
                                width: 6,
                                height: 6,
                                borderRadius: 3,
                                backgroundColor: "#99A1AF",
                            }}
                            activeDotStyle={{
                                width: 6,
                                height: 30,
                                borderRadius: 3,
                                backgroundColor: "#FF6B9D",
                            }}
                            containerStyle={{
                                gap: 8,
                                flexDirection: "column",
                                alignItems: "center",
                            }}
                            onPress={(index) => carouselRef.current?.scrollTo({index, animated: true})}
                            customReanimatedStyle={(progressValue, index, length) => {
                                "worklet";
                                let val = Math.abs(progressValue - index);
                                if (index === 0 && progressValue > length - 1) {
                                    val = Math.abs(progressValue - length);
                                }

                                return {
                                    height: interpolate(
                                        val,
                                        [0, 1],
                                        [30, 6],
                                        Extrapolation.CLAMP
                                    ),
                                    backgroundColor: interpolateColor(
                                        val,
                                        [0, 0.5],
                                        ["#FF6B9D", "#99A1AF"]
                                    ),
                                };
                            }}
                        />
                    </View>
                </View>
            </View>
        </Page>
    );
}
