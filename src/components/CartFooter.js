import { View, Text, StyleSheet, SafeAreaView, Image, TouchableOpacity, TextInput, ScrollView, Keyboard, FlatList, Pressable, TouchableHighlight, ImageBackground } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation, useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from "react-native-modal";

const CartFooter = (props) => {
    const navigation = useNavigation();
    const { cart } = props
    const [open, setOpen] = useState(false)
    const [modalOpen, setModalOpen] = useState(false)
    const isFocused = useIsFocused();
    useEffect(() => {
        getModelOpen()

    }, []);
    async function getModelOpen() {
        let modalOpen = await AsyncStorage.getItem('cartModelOpen')
        // console.log("CART FOOTEER",modalOpen)
        // if (modalOpen == "open") {
        //     setOpen(true)
        // }
    }
    return (
        open === true ?
            <Modal isVisible={open}>
                <ImageBackground source={require('../assets/img/cart_modal.png')} style={{ width: "100%", height: 230, backgroundColor: "white", alignItems: "center", justifyContent: "center" }} >
                    <TouchableOpacity style={{ position: "absolute", right: 20, top: 20 }} onPress={async () => {
                        setOpen(false)
                        await AsyncStorage.removeItem("cartModelOpen")
                    }}>
                        <Image source={require('../assets/img/closemodal.png')} />
                    </TouchableOpacity>
                    <Text style={{ color: "#111111", fontSize: 20, fontWeight: "700", }}>Replace cart?</Text>
                    <Text style={{ width: "75%", textAlign: "center", marginTop: 8, fontWeight: "400", color: "#3C5F58" }}>
                        The item you're adding belongs to Instant Delivery and will replace existing items from normal delivery.
                    </Text>

                    <View style={{ flexDirection: "row", marginTop: 16 }}>

                        <TouchableOpacity style={{ width: 100, height: 36, backgroundColor: "white", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "#12352F", borderRadius: 6 }}>
                            <Text style={{ fontWeight: "700", fontSize: 12 }}>
                                Cancel
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ width: 100, height: 36, backgroundColor: "#12352F", marginLeft: 20, alignItems: "center", justifyContent: "center" }}>
                            <Text style={{ color: "#FFD365", fontWeight: "700", fontSize: 12 }}>
                                Replace
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ImageBackground>
            </Modal> :

            <Pressable style={{ position: "absolute", bottom: 0, flexDirection: "row", backgroundColor: "white", width: "100%", height: 66, borderTopLeftRadius: 12, borderTopRightRadius: 12, shadowOffset: { width: 0, height: -1 }, shadowOpacity: 0.1, shadowRadius: 2, borderBottomColor: '#E2E2E2', borderBottomWidth: 1 }} onPress={() => {
                navigation.navigate('CartNavigator')
            }}>
                <Image source={require('../assets/img/hibeelogo.png')} style={{ width: 25, height: 25, marginLeft: 20, marginTop: 20 }} />
                <View>
                    <Text style={{ color: "#3C5F58", fontFamily: "DM Sans", marginLeft: 20, marginTop: 10, fontSize: 12 }}>
                        {cart?.length ? cart?.reduce((acc, curr) => {
                            return acc + curr?.qty
                        }, 0) : null} Item added to cart
                    </Text>
                    <Text style={{ color: "#3C5F58", fontFamily: "DM Sans", marginTop: 5, marginLeft: 20, fontSize: 16 }}>
                        {cart?.reduce((acc, curr) => {
                            console.log(curr?.price)
                            return acc + curr?.price * curr?.qty
                        }, 0)}
                    </Text>
                </View>
                <TouchableOpacity style={{
                    backgroundColor: "#135C4E",
                    width: 125,
                    height: 36,
                    marginTop: 15,
                    position: 'absolute',
                    right: 17,
                    borderRadius: 5,
                }}
                    onPress={() => {
                        navigation.navigate('CartNavigator')
                    }}
                >
                    <Text style={{ color: "white", fontFamily: "DM Sans", marginLeft: 32, marginTop: 10, fontSize: 12 }}>
                        View Cart
                    </Text>
                </TouchableOpacity>
            </Pressable>

    )
}

export default CartFooter; 
