import {View, Text, Pressable, StyleSheet, ViewStyle, TextStyle} from 'react-native';
import { Href, router } from 'expo-router';
import { useTheme } from '../context/themeProvider';

type AppCardProps = {
    title: string;
    onpress?: () => void;
    to?: Href;
    replace?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
};

export default function AppCard({
    title,
    onpress,
    to,
    replace,
    style,
    textStyle
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
        <View>
            <Pressable
                onPress={handlePress}
                style={({pressed}) => [
                    [styles.card, { backgroundColor: colors.bgSecondary }],
                    pressed && styles.pressed,
                    style
                ]}>
                <Text style={[styles.text, { color: colors.textSecondary }, textStyle]}>{title}</Text>
            </Pressable>
        </View>
    )
};

const styles = StyleSheet.create({
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
});
