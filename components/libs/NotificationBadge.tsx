import { View, StyleSheet, ViewStyle } from 'react-native';
import Typo from '@/components/libs/Typo';

export default function NotificationBadge({ count, style }: { count: number; style?: ViewStyle }) {
    if (!count || count <= 0) return null;

    const text = count >= 99 ? '99+' : String(count);

    return (
        <View style={[styles.badge, style]}> 
            <Typo weight={'700'} fontSize={8} color={'#3F3F3F'} style={styles.badgeText}>
                {text}
            </Typo>
        </View>
    );
}

const styles = StyleSheet.create({
    badge: {
        minWidth: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 2,
    },
    badgeText: {
        letterSpacing: -0.08,
        lineHeight: 12,
    },
});


