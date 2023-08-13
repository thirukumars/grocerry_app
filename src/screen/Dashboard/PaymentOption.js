import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import { useWindowDimensions } from 'react-native';
import Lottie from 'lottie-react-native';


const PaymentOption = () => {
    const navigation = useNavigation()
    const insets = useSafeAreaInsets();
    const [amount, setAmount] = useState(0)
    const [paymentSuccess, setPaymentSuccess] = useState(false)
    async function getCart() {
        try {
            let token = await AsyncStorage.getItem('token')
            const headers = {
                'x-access-token': token,
                // 'content-type': 'multipart/form-data',
            }
            let res = await axios.get("https://hibee-cart.moshimoshi.cloud/cart/", { headers }).then((response) => {
                console.log("RESPONSEEE", response?.data?.data?.afterDiscount, token)
                setAmount(response?.data?.data?.afterDiscount)
            })
        } catch (e) {
            console.log(e)
        }
    }
    useEffect(() => {
        getCart()
    }, [])
    async function placeOrder() {
        try{
        console.log("PLACE ORDER")
        let token = await AsyncStorage.getItem('token')
        const headers = {
            'x-access-token': token,
            // 'content-type': 'multipart/form-data',
        }
        let response = await axios.post('https://hibee-order.moshimoshi.cloud/order/placeorder', {
            "type": "user",
            "paymentDetails": { "mode": "cash", "status": "pending", " amount": 0 }
        }, { headers })
        console.log("REPONNNSEEEE", response)
        if (response?.status == 200) {
            setPaymentSuccess(true)
            setTimeout(async function() {
                await AsyncStorage.setItem('cart', JSON.stringify([]))
                navigation.pop();
                navigation.navigate('Account', { screen: 'Order Details', params: { id: response?.data?.data?._id }, initial: false })
            },2500)
        }
    }catch(e){
        console.log(e?.response?.data)
    }
}
    return (
        <SafeAreaProvider style={{ flex: 1 }}>
            <View style={[styles.topbox, { marginTop: insets.top }]}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image source={require('../../assets/img/leftarrow.png')} style={{ marginLeft: 15, marginTop: 20 }} />
                </TouchableOpacity>
                <Text style={styles.text}>Payment Gateway</Text>
            </View>
            {/* https://hibee-order.moshimoshi.cloud/order/placeorder */}
            <View style={{ backgroundColor: "white", height: "100%", width: "100%", flex: 1 }}>
                {
                    paymentSuccess ?
                        <View style={{ marginTop: 200, marginLeft: "33%" }}>
                            <Lottie source={require('../../assets/img/success.json')}
                                autoPlay loop={false} style={{ marginTop: 0, height: 100, aspectRatio: 1 }} />
                        </View> :
                        <View style={{ width: "100%", height: "100%" }}>
                            <Text style={styles.text1}>Choose a payment method from the following</Text>
                            <View style={styles.cod}
                            >
                                <Image source={require('../../assets/img/rupees.png')} style={{ marginLeft: 15, marginTop: 15 }} />
                                <Text style={styles.codtext}>Cash on delivery</Text>
                                <TouchableOpacity>
                                    <Image source={require("../../assets/img/radioon.png")} style={{
                                        width: 20,
                                        height: 20,
                                        marginLeft: 80,
                                        marginTop: 15
                                    }} />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.footerbox}>
                                <TouchableOpacity onPress={() => placeOrder()}>
                                    <Text style={styles.footertext}>FINISH YOUR ORDER</Text>
                                </TouchableOpacity>
                            </View>
                        </View>}
            </View>
        </SafeAreaProvider>
    )
}

export default PaymentOption

const styles = StyleSheet.create({

    topbox: {
        width: 400,
        height: 52,
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: 'white',
        borderWidth: 0.2,
    },
    text: {

        height: 34,
        fontFamily: 'DM Sans',
        //fontWeight: 500,
        fontSize: 16,
        marginTop: 15,
        color: 'black',
        marginLeft: 30,


    },
    footerbox: {
        width: "90%",
        height: 42,
        background: "#12352F",
        borderRadius: 6,
        borderWidth: 0.5,
        position: "absolute",
        bottom: 20,
        // marginTop: "90%",
        marginLeft: "5%",
        marginRight: 25,
        backgroundColor: "black",
        alignItems: "center",
        justifyContent: "center"
    },
    footertext: {
        height: 34,
        fontFamily: 'DM Sans',
        //fontWeight: 700,
        fontSize: 14,
        marginTop: 15,
        color: '#FFD365',

    },
    text1: {
        height: 34,
        fontFamily: 'DM Sans',
        //fontWeight: 400,
        fontSize: 14,
        marginTop: 15,
        color: '#666666',
        marginLeft: 30,
    }, cod: {
        width: 312,
        height: 53,

        background: '#FFFFFF',
        boxShadow: 'rgba(0, 0, 0, 0.25)',
        borderRadius: 6,
        borderWidth: 0.3,
        marginLeft: 50,
        marginTop: 15,
        display: "flex",
        flexDirection: "row",
    },
    codtext: {
        height: 34,
        fontFamily: 'DM Sans',
        //fontWeight: 400,
        fontSize: 14,
        marginTop: 15,
        color: 'black',
        marginLeft: 30,

    }


})
