import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
const MyDetails = ({ navigation }) => {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const insets = useSafeAreaInsets();
    const getUserDetails = async () => {

        let token = await AsyncStorage.getItem('token')
        const headers = {
            'x-access-token': token,
        }

        let response = await axios.get('https://hybee-auth.moshimoshi.cloud/user', { headers })
        console.log("USER DETAILS", response?.data?.data)
        setName(response?.data?.data?.name)
        setEmail(response?.data?.data?.email)
        setPhone(response?.data?.data?.phone)
    }
    useEffect(() => { getUserDetails() }, [])
    return (
        <SafeAreaProvider style={{backgroundColor: "white"}}>
            <View style={{ width: "100%", height: "100%", backgroundColor: "white", marginTop: insets.top }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', }}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Image source={require('../../assets/img/leftarrow.png')} style={{ marginLeft: 20, marginTop: 15 }} />
                    </TouchableOpacity>
                    <Text style={{ marginLeft: 12, marginTop: 12, fontSize: 14, fontWeight: '500', color: '#12352F' }}>
                        Account Details
                    </Text>
                </View>
                <View style={{ marginLeft: 20, marginTop: 20 }}>
                    <TouchableOpacity style={{ marginTop: 25, alignSelf: "flex-end", marginRight: 20, }} onPress={() => navigation.navigate("Edit Account Details")}>
                        <Text style={{ textDecorationLine: "underline", color: "#12352F" }}></Text>
                        <Image source={require("./../../assets/img/editIcon.png")} style={{ height: 15, aspectRatio: 1 }} />
                    </TouchableOpacity>
                    <Text style={styles.bigtext}>Full Name:</Text>
                    <Text style={styles.smalltext}>{name}</Text>
                    <Text style={styles.bigtext}>Email:</Text>
                    <Text style={styles.smalltext}>{email}</Text>
                    <Text style={styles.bigtext}>Contact Number:</Text>
                    <Text style={styles.smalltext}>{phone}</Text>
                    <Text style={styles.smalltext}>Society:</Text>
                    <Text style={styles.bigtext}>Prestige Layout, Shankarpura, Bangalore - 560001</Text>
                    <Text style={styles.smalltext}>Flat Details</Text>
                    <Text style={styles.bigtext}>5143, Block 4</Text>

                </View>

            </View>

        </SafeAreaProvider>
    )
}

const styles = StyleSheet.create({
    bigtext: {
        fontFamily: 'DM Sans',
        //fontWeight: 500,
        fontSize: 13,
        color: "#12352F",
    }, smalltext:
    {
        fontFamily: 'DM Sans',
        //fontWeight: 400,
        fontSize: 12,
        color: "#3C5F58",
        marginBottom: 20
    }
})
export default MyDetails