import { Page } from "@/containers/Page";
import { useCallback } from "react";
import { useRouter } from "expo-router";
import CardCount from "@/components/game/CardCount";
import CardSlider from "@/components/game/CardSlider";
import useGameLocal from "@/hooks/use-game-local";

export default function NeverHave() {
    const router = useRouter();
    const { total, currentIndex, progress } = useGameLocal();

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
            containerClassName="mt-24 px-4"
            scrollable={false}
            logoAction={() => {}}
        >
            <CardCount total={total} currentCount={currentIndex + 1} progress={progress} />
            <CardSlider />
        </Page>
    );
}
