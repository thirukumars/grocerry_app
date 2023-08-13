import React, { useState, useEffect } from 'react'
import { ScrollView, StyleSheet, View, Image, Text, TouchableOpacity } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Lottie from 'lottie-react-native';
import { useRef } from 'react';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

function OrderDetailsPro({ route }) {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation()
    // const ref = useRef()
    // useEffect(() => {
    //     setTimeout(() => {
    //         ref?.current?.play();
    //     }, 2000)
    // }, [])

    const [items, setItems] = useState([{}])
    const [order, setOrder] = useState({})
    console.log("PARAMS--->", route.params)
    const showOrders = async () => {
        try {
            let token = await AsyncStorage.getItem('token')
            const headers = {
                'x-access-token': token,
                // 'content-type': 'multipart/form-data',
            }
            let res = await axios.get(`https://hibee-order.moshimoshi.cloud/order/${route.params.id}`, { headers }).then((response) => {
                console.log("RESPONSEEE", response?.data?.data?.status)
                setItems(response?.data?.data?.products)
                setOrder(response?.data?.data)
            })
        } catch (e) {
            console.log(e)
        }
    }
    useEffect(() => {
        showOrders()
    }, [])

    return (
        <SafeAreaProvider style={{ backgroundColor: "white" }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', height: 52, backgroundColor: "#FFFFFF", shadowColor: '#171717', shadowOffset: { width: -2, height: 4 }, shadowOpacity: 0.2, marginTop: insets.top }}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image source={require('../../assets/img/leftarrow.png')} style={{ marginLeft: 20, marginTop: 15 }} />
                </TouchableOpacity>
                <Text style={styles.vegtext}>Order Details</Text>
            </View>
            <ScrollView>
                <View style={styles.midbox}>
                    {/* <View style={styles.yelbox}> */}
                    {order?.status !== "processing" ?

                        <View style={{ backgroundColor: 'green', width: "100%", height: 32 }}>
                            <Image source={require('../../assets/img/orderdelivered.png')} style={{ width: "100%", height: "100%", resizeMode: "stretch" }} />
                        </View> :
                        <>
                            <View style={styles.yelbox}>

                                {/* <View style={{ height: "100%", width: 50, position: "absolute", right: 0 }}> */}
                                <Image source={require('../../assets/img/hexorder.png')} style={{ height: "100%", width: "100%", position: "absolute", right: 0 }} />
                                {/* </View> */}
                                <View>

                                    <Text style={{ fontSize: 18, color: "#63542C", marginTop: 24, width: 180, marginLeft: 24 }}>
                                        The bee hive is working to get your order to you
                                    </Text>
                                    <Text style={{ fontSize: 12, color: "#6B6B6B", marginTop: 12, width: 200, marginLeft: 24 }}>
                                        Your items will soon reach you
                                    </Text>
                                </View>
                            </View>
                        </>
                    }
                    {/* <Image source={require('../../assets/img/orderdelivered.png')} style={{ width: "100%", height: "100%", resizeMode: "stretch" }} /> */}
                    <View>
                        {/* <Text style={styles.savetext}>₹{order?.totalSavings} savings</Text> */}
                        {/* <Text style={styles.savetext1}>Save ₹13 by adding ₹150 to cart </Text> */}
                        {/* <Text style={styles.savetext2}>Continue shopping </Text> */}
                        {/* </View> */}
                        <View>
                        </View>
                    </View>
                    <View style={{ display: 'flex', flexDirection: 'row' }}>
                        <Image source={require('../../assets/img/baskin.png')} style={{ marginLeft: 15, marginTop: 15, height: 19, width: 19 }} />
                        <Text style={styles.reviewtext}>{items?.length} items in this order</Text>
                    </View>

                    {items?.map((item, i) => {
                        return <View style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', flex: 1, width: "100%" }} key={i}>
                            <Image source={{ uri: Array.isArray(item?.image) ? item.image[0]?.image : item.image }} style={{ marginTop: 20, marginLeft: 10, width: 20, height: 20 }} />
                            <View>
                                <Text style={styles.freshtext}>{item?.product_name}</Text>
                                <Text style={styles.freshtext1}>{item?.qty}
                                </Text>
                            </View>
                            <View style={{ position: "absolute", right: 30 }}>
                                <Text style={styles.twenty}>₹{item?.discountedPrice}</Text>
                            </View>
                        </View>
                    })}
                </View>

                <View style={styles.bill}>
                    {/* {items.map((item, i) => {
                    return <>
                        <View style={{ display: 'flex', flexDirection: 'row', }}>
                            <Text style={styles.greytext}>Items total (incl, taxes)
                            </Text>

                            <Text style={[styles.greytext, {position: "absolute", right: 20 }]}>₹{item?.amount}</Text>
                        </View>
                    </>


                })} */}
                    <View style={{ flexDirection: "column", marginTop: 25, width: "100%" }}>
                        <Text style={[styles.greytext1, { alignSelf: "flex-start", }]}>Bill Total</Text>
                        <Text style={[styles.greytext1, { alignSelf: "flex-end", marginTop: -20, marginRight: 20 }]}>₹{order?.payment?.amount}</Text>
                    </View>

                </View>


                <View style={styles.bill1}>

                    {
                        <View style={{
                            flex: 1,
                            flexDirection: 'column',
                        }}>
                            <Text style={styles.bigtext}>Order details</Text>

                            <View>
                                <Text style={styles.innertextbox}>Order id
                                </Text>
                                <Text style={styles.innertextbox2}>#ORD{order?._id}
                                </Text>
                            </View>
                            <View style={{ marginTop: -15 }}>
                                <Text style={styles.innertextbox}>Order status
                                </Text>
                                <Text style={[styles.innertextbox2, { textTransform: 'capitalize' }]}> {order?.status}</Text>
                            </View>


                            <View style={{ marginTop: -15 }}>
                                <Text style={styles.innertextbox}>Payment
                                </Text>
                                <Text style={styles.innertextbox2}>Cash on Delivery</Text>
                            </View>

                            <View style={{ marginTop: -15 }}>
                                <Text style={styles.innertextbox}>Delivery address
                                </Text>
                                <Text style={styles.innertextbox2}>Prestige Layout, Kersar Nagar, New Delhi, 89776
                                </Text>
                            </View>
                            <View style={{ marginTop: -15 }}>
                                <Text style={styles.innertextbox}>Order placed
                                </Text>
                                <Text style={styles.innertextbox2}>{new Date(order?.createdAt).toLocaleString()}

                                </Text>
                            </View>
                            <View style={{ marginTop: -15 }}>
                                <Text style={styles.innertextbox}>Download summary
                                </Text>
                                <TouchableOpacity>
                                    <Text style={[styles.innertextbox2, { textDecorationLine: 'underline' }]}>Click here to download
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    }


                </View>

            </ScrollView >
        </SafeAreaProvider>
    )
}



const styles = StyleSheet.create({


    midbox: {
        width: 400,
        backgroundColor: 'white',
        marginTop: 5,
        display: 'flex',
        flexDirection: 'column'
    },
    reviewtext: {
        height: 18,
        fontFamily: 'DM Sans',
        //fontWeight: 700,
        fontSize: 14,
        /* or 18px */
        color: '#3C5F58',
        marginTop: 15,
        marginLeft: 25,
    },
    freshtext: {
        height: 26,
        fontFamily: 'DM Sans',
        //fontWeight: 500,
        fontSize: 10,
        /* or 18px */
        color: '#12352F',
        marginTop: 20,
        marginLeft: 25,
    },
    freshtext1: {
        height: 13,
        fontFamily: 'DM Sans',
        //fontWeight: 500,
        fontSize: 10,
        /* or 18px */
        color: '#999999',
        marginTop: -10,
        marginLeft: 25,
    },
    addbox: {
        width: 65,
        height: 30,
        borderWidth: 0.8,
        borderRadius: 4,
        borderColor: '#8F8F8F',
        marginLeft: 100,
        marginTop: 20,
        display: 'flex',
        flexDirection: 'row'

    },
    twenty: {
        height: 32,
        fontFamily: 'DM Sans',
        //fontWeight: 500,
        fontSize: 12,

        color: '#12352F',
        marginTop: 20,
        marginLeft: 15,

    },
    twentytwo: {
        height: 26,
        fontFamily: 'DM Sans',
        //fontWeight: 500,
        fontSize: 10,

        color: '#999999',
        marginTop: -15,
        marginLeft: 27,
        textDecorationLine: 'line-through',
        textDecorationStyle: 'solid'
    },
    lowerbox: {
        width: 400,
        height: 230,
        backgroundColor: 'white',
        marginTop: 5,
        display: 'flex',
        flexDirection: 'column'
    },
    bill: {
        width: "100%",
        backgroundColor: 'white'
    },
    greytext: {
        height: 20,
        fontFamily: 'DM Sans',
        //fontWeight: 500,
        fontSize: 14,
        /* or 18px */
        color: '#999999',
        marginLeft: 10

    },
    greytext1: {
        height: 21,
        fontFamily: 'DM Sans',
        //fontWeight: 700,
        fontSize: 14,
        color: '#12352F',
        marginLeft: 10

    },
    bill1: {

        width: 400,
        backgroundColor: 'white',
        marginTop: 7,
        shadowColor: 'black',
        elevation: 5
    },
    bigtext: {
        height: 21,
        fontFamily: 'DM Sans',
        //fontWeight: 700,
        fontSize: 15,
        color: '#12352F',
        marginLeft: 20,
        marginTop: 20

    },
    innertextbox: {
        height: 36,
        fontFamily: 'DM Sans',
        //fontWeight: 500,
        fontSize: 14,
        color: '#999999',
        marginLeft: 20,
        marginTop: 10,
    },
    innertextbox2: {
        height: 32,
        fontFamily: 'DM Sans',
        //fontWeight: 500,
        fontSize: 12,

        color: '#12352F',
        marginLeft: 20,
        marginTop: -10,
    },
    footer: {
        width: 400,
        height: 100,
        backgroundColor: 'white',
        shadowColor: 'black',
        elevation: 3,
        marginTop: 10,
        marginBottom: 10,
        display: 'flex',
        flexDirection: 'row'
    }
    ,
    chattext: {
        height: 21,
        fontFamily: 'DM Sans',
        //fontWeight: 500,
        fontSize: 14,

        color: '#12352F',
        marginLeft: 20,
        marginTop: 20

    },
    chattext2: {
        height: 13,
        fontFamily: 'DM Sans',
        //fontWeight: 600,
        fontSize: 10,

        color: '#999999',
        marginLeft: 20,
        marginTop: 0
    },
    linebottom: {
        width: 106,
        height: 0,
        borderColor: '#707070',
        borderWidth: 2,
        borderRadius: 20,
        marginLeft: 140,
        marginTop: 15,
        marginBottom: 10
    },
    yelbox: {
        width: "100%",
        height: 142,
        backgroundColor: '#FEF9EC',
        borderRadius: 6,
        display: "flex",
        flexDirection: 'row',
        marginTop: 0

    },
    savetext: {
        height: 26,
        fontFamily: 'DM Sans',
        //fontWeight: 700,
        fontSize: 14,
        /* or 18px */
        color: '#12352F',
        marginTop: 10,
        marginLeft: 25
    },
    savetext1: {
        height: 26,
        fontFamily: 'DM Sans',

        fontSize: 10,
        /* or 18px */
        color: '#12352F',
        marginLeft: 25
    },
    savetext2: {
        height: 26,
        fontFamily: 'DM Sans',
        //fontWeight: 700,
        fontSize: 10,
        /* or 18px */
        color: '#12352F',
        marginLeft: 25,
        textDecorationLine: 'underline',
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

})
export default OrderDetailsPro
