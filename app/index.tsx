import {Text} from "react-native";
import {Page} from "@/containers/Page";

export default function Index() {
    return (
        <Page
            showSettings
            scrollable={false}
            logoAction={() => {}}
        >
            <Text className="text-white">Hello, World!</Text>
        </Page>
    )
}
