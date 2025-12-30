import { Pressable, Text, StyleSheet } from "react-native";
import { useTheme } from "../context/themeProvider";

type SubmitButtonProps = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
};

export default function SubmitButton({
    title,
    onPress,
    disabled
}: SubmitButtonProps) {
    const { colors } = useTheme();
    return (
        <Pressable
            onPress={onPress}
            disabled={disabled}
            style={[
                styles.button, 
                { backgroundColor: colors.btnPrimaryBg },
                disabled && { opacity: 0.5, backgroundColor: colors.borderMuted }
            ]}
        >
            <Text style={[styles.text, { color: colors.btnPrimaryText }, disabled && { color: colors.textInverse }]}>{title}</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    button: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    text: {
        fontSize: 16,
        fontWeight: '600',
    }
});