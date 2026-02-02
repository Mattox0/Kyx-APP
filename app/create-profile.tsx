import {Page} from "@/containers/Page";
import {Text} from "@/components/ui/Text";
import {useCallback, useState} from "react";
import {useRouter} from "expo-router";
import useTranslations from "@/hooks/use-translations";
import {Pressable, View} from "react-native";
import Button from "@/components/ui/Button";
import RandomIcon from "@/assets/icons/random.svg";
import {
    Avatar,
    AvatarOptionSelector,
    AvatarOptions,
    CategoryTabs,
    CategoryType,
    DEFAULT_OPTIONS,
    HAIR_OPTIONS,
    EYES_OPTIONS,
    EYEBROWS_OPTIONS,
    MOUTH_OPTIONS,
    SKIN_COLOR_OPTIONS,
    HAIR_COLOR_OPTIONS,
    EARRINGS_OPTIONS,
    GLASSES_OPTIONS,
    FEATURES_OPTIONS,
} from "@/components/avatar";
import Input from "@/components/ui/Input";

export default function CreateProfilePage() {
    const router = useRouter();
    const i18n = useTranslations();
    const [avatarOptions, setAvatarOptions] = useState<AvatarOptions>(DEFAULT_OPTIONS);
    const [selectedCategory, setSelectedCategory] = useState<CategoryType>('skin');

    const goBack = useCallback(() => {
        if (router.canGoBack()) {
            router.back()
        } else {
            router.replace('/')
        }
    }, [router]);

    const handleSave = useCallback(() => {
        console.log('Avatar options:', avatarOptions);
        router.back();
    }, [avatarOptions, router]);

    const updateOption = useCallback((
        key: keyof AvatarOptions,
        value: string | undefined,
    ) => {
        setAvatarOptions(prev => {
            const newOptions = {...prev};
            if (value === undefined) {
                delete (newOptions as any)[key];
            } else {
                (newOptions as any)[key] = [value];
            }
            return newOptions;
        });
    }, []);

    const randomChoice = useCallback(() => {
        console.log("Choose random avatar options");
    }, []);

    const renderCategoryContent = () => {
        switch (selectedCategory) {
            case 'skin':
                return (
                    <AvatarOptionSelector
                        title={i18n.t("profile.skinColor")}
                        optionType="skinColor"
                        options={SKIN_COLOR_OPTIONS}
                        currentOptions={avatarOptions}
                        selectedValue={avatarOptions.skinColor?.[0]}
                        onSelect={(value) => updateOption('skinColor', value)}
                        isColor
                    />
                );
            case 'hair':
                return (
                    <>
                        <AvatarOptionSelector
                            title={i18n.t("profile.hair")}
                            optionType="hair"
                            options={HAIR_OPTIONS}
                            currentOptions={avatarOptions}
                            selectedValue={avatarOptions.hair?.[0]}
                            onSelect={(value) => updateOption('hair', value)}
                        />
                        <AvatarOptionSelector
                            title={i18n.t("profile.hairColor")}
                            optionType="hairColor"
                            options={HAIR_COLOR_OPTIONS}
                            currentOptions={avatarOptions}
                            selectedValue={avatarOptions.hairColor?.[0]}
                            onSelect={(value) => updateOption('hairColor', value)}
                            isColor
                        />
                    </>
                );
            case 'face':
                return (
                    <>
                        <AvatarOptionSelector
                            title={i18n.t("profile.eyes")}
                            optionType="eyes"
                            options={EYES_OPTIONS}
                            currentOptions={avatarOptions}
                            selectedValue={avatarOptions.eyes?.[0]}
                            onSelect={(value) => updateOption('eyes', value)}
                        />
                        <AvatarOptionSelector
                            title={i18n.t("profile.eyebrows")}
                            optionType="eyebrows"
                            options={EYEBROWS_OPTIONS}
                            currentOptions={avatarOptions}
                            selectedValue={avatarOptions.eyebrows?.[0]}
                            onSelect={(value) => updateOption('eyebrows', value)}
                        />
                        <AvatarOptionSelector
                            title={i18n.t("profile.mouth")}
                            optionType="mouth"
                            options={MOUTH_OPTIONS}
                            currentOptions={avatarOptions}
                            selectedValue={avatarOptions.mouth?.[0]}
                            onSelect={(value) => updateOption('mouth', value)}
                        />
                        <AvatarOptionSelector
                            title={i18n.t("profile.features")}
                            optionType="features"
                            options={FEATURES_OPTIONS}
                            currentOptions={avatarOptions}
                            selectedValue={avatarOptions.features?.[0]}
                            onSelect={(value) => updateOption('features', value)}
                            isOptional
                        />
                    </>
                );
            case 'accessories':
                return (
                    <>
                        <AvatarOptionSelector
                            title={i18n.t("profile.earrings")}
                            optionType="earrings"
                            options={EARRINGS_OPTIONS}
                            currentOptions={avatarOptions}
                            selectedValue={avatarOptions.earrings?.[0]}
                            onSelect={(value) => updateOption('earrings', value)}
                            isOptional
                        />
                        <AvatarOptionSelector
                            title={i18n.t("profile.glasses")}
                            optionType="glasses"
                            options={GLASSES_OPTIONS}
                            currentOptions={avatarOptions}
                            selectedValue={avatarOptions.glasses?.[0]}
                            onSelect={(value) => updateOption('glasses', value)}
                            isOptional
                        />
                    </>
                );
        }
    };

    return (
        <Page
            onBack={goBack}
            logoAction={() => {}}
            scrollable={true}
            containerClassName="mb-16"
            bottomChildren={
                <View className="absolute bottom-0 w-full px-4 mb-8">
                    <Button onPress={handleSave}>
                        {i18n.t("common.save")}
                    </Button>
                </View>
            }
        >
            <Text className="font-bold text-3xl text-center mt-4">{i18n.t("profile.title")}</Text>

            <View className="items-center my-8">
                <View className="bg-container rounded-2xl p-2">
                    <Avatar options={avatarOptions} size={90} />
                    <Pressable onPress={randomChoice} className="absolute bottom-1 right-2">
                        <RandomIcon width={24} height={24} color="#FFFFFF" />
                    </Pressable>
                </View>
            </View>

            <View className="px-10 mb-6">
                <Input placeholder={i18n.t("profile.input.placeholder")} />
            </View>

            <CategoryTabs
                selected={selectedCategory}
                onSelect={setSelectedCategory}
            />

            <View className="flex-1">
                {renderCategoryContent()}
            </View>
        </Page>
    )
}
