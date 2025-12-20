import { Pressable, Text, StyleSheet } from "react-native";

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
    return (
        <Pressable
            onPress={onPress}
            disabled={disabled}
            style={[styles.button, disabled && { opacity: 0.5 }]}
        >
            <Text style={styles.text}>{title}</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#419FBAFF',
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