import {Animated, View} from 'react-native';
import {useEffect, useRef} from 'react';

export default function FriendCardSkeleton() {
    const opacity = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {toValue: 1, duration: 800, useNativeDriver: true}),
                Animated.timing(opacity, {toValue: 0.3, duration: 800, useNativeDriver: true}),
            ])
        );
        animation.start();
        return () => animation.stop();
    }, [opacity]);

    return (
        <Animated.View
            style={{opacity, borderRadius: 24, borderWidth: 1, borderColor: '#2F3247', flexDirection: 'row', alignItems: 'center', padding: 12, gap: 16, backgroundColor: '#2A2344'}}
        >
            {/* Avatar */}
            <View style={{width: 56, height: 56, borderRadius: 28, backgroundColor: '#3B344D'}} />
            {/* Name */}
            <View style={{flex: 1, gap: 6}}>
                <View style={{width: '55%', height: 14, borderRadius: 7, backgroundColor: '#3B344D'}} />
            </View>
            {/* Gender bubble */}
            <View style={{width: 36, height: 36, borderRadius: 18, backgroundColor: '#3B344D'}} />
        </Animated.View>
    );
}
