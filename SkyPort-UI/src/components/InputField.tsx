import { StyleSheet, TextInput, TextInputProps, View } from "react-native";

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
    style
}: InputFieldProps) {
    return (
        <View>
            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                secureTextEntry={secureTextEntry}
                style={[styles.input, style]}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    input: {
        height: 40,
        borderColor: '#5C4A46',
        backgroundColor: '#B8A6A3',
        borderWidth: 1,
        borderRadius: 5,
        width: 250,
        paddingBottom: 10,
    }
});