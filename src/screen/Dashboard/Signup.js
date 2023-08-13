import { Text, View, TextInput, Button, Alert, StyleSheet } from "react-native";
import React, { useState, useEffect, useContext } from 'react';
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import Spinner from 'react-native-loading-spinner-overlay';
import { AuthContext } from '../../context/AuthContext'
export default function Signup() {

    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const navigation = useNavigation()

    const handleSubmit = () => {
        register(phone, email, password);
        navigation.navigate("LoginScreen")
    }

    const { isLoading, register } = useContext(AuthContext);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Spinner visible={isLoading} />
            <TextInput
                style={styles.input}
                placeholder="Enter your email"
                name="email"
                onChangeText={(text) => setEmail(text)}
                autoComplete='off'
                autoCorrect={false}
                autoCapitalize='none'
                value={email}
            />
            <TextInput
                style={styles.input}
                placeholder="+91 Enter your phone number"
                name="phone"
                onChangeText={(text) => setPhone(text)}
                autoComplete='off'
                autoCorrect={false}
                autoCapitalize='none'
                maxLength={10}
                value={phone}
            />
            <TextInput
                style={styles.input}
                placeholder="Enter the password"
                name="password"
                onChangeText={(text) => setPassword(text)}
                autoComplete='off'
                value={password}
                secureTextEntry={true}
            />

            <View style={{ width: "80%", alignItems: 'center', justifyContent: "center" }}>
                <TouchableOpacity onPress={handleSubmit}
                    style={{ borderRadius: 10, borderWidth: 2, backgroundColor: "black", width: 200, height: 40, justifyContent: "center", alignItems: "center" }} >
                    <Text style={{ color: "white" }}>Signup</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    input: {
        marginBottom: 20,
        height: 40,
        borderWidth: 1,
        padding: 10,
        borderRadius: 10,
        width: "80%"
    },
})