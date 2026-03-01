import {useState} from 'react';
import {useRouter} from 'expo-router';
import FriendsMain from '@/components/friends/FriendsMain';
import AddFriendSection from '@/components/friends/AddFriendSection';

type FriendsSection = 'main' | 'add';

export default function Friends() {
    const [section, setSection] = useState<FriendsSection>('main');
    const router = useRouter();

    const onClose = () => {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.push('/');
        }
    };

    if (section === 'add') {
        return <AddFriendSection onBack={() => setSection('main')} />;
    }

    return (
        <FriendsMain
            onClose={onClose}
            onAddFriend={() => setSection('add')}
        />
    );
}
