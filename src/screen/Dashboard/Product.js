import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, SafeAreaView, Dimensions, Pressable, ImageBackground } from 'react-native'
import { useNavigation, useIsFocused } from '@react-navigation/native'
import axios from 'axios'
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from "react-native-modal";

function Product({ navigation, route }) {
    const [productDetails, setProductDetails] = useState({})
    const [cart, setCart] = useState(null)
    const isFocused = useIsFocused();
    const [tempCart, setTempCart] = useState([])
    useEffect(() => {
        console.log("PROFFFFIFI", route.params.productId)
        getProduct()
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
    }, [isFocused, navigation, route]);
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    const insets = useSafeAreaInsets();
    const [modalOpen, setModalOpen] = useState(false)
    const [replaceCart, setReplaceCart] = useState(false)
    const type = route.params.type ? route.params.type : "normal"
    const cartType = route.params.type ? route.params.type : "normal"
    async function getProduct() {
        let result = await axios.get('https://hibee-product.moshimoshi.cloud/product?productId=' + route.params.productId)
        console.log("PRODUCT DETAILS", result.data.data)
        setProductDetails(result.data.data)
    }
    async function replaceItems() {
        console.log("REPLACE VCARRTTTY", replaceCart, tempCart)
        if (replaceCart == true && tempCart?.length > 0) {
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
    const handleAddToCart = async (productId, qty, price,) => {
        // Check if the product already exists in the cart
        const newItem = { productId, qty, price };
        let globalCartType = await AsyncStorage.getItem('cartType')
        console.log("CARTTGH", cart)

        if (globalCartType != type && cart?.length !== 0) {
            console.log("GLOBAL AND CURRENT", globalCartType, type)
            if (tempCart?.length == 0) {
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
            console.log("OLD QUANTITY", newCart[index].qty)
            newCart[index].qty = newCart[index].qty + qty;
            await AsyncStorage.setItem('cart', JSON.stringify(newCart));
            setCart(newCart);
        }
    };

    const handleRemoveFromCart = (productId) => {
        // Find the index of the product in the cart
        const index = cart.findIndex((item) => item.productId === productId);

        // Remove the product from the cart
        const newCart = [...cart];
        newCart.splice(index, 1);
        setCart(newCart);
    };
    const getQuantityInCart = (productId) => {
        const item = cart?.find((item) => item.productId === productId);
        console.log("ITEMs", item)
        return item ? item.qty : 0;
    };

    return (
        <SafeAreaProvider style={{ flex: 1, height: (windowHeight) }}>
            {/* <View style={styles.topbox}></View> */}
            <View style={{ width: windowWidth, marginTop: insets.top, height: 52, backgroundColor: "white", }}>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Image source={require('../../assets/img/leftarrow.png')} style={{ marginLeft: 20, marginTop: 15 }} />
                    </TouchableOpacity>
                    <Text style={styles.vegtext}>{productDetails?.product_name}</Text>
                </View>
            </View>
            <ScrollView style={{ marginBottom: 66 }}>
                <View style={styles.mainbox}>
                    <Image source={{ uri: Array.isArray(productDetails?.images) ? productDetails.images[0]?.image : productDetails.image }} width={200} height={200} />
                    {/* add carousal for images */}
                </View>

                <View style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', backgroundColor: "white" }}>
                    <View>
                        <View style={{ display: 'flex', flexDirection: 'row', backgroundColor: "white" }}>


                            <Text style={styles.bigtext}>{productDetails?.product_name}</Text>
                            <View style={{ marginLeft: windowWidth - 200 }}>
                                {getQuantityInCart(productDetails?._id) == 0 ?
                                    <View >
                                        <TouchableOpacity style={styles.adds} onPress={() => handleAddToCart(productDetails?._id, 1, productDetails?.discountedPrice)}>
                                            <Text style={styles.addtext}>ADD</Text>
                                        </TouchableOpacity>


                                    </View> :
                                    (
                                        <View style={styles.addssubtract}>
                                            <TouchableOpacity style={styles.adds1} onPress={async () => await handleUpdateQuantity(productDetails?._id, -1)}>
                                                <Image source={require('../../assets/img/subtract.png')} style={{ marginBottom: 15, marginTop: 3 }} />
                                            </TouchableOpacity>
                                            <TouchableOpacity style={styles.quantityText}>
                                                {/* < style={styles.adds1} onPress={() => handleUpdateQuantity(el?._id, -1)}> */}
                                                <Text style={{ color: "#12352F" }}>{getQuantityInCart(productDetails?._id)}</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={styles.adds2} onPress={async () => await handleUpdateQuantity(productDetails?._id, 1)}>
                                                <Image source={require('../../assets/img/cross.png')} style={{ marginBottom: 15, marginTop: -3 }} />
                                            </TouchableOpacity>
                                        </View>
                                    )
                                }
                            </View>
                        </View>
                        <View style={{ flexDirection: "row" }}>
                            <Text style={styles.text1}>{productDetails?.sizeList?.size}</Text>
                            <Text style={[styles.text1, { marginLeft: 3 }]}>{productDetails?.sizeList?.unit}</Text>
                        </View>
                        <View style={styles.contentView}>
                            <Text style={styles.text2}>₹{productDetails?.discountedPrice}</Text>
                            <Text style={styles.text3}>₹{productDetails?.price}</Text>
                            <View style={{
                                display: "flex", alignSelf: 'flex-end', width: 52,
                                height: 18, backgroundColor: '#12352F', justifyContent: 'center', alignItems: 'center', borderRadius: 4, marginTop: 6, marginLeft: 12,
                            }}>
                                <Text style={{ color: '#FFF15C', fontSize: 10, fontFamily: 'DM Sans', fontWeight: 600, }}>{((productDetails?.price - productDetails?.discountedPrice) / productDetails?.price).toFixed(2) * 100 + "% OFF"}</Text>
                            </View>
                        </View>

                        {/* <View style={styles.addbox}>
                        <TouchableOpacity onPress={() => navigation.navigate('Review Cart')}>
                            <Text style={styles.addtext}>ADD</Text>
                        </TouchableOpacity>
                    </View> */}
                        <View style={{ width: 96, marginLeft: windowWidth - 119 }}>



                        </View>
                    </View>
                </View>


                <View style={{ backgroundColor: "white" }}>
                    <Text style={styles.producttext}>
                        Product details
                    </Text>
                    <Text style={styles.shelftext}>Shelf life</Text>
                    <Text style={styles.subtext}>{productDetails?.expiration_date}</Text>


                    <View style={styles.footerbox}>
                        <Text style={styles.descriptiontext}>Description</Text>
                        <Text style={styles.finaltext}>{productDetails?.description}</Text>
                    </View>
                </View>
            </ScrollView>
            {cart?.length > 0 ? <Pressable style={{ position: "absolute", bottom: 0, flexDirection: "row", backgroundColor: "white", width: "100%", height: 66, borderTopLeftRadius: 12, borderTopRightRadius: 12, shadowOffset: { width: 0, height: -1 }, shadowOpacity: 0.1, shadowRadius: 2, borderBottomColor: '#E2E2E2', borderBottomWidth: 1 }} onPress={() => {
                console.log("Cart State", cart)
                // navigation.navigate('Cart')
            }}>
                <Image source={require('../../assets/img/hibeelogo.png')} style={{ width: 25, height: 25, marginLeft: 20, marginTop: 20 }} />
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
                        console.log("CART STATE", cart)
                        navigation.navigate('CartNavigator')
                    }}
                >
                    <Text style={{ color: "white", fontFamily: "DM Sans", marginLeft: 32, marginTop: 10, fontSize: 12 }}>
                        View Cart
                    </Text>
                </TouchableOpacity>
            </Pressable> : null}
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
                            <Text style={{ color: "#111111", fontSize: 20, fontWeight: 700, }}>Replace cart?</Text>
                        </TouchableOpacity>
                        <Text style={{ width: "75%", textAlign: "center", marginTop: 8, fontWeight: 400, color: "#3C5F58" }}>
                            The items added will replace the items from your existing cart. Do you want to replace them?
                        </Text>
                        <View style={{ flexDirection: "row", marginTop: 16 }}>

                            <TouchableOpacity style={{ width: 100, height: 36, backgroundColor: "white", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "#12352F", borderRadius: 6 }}
                                onPress={() =>
                                    setModalOpen(false)}
                            >
                                <Text style={{ fontWeight: 700, fontSize: 12 }}>
                                    Cancel
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ width: 100, height: 36, backgroundColor: "#12352F", marginLeft: 20, alignItems: "center", justifyContent: "center" }}
                                onPress={() => {
                                    console.log("PRESS", replaceCart)
                                    setReplaceCart(true)
                                }}>
                                <Text style={{ color: "#FFD365", fontWeight: 700, fontSize: 12 }}>
                                    Replace
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </ImageBackground>
                </View>
            </Modal>
        </SafeAreaProvider>



    )
}
const styles = StyleSheet.create({
    topbox: {
        width: 400,
        height: 32,
        backgroundColor: 'white'
    },
    linebottom: {
        width: 106,
        height: 0,
        borderColor: '#707070',
        borderWidth: 2,
        borderRadius: 20,
        marginLeft: 140,
        marginTop: 15,
        marginBottom: 5
    },

    mainbox: {
        width: 400,
        height: 225,
        backgroundColor: 'white',
        borderRadius: 6,
        display: 'flex',
        justifyContent: 'center',
        alignItems: "center"

    },
    bigtext: {
        height: 26,
        fontFamily: 'DM Sans',
        //fontWeight: 700,
        fontSize: 20,
        /* identical to box height */
        color: '#000000',
        marginTop: 15,
        marginLeft: 16
    },
    text1: {
        height: 16,
        fontFamily: 'DM Sans',
        //fontWeight: 400,
        fontSize: 12,
        /* identical to box height */
        color: '#525252',
        marginTop: 10,
        marginLeft: 15
    },
    text2: {
        height: 21,
        fontFamily: 'DM Sans',
        //fontWeight: 700,
        fontSize: 16,
        /* identical to box height */
        color: '#000000',
        marginTop: 10,
        marginLeft: 16
    },
    contentView: {
        // paddingLeft: 15,
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',

    },
    text3: {
        height: 16,
        fontFamily: 'DM Sans',
        //fontWeight: 400,
        fontSize: 12,
        /* identical to box height */
        color: '#999999',
        marginTop: 12,
        marginLeft: 4,
        textDecorationLine: 'line-through',
        textDecorationStyle: 'solid',

    },
    addbox: {

        width: 73,
        height: 32,
        borderColor: '#12352F',
        borderWidth: 0.4,
        borderRadius: 4,
        display: 'flex',
        alignSelf: 'flex-end',
        marginLeft: 280,
        backgroundColor: '#F1F9F3',
        marginTop: 0,
        marginBottom: 22
    },
    addtext: {
        width: 36,
        height: 16,
        fontFamily: 'DM Sans',
        //fontWeight: 500,
        fontSize: 12,
        /* identical to box height */
        color: '#12352F',
        marginTop: 7,
        marginLeft: 18
    },
    producttext: {
        height: 21,
        fontFamily: 'DM Sans',
        //fontWeight: 700,
        fontSize: 16,
        /* identical to box height */
        color: '#000000',
        marginTop: 40,
        marginLeft: 16
    },
    shelftext: {
        height: 18,
        fontFamily: 'DM Sans',
        //fontWeight: 400,
        fontSize: 14,
        /* identical to box height */
        color: '#000000',
        marginTop: 10,
        marginLeft: 16,
        marginRight: 18
    },
    descriptiontext: {
        height: 18,
        fontFamily: 'DM Sans',
        //fontWeight: 400,
        fontSize: 14,
        /* identical to box height */
        color: '#000000',
        marginTop: 7,
        // marginLeft: 14,
        marginRight: 18
    },
    subtext: {
        height: 17,
        fontFamily: 'DM Sans',
        //fontWeight: 400,
        fontSize: 12,
        /* identical to box height */
        color: '#7A7A7A',
        marginLeft: 14,
        marginRight: 18,
        marginTop: 6
    },
    footerbox: {
        width: "100%",
        height: "100%",
        backgroundColor: 'white',
        marginTop: 10,
        // padding: 5,
        paddingLeft: 14,
        paddingRight: 18

    },
    finaltext: {
        height: 119,
        fontFamily: 'DM Sans',
        //fontWeight: 400,
        fontSize: 15,
        /* identical to box height */
        color: '#7A7A7A',
        marginTop: 6,
        // marginLeft: 14,
        padding: 5

    },
    topbox: {
        width: 400,
        height: 32,
        backgroundColor: '#dcdcdc'
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
    adds: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        border: 2,
        borderColor: '#3C5F58',
        borderWidth: 1,
        paddingVertical: 0,
        width: 96,
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
        width: 96,
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
        height: "100%",
        // backgroundColor: 'black',
    },
    adds2: {
        alignItems: 'center',
        borderColor: '#12352F',
        paddingVertical: 16,
        width: '33%',
        height: "100%",
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
})

export default Product

