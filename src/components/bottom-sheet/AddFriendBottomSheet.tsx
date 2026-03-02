import { useRef, useState } from "react";
import {Pressable, TextInput, View} from 'react-native';
import CustomBottomSheet from '@/components/ui/CustomBottomSheet';
import {Text} from '@/components/ui/Text';
import {LinearGradient} from 'expo-linear-gradient';
import useBottomSheet from '@/hooks/use-bottom-sheet';
import useTranslations from '@/hooks/use-translations';
import FriendsIcon from '@/assets/icons/friends.svg';
import {BottomSheetTextInput} from '@gorhom/bottom-sheet';
import {api} from '@/lib/api';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {TanstackQueryKey} from '@/types/TanstackQueryKey';

interface AddFriendBottomSheetProps {
    onSuccess?: () => void;
}

export default function AddFriendBottomSheet({onSuccess}: AddFriendBottomSheetProps) {
    const {hideBottomSheet} = useBottomSheet();
    const i18n = useTranslations();
    const [code, setCode] = useState('');
    const [error, setError] = useState<'not_found' | 'already_exists' | null>(null);
    const inputRef = useRef<TextInput>(null);
    const queryClient = useQueryClient();

    const {mutate} = useMutation({
        mutationFn: () => api.post('/friend/request', {friendCode: code}, {validateStatus: (s) => s < 500}),
        onSuccess: (res) => {
            if (res.status === 404) { setError('not_found'); return; }
            if (res.status === 409) { setError('already_exists'); return; }
            queryClient.invalidateQueries({queryKey: [TanstackQueryKey.FRIEND_REQUESTS_SENT]});
            hideBottomSheet();
            onSuccess?.();
        },
    });

    return (
        <CustomBottomSheet
            initialIndex={0}
            primaryButtonText={i18n.t('friends.add.submit')}
            primaryButtonDisabled={code.length < 6}
            onPrimaryPress={() => mutate()}
        >
            <View className="items-center mb-6">
                <View style={{width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(246,51,154,0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: 12}}>
                    <FriendsIcon width={28} height={28} color="#F6339A" />
                </View>
                <Text className="text-xl font-bold">{i18n.t('friends.add.title')}</Text>
                <LinearGradient colors={['#F6339A', '#AD46FF']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={{height: 3, width: 48, marginTop: 6, borderRadius: 50}} />
            </View>

            <View className="mb-3">
                <Text className="text-white text-sm font-medium ml-2 mb-3">
                    {i18n.t('friends.add.inputLabel')}
                </Text>

                <BottomSheetTextInput
                    ref={inputRef as never}
                    value={code}
                    onChangeText={(text) => { setCode(text.toUpperCase()); setError(null); }}
                    autoCapitalize="characters"
                    maxLength={6}
                    style={{position: 'absolute', opacity: 0, width: 0, height: 0}}
                />

                <Pressable
                    onPress={() => inputRef.current?.focus()}
                    style={{flexDirection: 'row', gap: 8, justifyContent: 'center'}}
                >
                    {Array.from({length: 6}).map((_, i) => {
                        const isActive = i === code.length;
                        const isFilled = i < code.length;
                        return (
                            <View key={i} style={{
                                width: 44, height: 54, borderRadius: 12,
                                borderWidth: 1.768,
                                borderColor: isActive ? '#F6339A' : isFilled ? 'rgba(246,51,154,0.4)' : 'rgba(255,255,255,0.1)',
                                backgroundColor: 'rgba(255,255,255,0.05)',
                                alignItems: 'center', justifyContent: 'center',
                            }}>
                                <Text style={{fontSize: 22, color: '#FFFFFF'}}>
                                    {code[i] || ''}
                                </Text>
                            </View>
                        );
                    })}
                </Pressable>

                {error === 'not_found' && (
                    <Text className="text-red text-sm mt-2 text-center">{i18n.t('friends.add.errorMessage')}</Text>
                )}
                {error === 'already_exists' && (
                    <Text className="text-yellow text-sm mt-2 text-center">{i18n.t('friends.add.alreadyFriendMessage')}</Text>
                )}
            </View>
        </CustomBottomSheet>
    );
}
