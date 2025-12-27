import { StyleSheet, TextInput, TextInputProps, View } from "react-native";
import { useTheme } from "../context/themeProvider";

type InputFieldProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  style?: object;
  keyboardType?: TextInputProps['keyboardType'];
}

export default function InputField({
    value,
    onChangeText,
    placeholder,
    secureTextEntry,
    style,
    keyboardType
}: InputFieldProps) {
    const { colors } = useTheme();
    return (
        <View>
            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={colors.textMuted}
                secureTextEntry={secureTextEntry}
                keyboardType={keyboardType}
                style={[
                    styles.input, 
                    { 
                        borderColor: colors.borderDefault,
                        backgroundColor: colors.bgSecondary,
                        color: colors.textPrimary 
                    }, 
                    style
                ]}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    input: {
        height: 40,
        borderWidth: 1,
        borderRadius: 5,
        width: 250,
        paddingHorizontal: 10,
    }
});