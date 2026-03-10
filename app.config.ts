import {ExpoConfig} from "@expo/config-types";

type EnvName = "dev" | "prod";

type Environments = {
    [key in EnvName]: {
        envName: key;
        projectId: string;
        bundleId: `fr.app-kyx.kyx${key extends "prod" ? "" : `.${key}`}`;
        package: `fr.app-kyx.kyx${key extends "prod" ? "" : `.${key}`}`;
        slug: `kyx${key extends "prod" ? "" : `-${key}`}`;
        apiUrl: string;
    }
}

const environments: Environments = {
    dev: {
        envName: "dev",
        projectId: "eacca958-2932-446b-a2dc-6e4e4bfb78c2",
        bundleId: "fr.app-kyx.kyx.dev",
        package: "fr.app-kyx.kyx.dev",
        slug: "kyx-dev",
        apiUrl: "http://192.168.1.15:4005",
    },
    prod: {
        envName: "prod",
        projectId: "eacca958-2932-446b-a2dc-6e4e4bfb78c2",
        bundleId: "fr.app-kyx.kyx",
        package: "fr.app-kyx.kyx",
        slug: "kyx",
        apiUrl: "https://app-kyx.fr",
    }
}

const env = process.env.APP_ENV as EnvName;
const loadedEnv = environments[env] || environments.prod;

const config: ExpoConfig = {
    name: "Kyx",
    slug: loadedEnv.slug,
    version: "1.0.0",
    orientation: "portrait",
    icon: `./src/assets/env/icon.png`,
    scheme: loadedEnv.slug,
    userInterfaceStyle: "light",
    ios: {
        icon: `./src/assets/env/icon.png`,
        supportsTablet: false,
        bundleIdentifier: loadedEnv.bundleId,
        infoPlist: {
            ITSAppUsesNonExemptEncryption: false,
        },
    },
    android: {
        adaptiveIcon: {
            foregroundImage: `./src/assets/env/adaptive-icon.png`,
            backgroundColor: "#ffffff",
        },
        googleServicesFile: "./google-services.json",
        icon: `./src/assets/env/icon.png`,
        package: loadedEnv.package,
        permissions: [
            "READ_EXTERNAL_STORAGE",
        ],
    },
    plugins: [
        ["@sentry/react-native/expo", {
            organization: "kyx-s0",
            project: "kyx-app",
        }],
        "expo-router",
        [
            "expo-splash-screen",
            {
                preventAutoHide: true,
                image: "./src/assets/env/icon.png",
                backgroundColor: "#ffffff",
                imageWidth: 200
            }
        ],
        [
            "expo-font",
            {
                fonts: [
                    "./src/assets/fonts/Kavoon-Regular.ttf",
                    "./src/assets/fonts/Poppins-Black.ttf",
                    "./src/assets/fonts/Poppins-Bold.ttf",
                    "./src/assets/fonts/Poppins-ExtraBold.ttf",
                    "./src/assets/fonts/Poppins-ExtraLight.ttf",
                    "./src/assets/fonts/Poppins-Light.ttf",
                    "./src/assets/fonts/Poppins-Medium.ttf",
                    "./src/assets/fonts/Poppins-Regular.ttf",
                    "./src/assets/fonts/Poppins-SemiBold.ttf",
                    "./src/assets/fonts/Poppins-Thin.ttf",
                ]
            }
        ],
    ],
    experiments: {
        typedRoutes: true
    },
    extra: {
        router: {},
        eas: {
            projectId: loadedEnv.projectId,
        },
        apiUrl: loadedEnv.apiUrl,
        slug: loadedEnv.slug,
    }
}

export default config;
