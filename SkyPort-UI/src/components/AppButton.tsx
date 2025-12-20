import {router, Href} from "expo-router";
import { StyleSheet, ViewStyle, TextStyle, Pressable, Text } from "react-native";

type AppButtonProps = {
  title: string;
  onPress?: () => void;
  to?: Href;
  replace?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
};

export default function AppButton({
    title,
    onPress,
    to,
    replace,
    disabled,
    style,
    textStyle
}: AppButtonProps) {
    const handlePress = () => {
        if (disabled) return;
        
        if (to) {
            replace ? router.replace(to) : router.push(to);
            return;
        }

        onPress?.();
    };

    return (
        <Pressable
            onPress={handlePress}
            disabled={disabled}
            style={({pressed}) => [
                styles.button,
                pressed && styles.pressed,
                disabled && styles.disabled,
                style
            ]}>
            <Text style={[styles.text, textStyle]}>{title}</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: 'center',
    margin: 10,
  },
  pressed: {
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
})