import React, { useState, useEffect } from 'react'
import { View, Text, Image, StatusBar, StyleSheet } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useNavigationm, useIsFocused } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import axios from 'axios'
import CustomeButton1 from '../../components/CustomeButton1'
const MyAccount = ({ navigation }) => {
    // const navigation = useNavigation()
    const insets = useSafeAreaInsets();
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [userLoggedIn, setUserLoggedIn] = useState(false)
    const isFocused = useIsFocused();
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            AsyncStorage.getItem('token').then(value => {
                if (value.length > 0) {
                    setUserLoggedIn(true)
                }
                else {
                    setUserLoggedIn(false)
                }
            })
        });

        return unsubscribe;
    }, [isFocused, navigation]);
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
    async function logout() {
        // await AsyncStorage.removeItem('token')
        await AsyncStorage.clear()
        navigation.navigate('Splash')
    }
    return (
        <SafeAreaProvider>
            {
                userLoggedIn ?
                    <>

                        <StatusBar barStyle="dark-content" backgroundColor='white' />
                        <View style={{ height: 50, width: "100%", backgroundColor: 'white', marginTop: insets.top }}>
                        </View>
                        <View style={{ display: 'flex', flexDirection: 'row', width: 400, height: 80, backgroundColor: 'white', borderBottomColor: '#000000', borderBottomWidth: 1.5 }}>
                            <View>
                                <Text style={styles.bigtext}>{name}</Text>
                                <Text style={styles.greytext}>+91-{phone}</Text>
                                <Text style={styles.greytext}>{email} </Text>
                            </View>
                        </View>
                        <TouchableOpacity
                            onPress={() =>
                                navigation.navigate("My Account Page")
                            }
                        >
                            <View style={styles.container}>

                                <View style={{ flexDirection: 'row', width: "100%", backgroundColor: "white" }}>

                                    <View>
                                        <Text style={styles.account}>My Account</Text>
                                        <Text style={styles.settings}>Account Details</Text>
                                    </View>

                                    <Image source={require('../../assets/img/LabelRight.png')} style={{ position: "absolute", right: 6, marginTop: 40, width: 7, height: 8 }} />
                                </View>

                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => navigation.navigate("OrderHistory")}>
                            <View style={styles.container}>
                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                    <View>
                                        <Text style={styles.account}>Order History</Text>
                                        <Text style={styles.settings}>Orders</Text>
                                    </View>
                                    <Image source={require('../../assets/img/LabelRight.png')} style={{ position: "absolute", right: 6, marginTop: 40, width: 7, height: 8 }} />
                                </View>

                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <View style={styles.container}>

                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                    <View>
                                        <Text style={styles.account}>Payments & Refunds</Text>
                                        <Text style={styles.settings}>Refund Status & Payment Modes</Text>
                                    </View>
                                    <Image source={require('../../assets/img/LabelRight.png')} style={{ position: "absolute", right: 6, marginTop: 40, width: 7, height: 8 }} />
                                </View>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate("Help & Support")}>
                            <View style={styles.container}>

                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                    <View>
                                        <Text style={styles.account}>Help</Text>
                                        <Text style={styles.settings}>FAQs & Links</Text>
                                    </View>
                                    <Image source={require('../../assets/img/LabelRight.png')} style={{ position: "absolute", right: 6, marginTop: 40, width: 7, height: 8 }} />
                                </View>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => logout()}>
                            <View style={styles.container}>

                                <View style={{ flex: 1, flexDirection: 'row' }}>


                                    <View style={{justifyContent:'center'}}>
                                        <Text style={[styles.account, { marginTop: 0, }]}>Logout</Text>
                                        {/* <Text style={styles.settings}>FAQs & Links</Text> */}
                                    </View>
                                    <Image source={require('../../assets/img/LabelRight.png')} style={{ position: "absolute", right: 6, marginTop: 40, width: 7, height: 8 }} />
                                    {/* <TouchableOpacity>
                            <Image source={require('../../assets/img/downarrow.png')} style={{ marginLeft: 280, marginTop: 40 }} />
                        </TouchableOpacity> */}
                                </View>
                            </View>
                        </TouchableOpacity>
                    </> :
                    <View style={{ justifyContent: "flex-start", width: "100%", height: "100%" }}>
                        <Text style={{ alignSelf: "center", marginTop: 150, color: "#3C5F58" }}>
                            You aren't logged in yet
                        </Text>
                        <CustomeButton1
                            title="Login"
                            btnStyle={{ backgroundColor: "#FEBF22", width: "90%", alignSelf: "center" }}
                            // disabled={phone.length == 10 ? false : true}
                            navigationPath={() => { navigation.navigate('LoginScreen') }}
                        />
                    </View>}
        </SafeAreaProvider>

    )
}
const styles = StyleSheet.create({
    bigtext: {
        height: 18,
        fontFamily: 'DM Sans',
        //fontWeight: 700,
        fontSize: 14,
        /* or 18px */
        color: '#12352F',
        marginLeft: 15,
        marginTop: 10
    },
    greytext: {
        height: 13,
        fontFamily: 'DM Sans',
        //fontWeight: 700,
        fontSize: 10,
        /* or 18px */
        color: '#3C5F58',
        marginLeft: 15,
        marginTop: 8
    },
    container: {
        width: "100%",
        height: 90,
        backgroundColor: 'white',
        borderBottomColor: 'rgba(0, 0, 0, 0.1)',
        borderBottomWidth: 1
    },
    account: {
        // height: 18,
        fontFamily: 'DM Sans',
        //fontWeight: 700,
        fontSize: 14,
        /* or 18px */
        color: '#12352F',
        marginLeft: 15,
        marginTop: 25
    },
    settings: {
        // height: 13,
        fontFamily: 'DM Sans',
        //fontWeight: 400,
        fontSize: 12,
        /* or 18px */
        color: '#3C5F58',
        marginLeft: 15,
        marginTop: 4
    },
    linebottom: {
        width: 106,
        height: 0,
        borderColor: '#707070',
        borderWidth: 2,
        borderRadius: 20,
        marginLeft: 140,
        marginTop: 194,
        marginBottom: 10
    }
})
export default MyAccount
