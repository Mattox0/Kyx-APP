import {useState} from "react";
import SettingsMain from "@/components/settings/SettingsMain";

export type SettingsSection = 'main' | 'createQuestion'// | 'profile' | 'notifications' | ...

interface SettingsProps {
    onClose: () => void;
}

export default function Settings({ onClose }: SettingsProps) {
    const [section, setSection] = useState<SettingsSection>('main');

    // if (section === 'profile') return <SettingsProfile onBack={() => setSection('main')} />;

    return (
        <SettingsMain
            onNavigate={setSection}
            onClose={onClose}
        />
    );
}
