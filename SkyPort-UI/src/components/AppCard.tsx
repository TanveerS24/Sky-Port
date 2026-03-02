import {View, Text, Pressable, StyleSheet, ViewStyle, TextStyle} from 'react-native';
import { Href, router } from 'expo-router';
import { useTheme } from '../context/themeProvider.context';

type AppCardProps = {
    title: string;
    onpress?: () => void;
    to?: Href;
    replace?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
    badge?: number; // Notification badge count
};

export default function AppCard({
    title,
    onpress,
    to,
    replace,
    style,
    textStyle,
    badge
}: AppCardProps) {
    const { colors } = useTheme();
    const handlePress = () => {
        if (to) {
            replace ? router.replace(to) : router.push(to);
            return;
        }

        onpress?.();
    };

    return (
        <View style={styles.container}>
            <Pressable
                onPress={handlePress}
                style={({pressed}) => [
                    [styles.card, { backgroundColor: colors.bgSecondary }],
                    pressed && styles.pressed,
                    style
                ]}>
                <Text style={[styles.text, { color: colors.textSecondary }, textStyle]}>{title}</Text>
            </Pressable>
            {badge !== undefined && badge > 0 && (
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>{badge > 99 ? '99+' : badge}</Text>
                </View>
            )}
        </View>
    )
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  card: {
    padding: 20,
    borderRadius: 10,
    marginVertical: 10,
    marginHorizontal: 20,
  },
  pressed: {
    opacity: 0.85,
  },
  text: {
    fontSize: 18,
    fontWeight: '500',
  },
  badge: {
    position: 'absolute',
    top: 5,
    right: 15,
    backgroundColor: '#f44336',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
