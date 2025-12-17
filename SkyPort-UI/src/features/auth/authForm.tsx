import {View, Text} from "react-native";
import {AuthFormProps} from "./types";

const AuthForm = ({mode}: AuthFormProps) => {
    return (
        <View>
            <Text>This is the {mode} form.</Text>
        </View>
    );
};

export default AuthForm;