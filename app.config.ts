import {ExpoConfig} from "@expo/config-types";

type EnvName = "dev" | "prod";

type Environments = {
    [key in EnvName]: {
        envName: key;
        projectId: string;
        bundleId: `com.kyx.app${key extends "prod" ? "" : `.${key}`}`;
        package: `com.kyx.app${key extends "prod" ? "" : `.${key}`}`;
        slug: `kyx${key extends "prod" ? "" : `-${key}`}`;
        apiUrl: string;
    }
}

const environments: Environments = {
    dev: {
        envName: "dev",
        projectId: "",
        bundleId: "com.kyx.app.dev",
        package: "com.kyx.app.dev",
        slug: "kyx-dev",
        apiUrl: "https://api.kyx.com",
    },
    prod: {
        envName: "prod",
        projectId: "",
        bundleId: "com.kyx.app",
        package: "com.kyx.app",
        slug: "kyx",
        apiUrl: "https://api.kyx.com",
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
                fonts: []
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
    }
}

export default config;
