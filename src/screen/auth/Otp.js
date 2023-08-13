import { View, Text, StyleSheet, TouchableOpacity, Alert, Image, SafeAreaView, KeyboardAvoidingView, Platform, Pressable } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { TextInput } from 'react-native-gesture-handler'
import axios from 'axios'
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { CommonActions } from '@react-navigation/native';

const Otp = ({ navigation, route }) => {
    const et1 = useRef()
    const et2 = useRef()
    const et3 = useRef()
    const et4 = useRef()
    const [f1, setf1] = useState('')
    const [f2, setf2] = useState('')
    const [f3, setf3] = useState('')
    const [f4, setf4] = useState('')
    const [count, setCount] = useState(0)
    const [OTP, setOTP] = useState(0)
    const insets = useSafeAreaInsets();
    useEffect(() => {
        getOTP()
    }, [route.params?.phone]);

    async function getOTP() {
        if (count == 0) {
            setCount(60)
            console.log("PHONE", route.params?.phone)
            let result = await axios.put('https://hybee-auth.moshimoshi.cloud/send-otp?type=login&phone=' + route.params?.phone)
            console.log(result?.data)

            // setOTP(result.data.data)
            setTimeout(() => {
                if (result?.data?.otp) {
                    Toast.show({
                        // type: 'Success',
                        text1: 'OTP',
                        text2: `${result?.data?.otp}`
                    })
                }
            }, 1000)
        }
    }

    async function verifyOTP(enteredOTP) {
        try {
            console.log("PHONE", route.params?.phone)
            console.log('https://hybee-auth.moshimoshi.cloud/verify-otp?otp=' + enteredOTP + '&phone=' + route.params?.phone + '&type=login')
            let result = await axios.put('https://hybee-auth.moshimoshi.cloud/verify-otp?otp=' + enteredOTP + '&phone=' + route.params?.phone + '&type=login')
            if (result?.data?.error == false) {
                console.log("HITTING")
                // console.log("SUCCESS", result.headers['x-access-token'])
                await AsyncStorage.setItem('token', result.headers['x-access-token'])
                await AsyncStorage.setItem('refresh', result.headers['x-refresh-token'])
                // await AsyncStorage.setItem('phone', route.params?.phone)/
                // await AsyncStorage.setItem('name', result?.data?.data?.name)
                // await AsyncStorage.setItem('email', result?.     
                console.log("user data", result?.data?.data)
                if (!result.data.data?.society_id?.length) {
                    navigation.replace("SelectSociety")
                }
                else {
                    console.log("SETTING SOCIETY", result.data.data.society_id)
                    await AsyncStorage.setItem("society", result.data.data.society_id)
                    if (!result.data.data.tower) {
                        navigation.replace("FlatNumber")
                    }
                    else if (result?.data?.data?.name == "" || result?.data?.data?.email == "") {
                        console.log("DETAILSSS")
                        navigation.replace("DetailsPage")
                    }
                    else {
                        navigation.dispatch(
                            CommonActions.reset({
                                index: 0,
                                routes: [{ name: 'TabHomeBottom' }],
                            })
                        );
                    }
                }
            }
            else {
                setTimeout(() => {
                    if (result?.data?.error) {
                        Toast.show({
                            type: 'error',
                            // text1: 'OTP',
                            text2: `Wrong OTP`
                        })
                    }
                }, 1000)
            }
            // setOTP(result.data.data)

        } catch (e) {
            console.log("ERROR", e)
            if (e?.response?.status == 500) {
                console.log(e?.response?.status, "EROROR")
                setTimeout(() => {
                    // if (result?.data?.error) {
                    Toast.show({
                        type: 'error',
                        text2: "Invalid OTP"
                    })
                    // }
                }, 1000)
            }
            else if (e?.response?.status == 400) {
                setTimeout(() => {
                    // if (result?.data?.error) {
                    Toast.show({
                        type: 'error',
                        text2: "User does not exist with this number"
                    })
                    // }
                }, 1000)
            }
        }
    }
    useEffect(() => {
        const interval = setInterval(() => {
            if (count == 0) {
                clearInterval(interval)
            } else {
                setCount(count - 1)
            }

        }, 1000)
        return () => {
            clearInterval(interval)
        }
    }, [count])

    const otpValidate = () => {
        // let otp = '1234'
        let enteredOtp = f1 + f2 + f3 + f4
        verifyOTP(enteredOtp)
        // if (enteredOtp == otp) {
        //     navigation.navigate("SelectSociety")

        // } else {
        //     Alert.alert("wrong OTP")
        // }
    }
    const keyboardVerticalOffset = Platform.OS === 'ios' ? 100 : 0

    const handleSubmit = () => {
        if (otpValidate()) {
            navigation.replace("SelectSociety")
        }
    }
    return (
        <SafeAreaProvider>
            <KeyboardAwareScrollView>
                <View style={[styles.container, { marginTop: insets.top }]}>
                    {/* <KeyboardAvoidingView
                    behavior='position' keyboardVerticalOffset={keyboardVerticalOffset}
                > */}
                    <View style={styles.canvasContainer}>
                        <Image
                            resizeMode="cover"
                            source={require('../../assets/img/loginImg.jpg')}
                            style={styles.canvas}
                        />
                    </View>
                    <Toast ref={(ref) => { Toast.setRef(ref) }} />
                    <Text style={[styles.heading, { marginTop: 40 }]}>Fresh groceries at</Text>
                    <Text style={styles.heading}>your doorstep.</Text>
                    {/* <Text style={styles.title}> OTP Verification</Text> */}
                    <Text style={{ color: "#3C5F58", fontWeight: '500', marginTop: 30, fontSize: 14, marginLeft: 20, alignSelf: "center" }}>Enter OTP</Text>

                    <View style={[styles.otpView, { marginTop: 10 }]}>

                        <TextInput ref={et1} style={[styles.inputView, { borderColor: f1.length >= 1 ? 'blue' : '#8F8F8F' }]}
                            keyboardType='number-pad'
                            maxLength={1}
                            value={f1}
                            onChangeText={txt => {
                                let updatedtext = txt.replace(/[^0-9]/g, '')
                                setf1(updatedtext)
                                if (updatedtext.length >= 1) {
                                    et2.current.focus()
                                }
                            }} />
                        <TextInput ref={et2} style={[styles.inputView, { borderColor: f2.length >= 1 ? 'blue' : '#8F8F8F' }]} keyboardType='number-pad'
                            maxLength={1}
                            value={f2}
                            onChangeText={txt => {
                                let updatedtext = txt.replace(/[^0-9]/g, '')
                                setf2(updatedtext)
                                if (updatedtext.length >= 1) {
                                    et3.current.focus()
                                } else if (updatedtext.length < 1) {
                                    et1.current.focus()
                                }
                            }} />
                        <TextInput ref={et3} style={[styles.inputView, { borderColor: f3.length >= 1 ? 'blue' : '#8F8F8F' }]} keyboardType='number-pad'
                            maxLength={1}
                            value={f3}
                            onChangeText={txt => {
                                let updatedtext = txt.replace(/[^0-9]/g, '')
                                setf3(updatedtext)
                                if (updatedtext.length >= 1) {
                                    et4.current.focus()
                                } else if (updatedtext.length < 1) {
                                    et2.current.focus()
                                }
                            }} />
                        <TextInput ref={et4} style={[styles.inputView, { borderColor: f4.length >= 1 ? 'blue' : '#8F8F8F' }]} keyboardType='number-pad'
                            maxLength={1}
                            value={f4}
                            onChangeText={txt => {
                                let updatedtext = txt.replace(/[^0-9]/g, '')
                                setf4(updatedtext)
                                if (updatedtext.length >= 1) {
                                    et4.current.focus()
                                } else if (updatedtext.length < 1) {
                                    et3.current.focus()
                                }
                            }}
                        />

                    </View>
                    {/* <TouchableOpacity style={styles.resendview} disabled={count !== 0} onPress={async () => {
                        setCount(60)
                        await getOTP()
                    }}>
                        <Text style={{
                            fontSize: 20, //fontWeight: '500',
                            color: count == 0 ? 'black' : 'gray'
                        }}
                        >Resend</Text>
                        {count !== 0 && <Text style={{ marginLeft: 20, fontSize: 20 }}>{count + ' seconds'}</Text>
                        }
                    </TouchableOpacity> */}
                    <View style={{ flexDirection: "row", justifyContent: "center", width: "100%", marginTop: 10 }}>
                        <Text style={{ color: "#3C5F58", fontWeight: '500', marginTop: 0, fontSize: 10, }}>Didn't receive the OTP?</Text>
                        <Pressable onPress={async () => {
                            await getOTP();
                        }}>
                            <Text style={{ color: count === 0 ? "#F3AE00" : "#8F8F8F", fontWeight: '700', marginTop: 0, fontSize: 10, marginLeft: 4, alignSelf: "center", textDecorationLine: count === 0 ? "underline" : null }}>Resend</Text>
                        </Pressable>
                        {count !== 0 && <Text style={{ marginLeft: 4, fontSize: 10, alignSelf: "center" }}>{count + ' seconds'}</Text>}
                    </View>

                    <TouchableOpacity
                        disabled={
                            f1 !== '' && f2 !== '' && f3 !== '' && f4 !== ''
                                ? false : true
                        }
                        style={[styles.verifyOtp, { backgroundColor: f1 !== '' && f2 !== '' && f3 !== '' && f4 !== '' ? '#FEBF22' : '#D4C6A0' }]}
                        onPress={handleSubmit}
                    >
                        <Text style={{ fontSize: 14, fontWeight: 500, color: '#12352F' }}>Verify</Text>

                    </TouchableOpacity>
                    <View style={{ marginTop: 60, }}>

                        <TouchableOpacity onPress={() => navigation.navigate("About us")} style={{}}>
                            <Text style={styles.bottomText}>
                                Cookie policy | Terms & Conditions
                            </Text>

                        </TouchableOpacity>
                    </View>
                    {/* </KeyboardAvoidingView> */}
                </View>
            </KeyboardAwareScrollView>
        </SafeAreaProvider>
    )
}

export default Otp

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: "100%",
    },
    title: {
        fontSize: 22,
        //fontWeight: '700',
        marginTop: 50,
        alignSelf: "center",
        color: "black"

    },
    otpView: {
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: 'row',
        marginTop: 50

    },
    inputView: {
        width: 40,
        height: 40,
        borderWidth: 0.5,
        borderRadius: 10,
        marginLeft: 10,
        textAlign: "center",
        fontSize: 18,
        //fontWeight: '700'
    },
    verifyOtp: {
        width: "90%",
        height: 40,
        backgroundColor: "black",
        borderRadius: 10,
        alignSelf: "center",
        marginTop: 10,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 24
    },
    resendview: {
        flexDirection: 'row',
        alignSelf: 'center',
        marginTop: 30,
        marginBottom: 30
    },
    canvasContainer: {
        width: '100%',
    },

    canvas: {
        width: '100%',
        height: undefined,
        aspectRatio: 1,
        marginTop: -76
    },
    heading: {
        color: '#12352F',
        fontSize: 32,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    bottomText: {
        color: '#8F8F8F',
        fontSize: 12,
        textAlign: 'center',
    },
})