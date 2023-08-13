import { View, Text, StyleSheet, TextInput, Image, ImageBackground, SafeAreaView, ScrollView, TouchableOpacity, Button, TouchableHighlight, Pressable, FlatList } from 'react-native';
import React, { useState, useEffect } from 'react';
import HorizontalProductList from './HorizontalProductList';


const Superfast = (props) => {
    const { productList, cart, setCart, modalOpen, setModalOpen ,replaceCart, setReplaceCart} = props
    return (
        <ImageBackground source={require('../assets/img/superfast.png')} style={{ width: "100%", height: 480, marginVertical: 30 }}>
            <Text style={{ fontSize: 20, marginTop: 12, marginLeft: 16, color: "#095344", fontWeight: "600", width: 200 }}>
                Get Superfast Delivery!
            </Text>
            <Text style={{ fontSize: 20, marginTop: 6, marginLeft: 16, color: "#147A66", fontWeight: "700", textDecorationLine: "underline", fontSize: 12 }}>
                8-10 mins
            </Text>
            <View style={{ backgroundColor: "white", width: "90%", height: 370, alignSelf: "center", marginTop: 10 }}>
                <Text style={{ color: "black", fontSize: 16, fontWeight: "700", alignSelf: "center", marginTop: 18 }}>
                    Instant Delivery
                </Text>
                <Text style={{ color: "#8F8F8F", fontSize: 10, fontWeight: "400", alignSelf: "center", marginTop: 2, marginBottom: 12 }}>
                    Get your daily essentials instantly
                </Text>
                <View style={{ height: 260, width: "100%" }}>

                    <HorizontalProductList products={productList} color="#F8F7F5" cart={cart} setCart={setCart} modalOpen={modalOpen} setModalOpen={setModalOpen} type='superfast'
                        replaceCart={replaceCart} setReplaceCart={setReplaceCart} />
                </View>
                <TouchableOpacity style={{ width: "90%", backgroundColor: "white", height: 34, alignSelf: 'center', borderWidth: 1, borderColor: "#12352F", borderRadius: 8 }}>
                    <Text style={{ color: "#3C5F58", fontSize: 14, fontWeight: "500", alignSelf: "center", marginTop: 8, }}>
                        View all
                    </Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>)
}

export default Superfast