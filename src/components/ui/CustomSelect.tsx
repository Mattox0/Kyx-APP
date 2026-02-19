import {useState} from "react";
import {Pressable, View} from "react-native";
import {Text} from "@/components/ui/Text";
import ChevronUpIcon from "@/assets/icons/chevron-up.svg";
import ChevronDownIcon from "@/assets/icons/chevron-down.svg";
import CheckmarkIcon from "@/assets/icons/checkmark.svg";
import SelectSkeleton from "@/components/skeletons/SelectSkeleton";

interface CustomSelectProps<T> {
    label: string;
    placeholder: string;
    options: T[];
    selected: T | null;
    onSelect: (value: T) => void;
    getLabel: (item: T) => string;
    getId: (item: T) => string;
    isLoading?: boolean;
    disabled?: boolean;
}

export default function CustomSelect<T>({label, placeholder, options, selected, onSelect, getLabel, getId, isLoading, disabled}: CustomSelectProps<T>) {
    const [open, setOpen] = useState(false);

    return (
        <View className="gap-2">
            <Text className="text-white text-sm font-medium ml-2">{label}</Text>

            {isLoading ? (
                <SelectSkeleton />
            ) : (
                <>
                    <Pressable
                        onPress={() => !disabled && setOpen(prev => !prev)}
                        style={{borderWidth: 1.768, borderColor: 'rgba(255, 255, 255, 0.10)', backgroundColor: 'rgba(255, 255, 255, 0.05)', opacity: disabled ? 0.4 : 1}}
                        className="h-14 px-5 rounded-2xl flex-row items-center justify-between"
                    >
                        <Text className={selected ? "text-white text-sm" : "text-[rgba(153,161,175,0.6)] text-sm"}>
                            {selected ? getLabel(selected) : placeholder}
                        </Text>
                        {open
                            ? <ChevronUpIcon width={18} height={18} color="#99A1AF" />
                            : <ChevronDownIcon width={18} height={18} color="#99A1AF" />
                        }
                    </Pressable>

                    {open && (
                        <View
                            style={{borderWidth: 1.768, borderColor: 'rgba(255, 255, 255, 0.10)', backgroundColor: '#2A2344'}}
                            className="rounded-2xl overflow-hidden"
                        >
                            {options.map((item, index) => {
                                const isSelected = selected !== null && getId(selected) === getId(item);
                                return (
                                    <Pressable
                                        key={getId(item)}
                                        onPress={() => {onSelect(item); setOpen(false);}}
                                        className={`flex-row items-center justify-between px-5 py-4 ${index < options.length - 1 ? 'border-b border-border' : ''}`}
                                    >
                                        <Text className={`text-sm ${isSelected ? 'text-pink font-semibold' : 'text-white'}`}>
                                            {getLabel(item)}
                                        </Text>
                                        {isSelected && <CheckmarkIcon width={18} height={18} color="#F6339A" />}
                                    </Pressable>
                                );
                            })}
                        </View>
                    )}
                </>
            )}
        </View>
    );
}