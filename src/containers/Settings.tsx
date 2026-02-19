import {useState} from "react";
import SettingsMain from "@/components/settings/SettingsMain";
import SettingsSuggestion from "@/components/settings/_pages/SettingsSuggestion";
import {useRouter} from "expo-router";

export type SettingsSection = 'main' | 'createQuestion'// | 'profile' | 'notifications' | ...

export default function Settings() {
    const [section, setSection] = useState<SettingsSection>('main');
    const router = useRouter();

    const onClose = () => {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.push("/");
        }
    }

    if (section === 'createQuestion') return <SettingsSuggestion onBack={() => setSection('main')} onClose={onClose} />;

    return (
        <SettingsMain
            onNavigate={setSection}
            onClose={onClose}
        />
    );
}
