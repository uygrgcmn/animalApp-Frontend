import { useEffect } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming
} from "react-native-reanimated";

type SkeletonBoxProps = {
  style?: StyleProp<ViewStyle>;
};

/**
 * A pulsing placeholder used in loading skeletons.
 * Drop-in replacement for static `View` skeleton shapes.
 */
export function SkeletonBox({ style }: SkeletonBoxProps) {
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.35, { duration: 650 }),
        withTiming(1, { duration: 650 })
      ),
      -1
    );
  }, [opacity]);

  const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return <Animated.View style={[animStyle, style]} />;
}
