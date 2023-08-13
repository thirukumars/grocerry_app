import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useSafeAreaFrame } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-gesture-handler'
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';


const EditAccountDetails = ({ navigation }) => {
    const [userDetails, setUserDetails] = useState({})
    const insets = useSafeAreaInsets();
    const getUserDetails = async () => {

        let token = await AsyncStorage.getItem('token')
        const headers = {
            'x-access-token': token,
        }

        let response = await axios.get('https://hybee-auth.moshimoshi.cloud/user', { headers })
        console.log("USER DETAILS", response?.data?.data)
        setUserDetails(response?.data?.data)
        setName(response?.data?.data?.name)
        setEmail(response?.data?.data?.email)
    }

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    useEffect(() => { getUserDetails() }, [])
    const editProfile = async () => {
        let token = await AsyncStorage.getItem('token')
        const headers = {
            'x-access-token': token,
        }
        let response = await axios.put('https://hybee-auth.moshimoshi.cloud/user', { name, email }, { headers })
        console.log("DATA", response?.status)
        if (response?.status == 200) {
            Toast.show({
                type: 'success',
                text2: 'Profile Updated'
            })
            setTimeout(() => {
                navigation.goBack()
            }, 1500)
        } else {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Something went wrong'
            })
        }
    }
    return (
        <SafeAreaProvider>
            <View style={{ height: 50, width: "100%", backgroundColor: 'white', marginTop: insets.top }}>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', }}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Image source={require('../../assets/img/leftarrow.png')} style={{ marginLeft: 20, marginTop: 15 }} />
                    </TouchableOpacity>
                    <Text style={{ marginLeft: 12, marginTop: 12, fontSize: 14, fontWeight: '500', color: '#12352F' }}>
                        Account Details
                    </Text>
                </View>
            </View>
            <ScrollView style={{ flex: 1, width: "100%", height: "100%", backgroundColor: "white", }}>
                <View style={{ zIndex: 999 }}>
                    <Toast ref={(ref) => { Toast.setRef(ref) }} />
                </View>
                <View style={{ alignItems: "center" }}>
                    <View style={{ width: "90%" }}>
                        <Text style={{ marginTop: 20, marginBottom: 10, color: "#3D3D3D", fontFamily: "DM Sans", fontSize: 10 }}>Full Name</Text>
                        <TextInput style={[styles.textinput, { paddingLeft: 10 }]} placeholder='Pooja Saxena' value={name} onChangeText={(value) => setName(value)}></TextInput>
                    </View>
                    <View style={{ width: "90%" }}>
                        <Text style={{ marginTop: 20, marginBottom: 10, color: "#3D3D3D", fontFamily: "DM Sans", fontSize: 10 }}>Email</Text>
                        <TextInput style={[styles.textinput, { paddingLeft: 10 }]} placeholder='pooja.saxena@gmail.com' value={email} onChangeText={(value) => setEmail(value)}></TextInput>
                    </View>
                    <View style={{ width: "90%" }}>
                        <Text style={{ marginTop: 20, marginBottom: 10, color: "#3D3D3D", fontFamily: "DM Sans", fontSize: 10 }}>Phone Number</Text>
                        <TextInput style={[styles.textinput, { paddingLeft: 10 }]} placeholder='Enter a valid phone number' value={userDetails?.phone} editable={false}></TextInput>
                    </View>
                    <View style={{ width: "90%", flexDirection: "row" }}>
                        <View style={{ flex: 9 }}>

                            <Text style={{
                                marginTop: 20, marginBottom: 10, color: "#3D3D3D", fontFamily: "DM Sans", //fontWeight: 500,
                                fontSize: 10
                            }}
                            >Address</Text>
                        </View>
                        <View style={{ marginBottom: 4, marginTop: 10 }}>

                            <Image source={require("./../../assets/img/editIcon.png")} style={{ height: 15, aspectRatio: 1 }} />
                        </View>
                    </View>
                    <View style={{ width: "90%" }}>

                        <Text style={[styles.textinput, { paddingLeft: 10, paddingTop: 10, height: 90, marginBottom: 0 }]} placeholder='5143, Block 4'>{userDetails?.flat_no}, {userDetails?.tower}, Society Details</Text>
                    </View>
                    <View style={{
                        marginBottom: 10, paddingLeft: 10,
                    }}
                        onPress={() => navigation.navigate('SelectSociety', { type: "edit" })}
                    >

                    </View>
                    {/* <View style={{ width: "90%" }}>
                        <Text style={{
                            marginTop: 20, marginBottom: 10, color: "#3D3D3D", fontFamily: "DM Sans", //fontWeight: 500,
                            fontSize: 10
                        }}
                        >Floor</Text>
                        <TextInput style={[styles.textinput, { paddingLeft: 10 }]} placeholder='5143, Block 4' value={userDetails?.floor}></TextInput>
                    </View> */}
                    {/* <View style={{ width: "90%" }}>
                        <Text style={{
                            marginTop: 20, marginBottom: 10, color: "#3D3D3D", fontFamily: "DM Sans", //fontWeight: 500,
                            fontSize: 10
                        }}
                        >Flat No</Text>
                        <TextInput style={[styles.textinput, { paddingLeft: 10 }]} placeholder='5143, Block 4' value={userDetails?.flat_no}></TextInput>
                    </View> */}
                    <View style={{ width: "90%" }}>

                        <TouchableOpacity onPress={() => editProfile()} style={{ marginTop: 15 }}>
                            <View style={[styles.savechanges]}>
                                <Text style={styles.changeinput}>SAVE CHANGES</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaProvider>
    )
}

export default EditAccountDetails

const styles = StyleSheet.create({
    textinput: {
        width: "100%",
        height: 44,
        borderWidth: 1,
        borderColor: "#8F8F8F",
        borderRadius: 4,
        marginBottom: 15,
        // marginLeft: 20
    },
    savechanges: {
        width: "90%",
        height: 42,
        backgroundColor: "#12352F",
        borderRadius: 6,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
        marginLeft: 20

    },
    changeinput: {

        fontFamily: 'DM Sans',
        //fontWeight: 700,
        fontSize: 14,
        color: "#FFD365",


    }
})