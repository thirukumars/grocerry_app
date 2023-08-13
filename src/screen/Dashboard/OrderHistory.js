import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Image, Button, ScrollView, FlatList } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

function OrderHistory({ _id, route }) {
    const insets = useSafeAreaInsets();
    const [orders, setOrders] = useState([])
    const navigation = useNavigation()
    const showOrders = async () => {
        try {
            let token = await AsyncStorage.getItem('token')
            const headers = {
                'x-access-token': token,
                // 'content-type': 'multipart/form-data',
            }
            let res = await axios.get("https://hibee-order.moshimoshi.cloud/order", { headers }).then((response) => {
                console.log("RESPONSEEE", response?.data?.data, token)

                setOrders(response?.data?.data)

            })
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        showOrders()
    }, [])

    return (
        <SafeAreaProvider style={{ backgroundColor: 'white', width: "100%" }}>
            {/* <View style={styles.line}></View> */}
            <View style={{ marginTop: insets.top }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', height: 52, backgroundColor: "#FFFFFF", shadowColor: '#171717', shadowOffset: { width: -2, height: 4 }, shadowOpacity: 0.2, }}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Image source={require('../../assets/img/leftarrow.png')} style={{ marginLeft: 20, marginTop: 15 }} />
                    </TouchableOpacity>
                    <Text style={styles.vegtext}>Order History</Text>
                </View>
                <FlatList
                    data={orders}
                    style={{ marginTop: 24 }}
                    renderItem={({ item }) => {
                        return <View style={styles.box}>

                            <TouchableOpacity onPress={() => navigation.navigate('Account', { screen: 'Order Details', params: { id: item?._id } })}>
                                <View style={styles.innerbox}>

                                    <Image source={require('../../assets/img/orderdetails.png')} style={{ marginLeft: 10, marginTop: 10 }} />
                                    <View>
                                        <Text style={styles.orderno}>ORD{item?._id}</Text>
                                        <Text style={styles.orderno1}>Total Amount - ₹{item?.payment?.amount}</Text>
                                    </View>
                                </View>

                                <View style={styles.mainbox}>
                                    <View style={{ borderBottomWidth: 0.2, borderColor: "gray", justifyContent: "center", height: 40 }}>
                                        <Text style={styles.uls}>View Details </Text>
                                        <Text style={styles.item}>{item?.products?.length} items</Text>
                                    </View>
                                    <Text style={styles.date}>Placed on {new Date(item?.payment?.createdAt).toLocaleString()}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    }}
                    keyExtractor={item => item.id}
                />
            </View>
        </SafeAreaProvider>
    )
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        padding: 16,
    },
    dropdown: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
    },
    icon: {
        marginRight: 5,
    },
    label: {
        position: 'absolute',
        backgroundColor: 'white',
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
    monthtext: {

        fontFamily: 'DM Sans',
        //fontWeight: 400,
        fontSize: 12,
        /* or 18px */
        color: '#000000',
        marginTop: -15,
        marginLeft: 25,
    },
    line: {
        width: "100%",
        height: 1,
        backgroundColor: '#A3A3A3',
        marginTop: 30
    }
    , box: {
        width: '90%',
        height: 200,
        backgroundColor: 'white',
        alignSelf: "center"
    }, innerbox: {
        width: "100%",
        height: 72,
        borderColor: 'grey',
        borderWidth: 0.4,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        display: 'flex',
        flexDirection: 'row',
        marginTop: 10,
        backgroundColor: '#FBFBFB'
    },
    orderno: {
        fontFamily: 'DM Sans',
        height: 18,
        //fontWeight: 700,
        fontSize: 14,
        /* or 18px */
        color: '#000000',
        marginTop: 15,
        marginLeft: 25,
    },
    orderno1: {
        fontFamily: 'DM Sans',
        height: 18,
        //fontWeight: 500,
        fontSize: 12,
        /* or 18px */
        color: '#525252',
        marginTop: 5,
        marginLeft: 25,
    },
    mainbox: {
        width: "100%",
        height: 102,
        borderColor: 'grey',
        borderWidth: 0.4,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        // display: 'flex',
        // flexDirection: 'row',

    },
    uls: {
        fontFamily: 'DM Sans',
        //fontWeight: 700,
        textDecorationLine: 'underline'
        , fontSize: 12,
        /* or 18px */
        color: '#3C5F58',
        // marginTop: 25,
        marginRight: 5,
        position: "absolute",
        right: 4,
        marginTop: 12
    },
    item: {
        fontFamily: 'DM Sans',
        height: 18,
        //fontWeight: 500,
        fontSize: 12,
        /* or 18px */
        color: '#525252',
        marginTop: 12,
        marginLeft: 15,
    },
    date: {
        fontFamily: 'DM Sans',
        height: 18,
        //fontWeight: 500,
        fontSize: 12,
        /* or 18px */
        color: '#8F8F8F',
        marginTop: 15,
        marginLeft: 15,
        // position:"absolute",
        // right:0
    }, linebottom: {
        width: 106,
        height: 0,
        borderColor: '#707070',
        borderWidth: 2,
        borderRadius: 20,
        marginLeft: 140,
        marginTop: 75,
        marginBottom: 10
    },
    vegtext: {
        height: 18,
        fontFamily: 'DM Sans',
        //fontWeight: 600,
        fontSize: 14,
        color: '#3C5F58',
        marginTop: 16,
        marginLeft: 15
    },
});

export default OrderHistory
