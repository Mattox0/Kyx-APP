import Animated, {
    useSharedValue,
    useAnimatedProps,
    withRepeat,
    withSequence,
    withTiming,
    withDelay,
    useAnimatedStyle,
} from "react-native-reanimated";
import Svg, { Path, G } from "react-native-svg";
import { useEffect } from "react";

const AnimatedPath = Animated.createAnimatedComponent(Path);

export default function HourglassIcon({ width = 20, height = 20, color = "#FFFFFF" }) {
  const rotation = useSharedValue(0);
  const topOpacity = useSharedValue(1);
  const bottomOpacity = useSharedValue(0);
  const SAND = 2000;
  const SPIN = 500;

  useEffect(() => {
    rotation.value = withRepeat(
      withSequence(
        withDelay(SAND, withTiming(180, { duration: SPIN })),
        withDelay(SAND, withTiming(360, { duration: SPIN })),
      ), -1, false
    );

    topOpacity.value = withRepeat(
      withSequence(
        withTiming(0, { duration: SAND }),
        withTiming(0, { duration: SPIN }),
        withTiming(1, { duration: SAND }),
        withTiming(1, { duration: SPIN }),
      ), -1, false
    );

    bottomOpacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: SAND }),
        withTiming(1, { duration: SPIN }),
        withTiming(0, { duration: SAND }),
        withTiming(0, { duration: SPIN }),
      ), -1, false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const topProps = useAnimatedProps(() => ({ opacity: topOpacity.value }));
  const bottomProps = useAnimatedProps(() => ({ opacity: bottomOpacity.value }));

  return (
    <Animated.View style={[{ width, height }, animatedStyle]}>
      <Svg width={width} height={height} viewBox="0 0 24 24">
        <G>
          <Path
            fill={color}
            d="M6 2V8H6.01L6 8.01L10 12L6 16L6.01 16.01H6V22H18V16.01H17.99L18 16L14 12L18 8.01L17.99 8H18V2H6ZM16 16.5V20H8V16.5L12 12.5L16 16.5ZM12 11.5L8 7.5V4H16V7.5L12 11.5Z"
          />
          <AnimatedPath
            fill={color}
            d="M7 3H17V7.2L12 12L7 7.2V3Z"
            animatedProps={topProps}
          />
          <AnimatedPath
            fill={color}
            d="M17 21H7V16.8L12 12L17 16.8V21Z"
            animatedProps={bottomProps}
          />
        </G>
      </Svg>
    </Animated.View>
  );
}