import { View, Text, StyleSheet, SafeAreaView, Image, TouchableOpacity, TextInput, ScrollView, Keyboard, FlatList, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation, useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';






const ProductList = (props) => {
    const { cart, setCart, cartType, modalOpen, setModalOpen, type, replaceCart, setReplaceCart } = props
    const isFocused = useIsFocused();
    const navigation = useNavigation()
    const [tempCart, setTempCart] = useState([])
    // console.log("PROPS", props.products)
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
    async function replaceItems() {
        console.log("REPLACE VCARRTTTY", replaceCart, tempCart)
        if (replaceCart == true && tempCart.length > 0) {
            console.log("CONDITION TRUE")
            setCart(tempCart)
            setReplaceCart(false)
            setModalOpen(false)
            setTempCart([])
            await AsyncStorage.setItem('cartType', type)
        }
        else {
            setModalOpen(false)
            console.log("CONDITION FAILED")
        }
    }
    useEffect(() => {
        replaceItems()

    }, [replaceCart])
    const [products, setProducts] = useState([props?.products]);
    const handleAddToCart = async (productId, qty, price,) => {
        console.log("PRICE", price)
        // Check if the product already exists in the cart
        const newItem = { productId, qty, price };
        let globalCartType = await AsyncStorage.getItem('cartType')
        console.log("CARTTGH", cart)

        if (globalCartType != type && cart.length !== 0) {
            console.log("GLOBAL AND CURRENT", globalCartType, type)
            if (tempCart.length == 0) {
                setTempCart([newItem]);
                setModalOpen(true)
            } else {
                setModalOpen(true)
            }
        }
        else {
            if (cart.length == 0) {
                await AsyncStorage.setItem('cartType', type)
                console.log("TYPE IS SET")
            }
            const index = cart.findIndex((item) => item.productId === productId);
            const newItem = { productId, qty, price };
            console.log("NEWITEMS", newItem)
            await AsyncStorage.setItem('cart', JSON.stringify([newItem]));

            if (cartType && cartType !== type) {
                // Show the popup for cart type mismatch
                await AsyncStorage.setItem('cartModelOpen', 'open');
            }
            if (cartType !== type) {
                await AsyncStorage.setItem('cartModelOpen', "open")
            }
            {
                // If the product exists, update the qty
                if (index !== -1) {
                    const newCart = [...cart];
                    newCart[index].qty += qty;
                    await AsyncStorage.setItem('cart', JSON.stringify(newCart));
                    setCart(newCart);
                } else {
                    // If the product does not exist, add it to the cart
                    await AsyncStorage.setItem('cart', JSON.stringify([...cart, newItem]));
                    setCart([...cart, newItem]);
                }
            }
        }
    };
    const getQuantityInCart = (productId) => {
        const item = cart?.find((item) => item.productId === productId);
        console.log("ITEMs", item)
        return item ? item.qty : 0;
    };
    const handleUpdateQuantity = async (productId, qty) => {
        // Find the index of the product in the cart
        const index = cart.findIndex((item) => item.productId === productId);
        const newCart = [...cart];
        // If the qty is 0, remove the product from the cart
        if (newCart[index].qty + qty === 0) {
            newCart.splice(index, 1);
            console.log(newCart, "NEW CART")
            await AsyncStorage.setItem('cart', JSON.stringify(newCart));
            setCart(newCart);
        } else {
            // Otherwise, update the qty
            const newCart = [...cart];
            console.log("OLD qty", newCart[index].qty)
            newCart[index].qty = newCart[index].qty + qty;
            await AsyncStorage.setItem('cart', JSON.stringify(newCart));
            setCart(newCart);
        }
    };
    const Item = ({ el }) => (
        <View style={styles.applebig}>
            <TouchableOpacity onPress={() => navigation.navigate('CategoryNavigator', { screen: 'Product', params: { productId: el?._id }, initial: false })} >
                <View style={{
                    display: "flex", alignSelf: 'flex-end', width: 52,
                    height: 18, backgroundColor: '#12352F', justifyContent: 'center', alignItems: 'center', borderRadius: 4,
                }}>
                    <Text style={{ color: '#FFF15C', fontSize: 10, fontFamily: 'DM Sans', fontWeight: 600, padding: 2 }}>{((el?.price - el?.discountedPrice) / el?.price).toFixed(2) * 100 + "% OFF"}</Text>

                </View>
                <Image source={{ uri: Array.isArray(el?.images) ? el.images[0]?.image : el.image }} width={120} height={120} style={{ marginTop: 10, alignSelf: "center" }} resizeMode={'contain'} />
                <Text style={[styles.text, { marginTop: 10, width: 120 }]}>{el?.product_name}</Text>
                <View style={{display:'flex', flexDirection:'row'}}>
                <Text style={[styles.text1, { marginTop: 5,margin:2 }]}>{el?.sizeList?.size}</Text>
                <Text style={[styles.text1, { marginTop: 5 ,margin:2}]}>{el?.sizeList?.unit}</Text>
                </View>
                <Text style={[styles.text2, { marginTop: 10 }]}>₹{el?.discountedPrice}</Text>
                <Text style={[styles.text2, { textDecorationLine: 'line-through', textDecorationStyle: 'solid', color: '#999999', marginTop: 0, fontSize: 10 }]}>
                    ₹{el?.price}
                </Text>
                <View
                // style={[styles.container, { marginLeft: 60, marginTop: 20 }]}
                >
                    {getQuantityInCart(el?._id) == 0 ?
                        <View >
                            <TouchableOpacity style={styles.adds} onPress={() => handleAddToCart(el?._id, 1, el?.discountedPrice)}>
                                {/* <Image source={require('../../assets/img/cross.png')} style={{ marginBottom: 15, marginTop: -3 }} /> */}
                                <Text style={styles.addtext}>ADD</Text>
                            </TouchableOpacity>
                        </View> :
                        (
                            <View style={styles.addssubtract}>
                                <TouchableOpacity style={styles.adds1} onPress={async () => await handleUpdateQuantity(el?._id, -1)}>
                                    <Image source={require('../assets/img/subtract.png')} style={{ marginBottom: 15, marginTop: 3 }} />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.quantityText}>
                                    {/* < style={styles.adds1} onPress={() => handleUpdateQuantity(el?._id, -1)}> */}
                                    <Text style={{ color: "#12352F" }}>{getQuantityInCart(el?._id)}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.adds2} onPress={async () => await handleUpdateQuantity(el?._id, 1)}>
                                    <Image source={require('../assets/img/cross.png')} style={{ marginBottom: 15, marginTop: -3 }} />
                                </TouchableOpacity>
                            </View>
                        )
                    }
                </View>
            </TouchableOpacity>
        </View>
    );

    return (
        <FlatList scrollEnabled={true} numColumns={2} data={props.products} renderItem={({ item }) => <Item el={item} />}
            ListHeaderComponent={
                <View>
                    <Text style={[styles.text, { fontSize: 12, fontWeight: 'bold', marginTop: 10, marginLeft: 10, marginBottom: 10 }]}>
                        {props?.products.length} results
                    </Text>
                </View>
            }
            ListFooterComponent={
                <View style={{ width: "100%", height: 66 }}>
                </View>
            }
            ListEmptyComponent={<View style={{ width: '100%', alignContent: "center", justifyContent: "center", marginLeft: '25%' }}>
                <Image source={require('../assets/img/noitems.png')} style={{
                    marginBottom: 15, marginTop: 80,
                    width: '50%',
                    height: undefined,
                    aspectRatio: 0.69, //this is not a joke, it was the actual ratio of the png
                }} />
                <Text style={{ marginLeft: 5, fontSize: 20, color: "black" }}> No Items Available</Text>
                <Text style={{ marginLeft: 20, fontSize: 14, width: 150, marginTop: 12, color: "black" }}> There is no data to show you right now.</Text>
            </View>}
        />
    )
}

export default ProductList
const styles = StyleSheet.create({
    SectionStyle: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderWidth: 0.2,
        borderColor: 'gray',
        height: 50,
        borderRadius: 5,
        marginTop: 30,
        marginBottom: 20,
        marginLeft: "5%",
        width: "90%%",
        shadowColor: 'black',
        elevation: 5,
        shadowOffset: { width: 0, height: -1 }, shadowOpacity: 0.1, shadowRadius: 2, borderBottomColor: '#E2E2E2', borderBottomWidth: 1
    },
    ImageStyle: {
        padding: 10,
        margin: 5,
        height: 20,
        width: 20,
        resizeMode: 'stretch',
        alignItems: 'center',
    },
    inputStyle: {
        flex: 1,
        color: '#000',
        paddingLeft: 15,
        paddingRight: 15,
        borderWidth: 1,
        borderRadius: 30,
        borderColor: '#FF9900',
    },
    iconStyle: {
        padding: 5,
        margin: 5,
        height: 25,
        width: 25,
        resizeMode: 'stretch',
        // backgroundColor: '#fff',
    },
    mainbox: {
        display: 'flex',
        flex: 2,
        flexDirection: 'row',

        marginLeft: 10,

        // marginTop: -60,

        flexWrap: 'wrap'

    },
    applebig: {
        width: '50%',
        height: 310,
        backgroundColor: '#FFFFFF',
        borderRadius: 2,
        padding: 10,
        // marginTop: 50,
        // marginBottom:50
        borderWidth: 0.5,
        borderColor: '#F5F5F5'
        // margin: 2,
        // padding: 5,

    },
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 10,
        width: 32,
        height: 28,
        marginLeft: 60,
        borderColor: '#12352F',
        marginTop: -55,
    },
    text: {
        height: 18,
        fontFamily: 'DM Sans',
        fontWeight: 500,
        fontSize: 14,
        /* or 18px */
        color: '#3C5F58',
        marginTop: 25
    },

    text1: {
        height: 18,
        fontFamily: 'DM Sans',
        fontWeight: 500,
        fontSize: 10,
        /* or 18px */
        color: '#3C5F58',
        marginTop: 3
    },
    text2: {
        height: 18,
        fontFamily: 'DM Sans',
        fontWeight: 500,
        fontSize: 14,
        /* or 18px */
        color: '#000000',
    },
    adds: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        border: 2,
        borderColor: '#3C5F58',
        borderWidth: 1,
        paddingVertical: 0,
        width: '100%',
        height: 38,
        borderRadius: 4,
        color: '#3C5F58',
        backgroundColor: '#F1F9F3',
        marginTop: 5
        // marginLeft: -40
    },
    addtext: {
        alignItems: 'center',
        // backgroundColor: 'white',
        // border: 2,
        // borderColor: '#12352F',
        // borderWidth: 1,
        // padding: 10,
        // width: '20%',
        // height: 24,
        // lineHeight:20,
        fontSize: 14,
        // borderRadius: 4,
        color: '#3C5F58',
        backgroundColor: '#F1F9F3',
        // marginTop: -5,
        paddingVertical: 5,

    },
    addssubtract: {
        flexDirection: 'row',
        // alignItems: 'center',
        // backgroundColor: 'white',
        // border: 2,
        // borderColor: '#12352F',
        // borderWidth: 1,
        // padding: 10,
        // width: 62,
        // height: 28,
        // borderRadius: 4,
        // color: 'black',
        // backgroundColor: '#F1F9F3',
        // marginLeft: -45
        // alignItems: 'center',
        backgroundColor: 'white',
        border: 2,
        borderColor: '#3C5F58',
        // color: '',
        borderWidth: 1,
        // padding: 10,
        width: '100%',
        height: 38,
        borderRadius: 4,
        color: '#3C5F58',
        backgroundColor: '#F1F9F3',
        marginTop: 5,
        justifyContent: "space-evenly"
        // marginBottom:0
    },
    adds1: {
        alignItems: 'center',
        borderColor: '#12352F',
        paddingVertical: 16,
        width: '33%',
        height: 28,
        // backgroundColor: 'black',
    },
    adds2: {
        alignItems: 'center',
        borderColor: '#12352F',
        paddingVertical: 16,
        width: '33%',
        height: 28,
        // backgroundColor: 'black',
    },
    quantityText: {
        // alignItems: 'center',
        height: 28,
        color: '#3C5F58',
        // backgroundColor: 'yellow',
        paddingHorizontal: '15%',
        marginTop: 10

        // paddingVertical: 10
    },
    bottombox: {
        flex: 1,
        flexDirection: 'row',
        marginTop: 2,
        marginLeft: 2,
        backgroundColor: 'white',
        // height: 300
        flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'space-between',
    },
})