import { Page } from "@/containers/Page";
import { useCallback } from "react";
import { useRouter } from "expo-router";
import { Text } from "@/components/ui/Text";

export default function PreferOnlinePage() {
    const router = useRouter();

    const goBack = useCallback(() => {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.push("/");
        }
    }, [router]);

    return (
        <Page
            onBack={goBack}
            containerClassName="mt-24 px-4 mb-8"
            scrollable={false}
            logoAction={() => {}}
        >
            <Text>OUi</Text>
        </Page>
    );
}
