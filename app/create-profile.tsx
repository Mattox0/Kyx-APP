import {Page} from "@/containers/Page";
import {Text} from "@/components/ui/Text";
import {useCallback, useState} from "react";
import {useRouter} from "expo-router";
import useTranslations from "@/hooks/use-translations";
import {Pressable, View} from "react-native";
import Button from "@/components/ui/Button";
import RandomIcon from "@/assets/icons/random.svg";
import MaleIcon from "@/assets/icons/male.svg";
import FemaleIcon from "@/assets/icons/female.svg";
import {
    Avatar,
    AvatarOptions,
    AvatarOptionSelector,
    CategoryTabs,
    CategoryType,
    DEFAULT_OPTIONS,
    EYEBROWS_OPTIONS,
    EYES_OPTIONS,
    GLASSES_OPTIONS,
    HAIR_COLOR_OPTIONS,
    HAIR_OPTIONS,
    MOUTH_OPTIONS,
    SKIN_COLOR_OPTIONS,
} from "@/components/avatar";
import Input from "@/components/ui/Input";
import {Gender} from "@/types/Gender";

export default function CreateProfilePage() {
    const router = useRouter();
    const i18n = useTranslations();
    const [gender, setGender] = useState<Gender>(Gender.MALE);
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
            case 'hair':
                return (
                    <AvatarOptionSelector
                        optionType="hair"
                        options={HAIR_OPTIONS}
                        colorOptions={HAIR_COLOR_OPTIONS}
                        currentOptions={avatarOptions}
                        selectedValue={avatarOptions.hair?.[0]}
                        selectedColorValue={avatarOptions.hairColor?.[0]}
                        onSelect={(value) => updateOption('hair', value)}
                        onColorSelect={(value) => updateOption('hairColor', value)}
                    />
                );
            case "eye":
                return (
                    <AvatarOptionSelector
                        optionType="eyes"
                        options={EYES_OPTIONS}
                        currentOptions={avatarOptions}
                        selectedValue={avatarOptions.eyes?.[0]}
                        onSelect={(value) => updateOption('eyes', value)}
                    />
                );
            case "eyebrow":
                return (
                    <AvatarOptionSelector
                        optionType="eyebrows"
                        options={EYEBROWS_OPTIONS}
                        currentOptions={avatarOptions}
                        selectedValue={avatarOptions.eyebrows?.[0]}
                        onSelect={(value) => updateOption('eyebrows', value)}
                    />
                );
            case "mouth":
                return (
                    <AvatarOptionSelector
                        optionType="mouth"
                        options={MOUTH_OPTIONS}
                        currentOptions={avatarOptions}
                        selectedValue={avatarOptions.mouth?.[0]}
                        onSelect={(value) => updateOption('mouth', value)}
                    />
                );
            case "glasses":
                return (
                    <AvatarOptionSelector
                        optionType="glasses"
                        options={GLASSES_OPTIONS}
                        currentOptions={avatarOptions}
                        selectedValue={avatarOptions.glasses?.[0]}
                        onSelect={(value) => updateOption('glasses', value)}
                        isOptional={true}
                    />
                );
            case "skin":
                return (
                    <AvatarOptionSelector
                        optionType="skinColor"
                        options={SKIN_COLOR_OPTIONS}
                        currentOptions={avatarOptions}
                        selectedValue={avatarOptions.skinColor?.[0]}
                        onSelect={(value) => updateOption('skinColor', value)}
                    />
                );
            default:
                return null;
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

            <View className="flex-row gap-10 justify-center mb-6">
                <Pressable onPress={() => setGender(Gender.MALE)} className={`bg-background rounded-2xl p-2 border-2  ${gender === Gender.MALE ? 'border-[#2B7FFF]' : 'border-transparent opacity-50'}`}>
                    <MaleIcon width={60} height={60} color="#2B7FFF" />
                </Pressable>

                <Pressable onPress={() => setGender(Gender.FEMALE)} className={`bg-background rounded-2xl p-2 border-2 ${gender === Gender.FEMALE ? 'border-[#F6339A]' : 'border-transparent opacity-50'}`}>
                    <FemaleIcon width={60} height={60} color="#F6339A" />
                </Pressable>
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
