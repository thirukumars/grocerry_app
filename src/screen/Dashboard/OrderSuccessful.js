import React, { useEffect } from 'react'
import { View, Text, Touchable, TouchableOpacity, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useWindowDimensions } from 'react-native';
import Lottie from 'lottie-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRef } from 'react';

function OrderSuccessful() {
    const ref = useRef()
    useEffect(() => {
        setTimeout(() => {
            ref?.current?.play();
        }, 2000)
    }, [])
    async function placeOrder() {
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

            setTimeout(() => {
                AsyncStorage.setItem('cart', JSON.stringify([]))
                navigation.pop();
                navigation.navigate('Account', { screen: 'Order Details', params: { id: response?.data?.data?._id } }, 2000)
                // navigation.navigate("Order Success")
            })
        }
    }
    const navigation = useNavigation()

    return (
        <View>

            <View style={{ backgroundColor: "#FFFFFF", display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%', flexDirection: 'column', }}>
                <Text style={{ marginTop: 100, marginBottom: 100 }}>ORDERED SUCCESSFULLY!</Text>
                <View>
                    <TouchableOpacity onPress={() => placeOrder()}>
                        <View style={styles.blackbtn}>
                            <Text style={styles.blacktext}>SHOW ORDERS</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    blacktext: {
        height: 18,
        fontFamily: 'DM Sans',
        //fontWeight: 700,
        fontSize: 14,
        color: '#FEBF22',
        marginTop: 10,
        marginLeft: 110
    },
    linebottom: {
        width: 106,
        height: 0,
        borderColor: '#707070',
        borderWidth: 2,
        borderRadius: 20,
        // marginLeft: 10,
        // marginTop: 20,
        marginTop: 10,
        marginBottom: 10

    },
    blackbtn: {
        width: 320,
        height: 42,
        backgroundColor: '#12352F',
        borderRadius: 10,
        marginTop: 100,
        marginLeft: 12,
        marginBottom: 15
    },
})

export default OrderSuccessful
