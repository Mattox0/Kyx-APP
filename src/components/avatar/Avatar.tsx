import {Image} from 'expo-image';
import {useMemo} from 'react';

export interface AvatarOptions {
    hair?: string[];
    hairColor?: string[];
    eyes?: string[];
    eyebrows?: string[];
    mouth?: string[];
    skinColor?: string[];
    glasses?: string[];
}

interface AvatarProps {
    options?: AvatarOptions;
    size?: number;
    seed?: string;
}

export const HAIR_OPTIONS = [
    'short01', 'short02', 'short03', 'short04', 'short05', 'short06', 'short07', 'short08', 'short09', 'short10',
    'short11', 'short12', 'short13', 'short14', 'short15', 'short16', 'short17', 'short18', 'short19',
    'long01', 'long02', 'long03', 'long04', 'long05', 'long06', 'long07', 'long08', 'long09', 'long10',
    'long11', 'long12', 'long13', 'long14', 'long15', 'long16', 'long17', 'long18', 'long19', 'long20',
    'long21', 'long22', 'long23', 'long24', 'long25', 'long26'
];

export const EYES_OPTIONS = [
    'variant01', 'variant02', 'variant03', 'variant04', 'variant05', 'variant06', 'variant07', 'variant08',
    'variant09', 'variant10', 'variant11', 'variant12', 'variant13', 'variant14', 'variant15', 'variant16',
    'variant17', 'variant18', 'variant19', 'variant20', 'variant21', 'variant22', 'variant23', 'variant24',
    'variant25', 'variant26'
];

export const EYEBROWS_OPTIONS = [
    'variant01', 'variant02', 'variant03', 'variant04', 'variant05', 'variant06', 'variant07', 'variant08',
    'variant09', 'variant10', 'variant11', 'variant12', 'variant13', 'variant14', 'variant15'
];

export const MOUTH_OPTIONS = [
    'variant01', 'variant02', 'variant03', 'variant04', 'variant05', 'variant06', 'variant07', 'variant08',
    'variant09', 'variant10', 'variant11', 'variant12', 'variant13', 'variant14', 'variant15', 'variant16',
    'variant17', 'variant18', 'variant19', 'variant20', 'variant21', 'variant22', 'variant23', 'variant24',
    'variant25', 'variant26', 'variant27', 'variant28', 'variant29', 'variant30'
];

export const SKIN_COLOR_OPTIONS = ['f2d3b1', 'ecad80', '9e5622', '763900'];

export const HAIR_COLOR_OPTIONS = [
    '000000', '0C0C0C', '1C1C1C', '2C1608', '3D2314', '4E3B31', '5C4033',
    '6A4E42', '724133', '8B6C5C', '9C8169', 'B89778', 'A58D7F', 'B8935E',
    'D4A76A', 'E5C08E', 'F3E5AB', 'FAF0BE', '8B4513', 'A0522D', 'B55239',
    'CB6D51', 'D68A59', 'FF6347', '808080', 'A9A9A9'
];

export const GLASSES_OPTIONS = ['variant01', 'variant02', 'variant03', 'variant04', 'variant05'];

export const DEFAULT_OPTIONS: AvatarOptions = {
    hair: ['short01'],
    hairColor: ['0e0e0e'],
    eyes: ['variant01'],
    eyebrows: ['variant01'],
    mouth: ['variant01'],
    skinColor: ['f2d3b1'],
};

function buildAvatarUrl(options: AvatarOptions, seed?: string): string {
    const params = new URLSearchParams();

    if (seed) params.append('seed', seed);
    if (options.hair?.[0]) params.append('hair', options.hair[0]);
    if (options.hairColor?.[0]) params.append('hairColor', options.hairColor[0]);
    if (options.eyes?.[0]) params.append('eyes', options.eyes[0]);
    if (options.eyebrows?.[0]) params.append('eyebrows', options.eyebrows[0]);
    if (options.mouth?.[0]) params.append('mouth', options.mouth[0]);
    if (options.skinColor?.[0]) params.append('skinColor', options.skinColor[0]);
    if (options.glasses?.[0]) {
        params.append('glasses', options.glasses[0]);
        params.append('glassesProbability', '100');
    }

    return `https://api.dicebear.com/9.x/adventurer/svg?${params.toString()}`;
}

export default function Avatar({options = DEFAULT_OPTIONS, size = 120, seed}: AvatarProps) {
    const uri = useMemo(() => buildAvatarUrl(options, seed), [options, seed]);

    return (
        <Image
            source={{uri}}
            style={{width: size, height: size}}
            contentFit="contain"
            cachePolicy="memory-disk"
        />
    );
}
