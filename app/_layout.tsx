import {DefaultTheme, ThemeProvider} from '@react-navigation/native';
import {SplashScreen, Stack} from 'expo-router';
import 'react-native-reanimated';
import {configureReanimatedLogger, ReanimatedLogLevel} from 'react-native-reanimated';
configureReanimatedLogger({level: ReanimatedLogLevel.warn, strict: false});
import {useEffect, useState} from "react";
import {LinearGradient} from "expo-linear-gradient";
import {StatusBar, View} from "react-native";
import {SafeAreaProvider} from "react-native-safe-area-context";
import '@/assets/globals.css';
import I18nProvider from "@/providers/TranslationProvider";
import {useCustomFonts} from "@/hooks/use-fonts";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {BottomSheetProvider} from "@/providers/BottomSheetProvider";
import {UserProvider} from "@/providers/UserProvider";
import useUser from "@/hooks/use-user";
import {QueryClientProvider} from "@tanstack/react-query";
import {queryClient} from "@/lib/queryClient";
import NetworkErrorHandler from "@/components/NetworkErrorHandler";
import {GameProvider} from "@/providers/GameProvider";

SplashScreen.preventAutoHideAsync().catch(() => {
});

const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: 'transparent',
    },
};

export default function RootLayout() {
    return (
        <GestureHandlerRootView style={{flex: 1}}>
            <SafeAreaProvider>
                <QueryClientProvider client={queryClient}>
                    <ThemeProvider value={theme}>
                        <I18nProvider>
                            <BottomSheetProvider>
                                <UserProvider>
                                    <GameProvider>
                                        <NetworkErrorHandler/>
                                        <App/>
                                    </GameProvider>
                                </UserProvider>
                            </BottomSheetProvider>
                        </I18nProvider>
                    </ThemeProvider>
                </QueryClientProvider>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
}


const App = () => {
    const [isAppReady, setIsAppReady] = useState(true);
    const {isLoading} = useUser();
    const {fontsLoaded, fontError} = useCustomFonts();

    useEffect(() => {
        if (fontError) {
            console.error('Error loading fonts:', fontError);
        }
        if (fontsLoaded && isAppReady && !isLoading) {
            SplashScreen.hideAsync();
        }
    }, [isAppReady, fontsLoaded, fontError, isLoading]);

    if (!isAppReady) {
        return null;
    }

    return (
        <View className="flex-1 bg-[#0A0E27]">
            <StatusBar
                animated={true}
                barStyle="light-content"
            />
            <LinearGradient
                colors={['rgba(10, 14, 39, 0.20)', 'rgba(246, 51, 154, 0.20)']}
                start={{x: 0, y: 0}}
                end={{x: 0, y: 1}}
                style={{position: 'absolute', left: 0, right: 0, top: 0, bottom: 0}}
            />
            <Stack
                screenOptions={{
                    contentStyle: {backgroundColor: 'transparent'},
                    headerShown: false,
                    animation: 'none',
                }}
            />
        </View>
    );
}
