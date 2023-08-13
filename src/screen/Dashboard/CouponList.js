import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Pressable, Image, Text, Alert, TouchableHighlight, TouchableOpacity, ScrollView, ImageBackground, Button, Dimensions, FlatList } from 'react-native'
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CouponList = ({ route }) => {
    const insets = useSafeAreaInsets();
    const [offers, setOffers] = useState([])
    const navigation = useNavigation()
    // const [active, setActive] = useState(false)
    const [cartId, setCartId] = useState(route.params.cartId)
    const [offer, setOffer] = useState([])
    const [selectedOffer, setSelectedOffer] = useState(null)
    console.log("route params", route.params)
    // const [couponId, setCouponId] = useState(route.params.couponId)



    const getCart = async () => {
        try {
            let token = await AsyncStorage.getItem('token')
            const headers = {
                'x-access-token': token,
                // 'content-type': 'multipart/form-data',
            }
            let res = await axios.get("https://hibee-cart.moshimoshi.cloud/cart/", { headers })
            console.log("cart Data", res.data.data)
            console.log("RANDOM", res.data.data)
            res.data.data?.offer?._id ? setSelectedOffer(res.data.data?.offer?._id) : null
            setOffer(res?.data?.data?.items)

        } catch (e) {
            console.log(e)
        }
    }

    // const applyOffer = async (offer) => {
    //     let cart = await AsyncStorage.getItem('cart')
    //     console.log("UPDATED CART", {
    //         products: JSON.parse(cart),
    //         "offerId": offer
    //     })
    //     const token = await AsyncStorage.getItem('token')
    //     const headers = {
    //         'x-access-token': token,
    //     }
    //     let response = await axios.put("https://hibee-cart.moshimoshi.cloud/cart/cart-user", {
    //         products: JSON.parse(cart),
    //         "offerId": offer
    //     }, { headers })

    //     response.data.data?.offer?._id ? setSelectedOffer(response.data.data?.offer?._id) : null
    //     // console.log("response after cart put", response?.data?.data)
    //     // setCart(response.data.data.items)
    //     console.log("REVIEW ITEMS", response?.data?.data)
    // }

    useEffect(() => {
        getCart()
    }, [])

    const getCouponList = async () => {
        console.log("CART ID--->", cartId)
        let response = await axios.get('https://hibee-adminapi.moshimoshi.cloud/admin/offer/?cartId=' + cartId)
        console.log("COUPON LIST", response.data.data)
        setOffers(response.data.data)
    }

    useEffect(() => {
        getCouponList()
    }, [])

    const OffersItem = ({ item }) => (
        <View style={styles.topbox1}>
            <>
                <View>

                    <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                        <Image source={require('../../assets/img/coupon_discount.png')} style={{ height: 24, width: 24, marginLeft: 16, marginTop: 16, }} />

                        <View>

                            <Text style={[styles.applytext, { fontWeight: "700" }]}>{item?.offer?.offer_code}</Text>
                            {item?.applicable ?
                                <Text style={[styles.applytext2, { color: "green" }]}>Save {item?.discount} with {item?.offer?.offer_code} </Text>
                                : <Text style={[styles.applytext2, { color: "red" }]}>Add more {item?.addMore} to save {item?.discount}</Text>}
                        </View>
                    </View>
                </View>
                <TouchableOpacity style={{ height: 32, justifyContent: "center", marginRight: 16, width: 74, fontSize: 12, marginTop: 16, backgroundColor: item?.applicable ? "#12352F" : "#DDDDDD", alignItems: "center", borderRadius: 6 }} disabled={!item?.applicable} onPress={() => {
                    console.log("SELCTEDDD")
                   route.params.setSelectedOffer(item?.offer)
                  navigation.goBack()
                }
                } >
                    {item?.applicable ?
                        (selectedOffer == item?.offer?._id ?
                            <Text style={{ color: "#FEBF22" }}>
                                Applied
                            </Text> : <Text style={{ color: "#FEBF22" }}>
                                Apply
                            </Text>) :
                        <Text style={{ color: "white" }}>
                            Apply
                        </Text>
                    }
                </TouchableOpacity>
                {/* <TouchableOpacity 
                // onPress={handleClick} 
                style={{ backgroundColor: active ? "#359975" : "#12352F", height: 40, width: 60, alignSelf: "center", marginRight: 20 }}>
                    <View style={styles.use}>
                        <Text style={{
                            color: active ? "white" : "yellow"
                            , alignText: "center", justifyContent: "center"

                        }}>{active ? "Applied" : "Use"}</Text>
                    </View>
                </TouchableOpacity> */}
            </>
        </View>)

    return (
        <SafeAreaProvider style={{ backgroundColor: "white" }}>
            <View style={{ width: 400, marginTop: insets.top, height: 80, backgroundColor: "#FFFFFF", shadowColor: '#171717', shadowOffset: { width: -2, height: 4 }, shadowOpacity: 0.2, }}>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', }}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Image source={require('../../assets/img/leftarrow.png')} style={{ marginLeft: 20, marginTop: 0 }} />
                    </TouchableOpacity>
                    <Text style={{ marginLeft: 20, marginTop: 2, fontSize: 14, fontWeight: '700', color: '#12352F' }}>
                        Apply Coupon
                    </Text>
                    {/* <Text style={styles.vegtext}>{} </Text><Text style={styles.counttext}>({selectedProductList?.length} products) </Text> */}
                    {/* categoryList[selectedCategory]?.SubCategoryCount */}
                </View>
            </View>
            <View style={{ marginTop: 20 }}>

                <FlatList data={offers} renderItem={OffersItem} />
            </View>
            {/* <View style={{ width: "100%", alignSelf: "center", marginTop: insets.top, height: "100%", backgroundColor: "#FFFFFF", }}>
            </View> */}
        </SafeAreaProvider>)

}

export default CouponList

const styles = StyleSheet.create({
    absolute: {
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
    },
    topbox1: {
        width: "90%",
        height: 66,
        backgroundColor: 'white',
        marginTop: 5,
        display: 'flex',
        flexDirection: 'row',
        borderWidth: 1,
        // justifyContent:"center",
        alignSelf: "center",
        borderColor: "#E5E5E5",
        // marginLeft: ,
        justifyContent: "space-between",
        borderRadius: 10,
        margin: 10
    },
    applytext: {
        height: 18,
        fontFamily: 'DM Sans',
        //fontWeight: 700,
        fontSize: 14,
        /* or 18px */
        color: '#505462',
        marginTop: 10,
        marginLeft: 10
    },
    applytext2: {
        height: 13,
        fontFamily: 'DM Sans',
        //fontWeight: 400,
        fontSize: 10,
        /* or 18px */
        color: '#999999',
        marginTop: 5,
        marginLeft: 10,
    },
})