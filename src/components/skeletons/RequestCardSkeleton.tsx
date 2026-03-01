import {Animated, View} from 'react-native';
import {useEffect, useRef} from 'react';

export default function RequestCardSkeleton() {
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
            style={{opacity, borderRadius: 24, borderWidth: 1, borderColor: '#2F3247', flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12, backgroundColor: '#2A2344'}}
        >
            {/* Initial bubble */}
            <View style={{width: 44, height: 44, borderRadius: 22, backgroundColor: '#3B344D'}} />
            {/* Name + code */}
            <View style={{flex: 1, gap: 6}}>
                <View style={{width: '45%', height: 14, borderRadius: 7, backgroundColor: '#3B344D'}} />
                <View style={{width: '30%', height: 11, borderRadius: 6, backgroundColor: '#3B344D'}} />
            </View>
            {/* Badge */}
            <View style={{width: 72, height: 24, borderRadius: 20, backgroundColor: '#3B344D'}} />
        </Animated.View>
    );
}
