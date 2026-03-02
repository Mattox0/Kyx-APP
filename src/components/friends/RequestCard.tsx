import {ReactNode} from 'react';
import {View} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import Avatar, {AvatarOptions} from '@/components/avatar/Avatar';
import {Text} from '@/components/ui/Text';

interface RequestCardProps {
    name: string;
    friendCode: string;
    avatarOptions?: AvatarOptions;
    actions: ReactNode;
}

export default function RequestCard({name, friendCode, avatarOptions, actions}: RequestCardProps) {
    return (
        <LinearGradient
            colors={['#2A2344', '#332850']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={{borderRadius: 24, borderWidth: 1, borderColor: '#2F3247', flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12}}
        >
            <Avatar options={avatarOptions} size={44} />
            <View style={{flex: 1}}>
                <Text className="font-semibold">{name}</Text>
                <Text className="text-xs text-gray">{friendCode}</Text>
            </View>
            {actions}
        </LinearGradient>
    );
}
