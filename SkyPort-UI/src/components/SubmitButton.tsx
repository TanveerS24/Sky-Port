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
                { 
                    backgroundColor: colors.btnPrimaryBg,
                    borderColor: colors.borderDefault 
                },
                disabled && { opacity: 0.5, backgroundColor: colors.borderMuted }
            ]}
        >
            <Text style={[styles.text, { color: colors.btnPrimaryText }]}>{title}</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    button: {
        paddingVertical: 7,
        width: 100,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        borderWidth: 1,
    },
    text: {
        fontWeight: '500',
    }
});