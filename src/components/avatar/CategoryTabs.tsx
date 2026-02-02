import {View, Pressable} from 'react-native';
import {CategoryType} from "@/types/CategoryType";
import {FC, Fragment} from "react";
import HairIcon from "@/assets/icons/category/hair.svg";
import EyeIcon from "@/assets/icons/category/eye.svg";
import EyebrowsIcon from "@/assets/icons/category/eyebrow.svg";
import MouthIcon from "@/assets/icons/category/mouth.svg";
import GlassesIcon from "@/assets/icons/category/glasses.svg";
import SkinColorIcon from "@/assets/icons/category/skin.svg";
import {SvgProps} from "react-native-svg";

interface CategoryTabsProps {
    selected: CategoryType;
    onSelect: (category: CategoryType) => void;
}

interface CategoryTab {
    id: CategoryType;
    icon: FC<SvgProps>;
}

const CATEGORIES: CategoryTab[] = [{
        id: 'hair',
        icon: HairIcon,
    }, {
        id: 'eye',
        icon: EyeIcon,
    }, {
        id: 'eyebrow',
        icon: EyebrowsIcon,
    }, {
        id: 'mouth',
        icon: MouthIcon,
    }, {
        id: 'glasses',
        icon: GlassesIcon,
    }, {
        id: 'skin',
        icon: SkinColorIcon,
}];

export default function CategoryTabs({selected, onSelect}: CategoryTabsProps) {
    return (
        <View className="mb-4 w-full">
            <View className="flex-row justify-between">
                {CATEGORIES.map((tab, index) => {
                    const IconComponent = tab.icon;
                    const isSelected = selected === tab.id;

                    return (
                        <Fragment key={tab.id}>
                            <Pressable
                                onPress={() => onSelect(tab.id)}
                                className="px-4 py-2 rounded-full"
                            >
                                <IconComponent
                                    width={30}
                                    height={30}
                                    color={isSelected ? "#F6339A" : "#312B99"}
                                />
                            </Pressable>

                            {index < CATEGORIES.length - 1 && (
                                <View className="w-px h-8 bg-[#312B99] self-center"/>
                            )}
                        </Fragment>
                    );
                })}
            </View>
        </View>
    );
}
