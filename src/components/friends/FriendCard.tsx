import {View} from 'react-native';
import {Text} from '@/components/ui/Text';
import Avatar, {AvatarOptions} from '@/components/avatar/Avatar';
import {Gender} from '@/types/Gender';
import MaleIcon from '@/assets/icons/male.svg';
import FemaleIcon from '@/assets/icons/female.svg';
import {LinearGradient} from 'expo-linear-gradient';

interface FriendCardProps {
    name: string;
    gender: Gender;
    avatarOptions?: AvatarOptions;
}

export default function FriendCard({name, gender, avatarOptions}: FriendCardProps) {
    const isMale = gender === Gender.MAN;

    return (
        <LinearGradient
            colors={['#2A2344', '#332850']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={{borderRadius: 24, borderWidth: 1, borderColor: '#2F3247', flexDirection: 'row', alignItems: 'center', padding: 12, gap: 16}}
        >
            <Avatar options={avatarOptions} size={56} />
            <Text className="flex-1 font-semibold text-base">{name}</Text>
            <View
                style={{
                    width: 36, height: 36, borderRadius: 18,
                    backgroundColor: isMale ? 'rgba(43,127,255,0.15)' : 'rgba(246,51,154,0.15)',
                    alignItems: 'center', justifyContent: 'center',
                }}
            >
                {isMale
                    ? <MaleIcon width={18} height={18} color="#2B7FFF" />
                    : <FemaleIcon width={18} height={18} color="#F6339A" />
                }
            </View>
        </LinearGradient>
    );
}
