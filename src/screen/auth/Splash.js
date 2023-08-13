import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import CheckInternet from '../Dashboard/CheckInternet';

export default function Splash({ navigation }) {
    useEffect(() => {
        setTimeout(() => {
            handleGetToken();
        }, 2000);
    });

    const handleGetToken = async () => {
        const dataToken = await AsyncStorage.getItem('Token');
        if (!dataToken) {
            console.log("NO TOKEEENNN")
            navigation.replace('LoginScreen');
        } else {
            navigation.replace('TabHomeBottom');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Splash</Text>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'black',
    },
    text: {
        //fontWeight: '800',
        fontSize: 30,
        color: 'white',
    },
});
