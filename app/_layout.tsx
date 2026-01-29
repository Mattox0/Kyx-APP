import {DefaultTheme, ThemeProvider} from '@react-navigation/native';
import {SplashScreen, Stack} from 'expo-router';
import 'react-native-reanimated';
import {useState} from "react";
import {LinearGradient} from "expo-linear-gradient";
import {View} from "react-native";
import '@/assets/globals.css';
import I18nProvider from "@/providers/TranslationProvider";

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
        <ThemeProvider value={theme}>
            <I18nProvider>
                <App/>
            </I18nProvider>
        </ThemeProvider>
    );
}


const App = () => {
    const [isAppReady, setIsAppReady] = useState(true);

    if (!isAppReady) {
        return null;
    }

    return (
        <View className="flex-1 bg-[#0A0E27]">
            <LinearGradient
                colors={['rgba(10, 14, 39, 0.20)', 'rgba(246, 51, 154, 0.20)']}
                className="absolute inset-0"
            />
            <Stack
                screenOptions={{
                    contentStyle: {backgroundColor: 'transparent'},
                    headerShown: false
                }}
            />
        </View>
    );
}
