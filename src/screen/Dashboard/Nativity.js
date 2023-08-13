import { View, Text, StyleSheet, SafeAreaView, Image, TouchableOpacity, TextInput, ScrollView, Keyboard, FlatList, Pressable, Dimensions, ImageBackground } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation, useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProductList from '../../components/ProductList';
import CartFooter from '../../components/CartFooter';
import Modal from "react-native-modal";
import LinearGradient from 'react-native-linear-gradient';

const Nativity = () => {
    const insets = useSafeAreaInsets()
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    const navigation = useNavigation();
    const [cart, setCart] = useState(null)
    const isFocused = useIsFocused();
    const [modalOpen, setModalOpen] = useState(false)
    const [replaceCart, setReplaceCart] = useState(false)
    const [selectedCity, setSelectedCity] = useState({})
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            AsyncStorage.getItem('cart').then((value) => {
                if (value) {
                    setCart(JSON.parse(value));
                } else {
                    setCart([]);
                }
            });
        });

        return unsubscribe;
    }, [isFocused, navigation]);
    const [products, setProducts] = useState([]);
    const [cities, setCities] = useState([]);
    async function getproductList() {
        console.log(selectedCity);
        let queryparams = Object.keys(selectedCity).length !== 0 ? "?_id=" + selectedCity?._id : ''
        console.log("queryparams", queryparams)

        let result = await axios.get('https://hibee-product.moshimoshi.cloud/nativity/products' + queryparams)

        console.log("PRODUCT LIST", result.data.data)

        setProducts(result.data.data)
    }

    async function getCities() {
        let result = await axios.get('https://hibee-product.moshimoshi.cloud/nativity')
        console.log("CITY LIST", result.data.data)
        setCities(result.data.data)
    }

    useEffect(() => {

        getCities()
    }, [])
    useEffect(() => {
        getproductList()
    }, [selectedCity])
    const renderItem = ({ item }) => {
        const pillWidth = item?.city?.length * 12;

        return (
            <TouchableOpacity onPress={() => setSelectedCity(item)}>
                {selectedCity?._id !== item?._id ? <LinearGradient colors={['#FFEAB5', '#FFC32E']} style={[styles.pill, { width: pillWidth, backgroundColor: selectedCity?._id == item?._id ? "#12352F" : '#FFEAB5' }]}
                start={{x: 0, y: 0}} end={{x: 1, y: 0}}
                >

                    {
                        <Text style={[styles.cityText, { color: "#12352F" }]}>{item.city}</Text>
                    }
                </LinearGradient> :
                    <View style={[styles.pill, { width: pillWidth, backgroundColor: selectedCity?._id == item?._id ? "#12352F" : '#FFEAB5' }]}>

                        <Text style={styles.cityText}>{item.city}</Text>
                    </View>
                }
            </TouchableOpacity>
        );
    };
    return (
        <SafeAreaProvider style={{ flex: 1, height: (windowHeight) }}>
            <View style={{ backgroundColor: "white", width: "100%", height: "100%" }}>
                <View style={{ backgroundColor: 'green', marginTop: insets.top, width: windowWidth, height: undefined, aspectRatio: 11.25 }}>
                    <Image source={require('../../assets/img/Topbanner.png')} style={{ width: "100%", height: "100%", resizeMode: "stretch" }} />
                </View>
                <View style={{ width: 400, height: 80, backgroundColor: "#FFFFFF", shadowColor: '#171717', shadowOffset: { width: -2, height: 4 }, shadowOpacity: 0.2, }}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', }}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Image source={require('../../assets/img/leftarrow.png')} style={{ marginLeft: 20, marginTop: 15 }} />
                        </TouchableOpacity>
                        <Text style={styles.vegtext}>  {Object.keys(selectedCity).length !== 0 ? selectedCity?.city : "Nativity"} </Text><Text style={styles.counttext}>({products?.length} products) </Text>
                        {/* categoryList[selectedCategory]?.SubCategoryCount */}
                    </View>
                </View>
                <Text style={{ color: "#111111", fontWeight: '700', fontSize: 14, marginLeft: 12, marginTop: 24 }}>
                    Select your city
                </Text>
                <View style={{
                    height: 50, marginLeft: 12,
                    marginTop: 12
                }}>
                    <FlatList
                        data={cities}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        renderItem={renderItem}
                        keyExtractor={(item) => item._id}
                        contentContainerStyle={styles.container}
                    />
                </View>
                <ProductList products={products} cart={cart} setCart={setCart} modalOpen={modalOpen} setModalOpen={setModalOpen} type='normal'
                    replaceCart={replaceCart} setReplaceCart={setReplaceCart} />
                {cart?.length > 0 ? <CartFooter cart={cart} /> : null}
                <Modal isVisible={modalOpen}>
                    <View style={{ height: "100%", justifyContent: "center", }}>
                        <ImageBackground source={require('../../../src/assets/img/cart_modal.png')} style={{ width: "100%", height: 230, backgroundColor: "white", alignItems: "center", justifyContent: "center" }} >
                            <TouchableOpacity style={{ position: "absolute", right: 20, top: 20 }} onPress={async () => {
                                setModalOpen(false)
                                // await AsyncStorage.removeItem("cartModelOpen")
                            }}>
                                <Image source={require('../../../src/assets/img/closemodal.png')} />
                            </TouchableOpacity>
                            <TouchableOpacity >
                                <Text style={{ color: "#111111", fontSize: 20, fontWeight: '700', }}>Replace cart?</Text>
                            </TouchableOpacity>
                            <Text style={{ width: "75%", textAlign: "center", marginTop: 8, fontWeight: '400', color: "#3C5F58" }}>
                            The items added will replace the items from your existing cart. Do you want to replace them?
                            </Text>
                            <View style={{ flexDirection: "row", marginTop: 16 }}>

                                <TouchableOpacity style={{ width: 100, height: 36, backgroundColor: "white", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "#12352F", borderRadius: 6 }}
                                    onPress={() =>
                                        setModalOpen(false)}
                                >
                                    <Text style={{ fontWeight: '700', fontSize: 12 }}>
                                        Cancel
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ width: 100, height: 36, backgroundColor: "#12352F", marginLeft: 20, alignItems: "center", justifyContent: "center" }}
                                    onPress={() => {
                                        console.log("PRESS", replaceCart)
                                        setReplaceCart(true)
                                    }}>
                                    <Text style={{ color: "#FFD365", fontWeight: '700', fontSize: 12 }}>
                                        Replace
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </ImageBackground>
                    </View>
                </Modal>
            </View>
        </SafeAreaProvider>
    )



}
const styles = StyleSheet.create({

    vegtext: {
        height: 18,
        fontFamily: 'DM Sans',
        //fontWeight: 600,
        fontSize: 14,
        color: '#3C5F58',
        marginTop: 16,
        marginLeft: 15
    },
    container: {
        paddingVertical: 10,
    },
    pill: {
        backgroundColor: '#FFEAB5',
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 10,
        marginHorizontal: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cityText: {
        fontSize: 12,
        fontWeight: '500',
        color: "#FEBF22"

    },
    counttext: {
        height: 18,
        fontFamily: 'DM Sans',
        //fontWeight: 600,
        fontSize: 10,
        color: 'grey',
        marginTop: 20,
        // marginLeft: 15

    },
    linearGradient: {
        flex: 1,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 5
    },
    buttonText: {
        fontSize: 18,
        fontFamily: 'Gill Sans',
        textAlign: 'center',
        margin: 10,
        color: '#ffffff',
        backgroundColor: 'transparent',
    },
})
export default Nativity