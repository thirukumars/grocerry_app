import React, { useState, useEffect } from 'react'
import { View, StyleSheet, TouchableOpacity, Image, Text, ImageBackground, ScrollView, TouchableHighlight, Dimensions, Alert, SafeAreaView, Pressable, FlatList } from 'react-native'
import TabHomeBottom from '../BottomTab/TabHomeBottom'
import { useFocusEffect, useNavigation, useIsFocused } from '@react-navigation/native'
import { Button } from 'react-native';
import { Drawer } from 'react-native-drawer-layout';
// import { Dimensions } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import ProductList from '../../components/ProductList';
import CartFooter from '../../components/CartFooter';
import Modal from "react-native-modal";

function Category(route) {
    const insets = useSafeAreaInsets();
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    const [open, setOpen] = useState(false)
    const navigation = useNavigation()
    const [categoryList, setCategoryList] = useState([{}])
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [selectedSubCategory, setSelectedSubCategory] = useState(null)
    // setSelectedCategory()
    // get cart from async storage
    const [cart, setCart] = useState(null)
    const isFocused = useIsFocused();
    const [modalOpen, setModalOpen] = useState(false)
    const [replaceCart, setReplaceCart] = useState(false)

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

    const Item = ({ el }) => (
        <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', flexWrap: 'nowrap', backgroundColor: '#FFFFFF' }}>
            <View style={{
                display: 'flex', marginTop: 10, justifyContent: 'center',
                alignItems: 'center',
            }}>
                <TouchableHighlight
                    style={{
                        borderRadius: 100,
                        width: 60,
                        height: 60,
                        backgroundColor: selectedSubCategory === el?._id ? '#FFF15C' : 'white',
                    }}
                    underlayColor='#ccc'
                    onPress={() => {
                        console.log("SUBCATEGIRY ID", el?._id)
                        setSelectedSubCategory(el?._id)
                    }}
                >
                    <Image source={{ uri: el?.image }} width={40} height={40} style={{ position: "absolute", marginLeft: 10, marginTop: 10, overflow: "visible", }} />
                </TouchableHighlight>
                <Text style={[styles.textleft, { marginLeft: 0 }]}>{el?.name}</Text>
            </View>

        </View>)
    // const [selectedProduct, setSelectedProduct] = useState(null)
    const [productList, setProductList] = useState([{}])
    const [selectedProductList, setSelectedProductList] = useState([{}])
    // const [productList2, setProductList2] =
    async function getSubCategoryList() {
        console.log("HHHH", selectedCategory)
        let result = await axios.get('https://hibee-product.moshimoshi.cloud/category/sub?categoryId=' + selectedCategory)
        if (selectedSubCategory == null)
            setSelectedSubCategory(result.data.data[0]?._id)
        setCategoryList(result.data.data)
        // await getproductList()
    }
    async function getproductList() {
        try {
            console.log("GETTING PRODUCT")
            let result = await axios.post('https://hibee-product.moshimoshi.cloud/product/product_category_lists', { "category": selectedCategory })
            console.log("PRODUCT LIST", result.data.data)
            //filter results where category is selectedcategory
            // console.log("SELECTED CATEGORY", categoryList[selectedCategory]?._id)
            // sort results by name")
            setProductList(result.data.data)
            setSelectedProductList(result.data.data)
        }
        catch (e) {
            console.log(e, "getproductList is failing")
        }
    }
    useEffect(() => {
        console.log("SELECTED CATEGORY-->", selectedCategory)
        getSubCategoryList()
        getproductList()
        console.log("JKJKK")
    }, [selectedCategory, selectedSubCategory])

    useEffect(() => {
        let result = productList.filter((el) => {
            console.log(el.subcategory, "EL CATEGORY")
            return el.subcategory === selectedSubCategory

        })
        console.log("FILTERED LIST", result)
        setSelectedProductList([...result])
    }, [selectedCategory, productList, categoryList, selectedSubCategory])

    useEffect(() => {
        console.log("ROUTE---->", route?.route?.params?.categoryId)
        setSelectedCategory(route?.route?.params?.categoryId)
    }, [route?.route?.params?.categoryId])

    const handleAddToCart = async (productId, qty, price) => {
        // Check if the product already exists in the cart
        const index = cart.findIndex((item) => item.productId === productId);

        // If the product exists, update the qty
        if (index !== -1) {
            const newCart = [...cart];
            newCart[index].qty += qty;
            await AsyncStorage.setItem('cart', JSON.stringify(newCart));
            setCart(newCart);
        } else {
            // If the product does not exist, add it to the cart
            const newItem = { productId, qty, price };
            await AsyncStorage.setItem('cart', JSON.stringify([...cart, newItem]));
            setCart([...cart, newItem]);
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
            console.log("OLD qty", newCart[index].qty)
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


    async function addToCart(product_id, qty) {
        try {
            let token = await AsyncStorage.getItem('token')
            const headers = {
                'x-access-token': token,
                // 'content-type': 'multipart/form-data',
            }
            console.log("token", token, product_id, qty)
            let result = await axios.put('https://hibee-cart.moshimoshi.cloud/cart/cart-user', {
                products: cart
            }, { headers })
            console.log("ADDED TO CART", result?.data)
            // getcart()
        }
        catch (e) {
            console.log(e?.response, "RESPONSE")
        }
    }

    async function getcart() {
        try {
            let token = await AsyncStorage.getItem('token')

        } catch (e) {

        }
    }

    return (
        <SafeAreaProvider style={{ flex: 1, height: (windowHeight) }}>
            <View style={{ height: "100%" }}>

                <View style={{ backgroundColor: 'green', marginTop: insets.top, width: windowWidth, height: undefined, aspectRatio: 11.25 }}>
                    <Image source={require('../../assets/img/Topbanner.png')} style={{ width: "100%", height: "100%", resizeMode: "stretch" }} />
                </View>
                <View style={{ width: 400, height: 80, backgroundColor: "#FFFFFF", shadowColor: '#171717', shadowOffset: { width: -2, height: 4 }, shadowOpacity: 0.2, }}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', }}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Image source={require('../../assets/img/leftarrow.png')} style={{ marginLeft: 20, marginTop: 15 }} />
                        </TouchableOpacity>
                        <Text style={styles.vegtext}>{categoryList[selectedCategory]?.name} </Text><Text style={styles.counttext}>({selectedProductList?.length} products) </Text>
                        {/* categoryList[selectedCategory]?.SubCategoryCount */}
                    </View>
                </View>
                <Drawer
                    drawerType='permanent'
                    open={open}
                    drawerStyle={{
                        backgroundColor: '#FFFFFF',
                        width: 100,
                    }}
                    onOpen={() => setOpen(true)}
                    onClose={() => setOpen(false)}
                    renderDrawerContent={() => {
                        return <FlatList scrollEnabled={true} data={categoryList} renderItem={({ item }) => <Item el={item} />}
                            ListHeaderComponent={
                                <View>
                                </View>
                            }
                            ListFooterComponent={
                                <View style={{ width: '100%', height: 66 }}>
                                </View>
                            }
                        />
                    }}
                >
                    <View>
                        {
                            <ProductList products={selectedProductList} cart={cart} setCart={setCart} setModalOpen={setModalOpen} type='normal' replaceCart={replaceCart} setReplaceCart={setReplaceCart} />
                        }
                        <View style={{ width: "100%", height: 66 }}>

                        </View>
                    </View >

                </Drawer >
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
            </View >
        </SafeAreaProvider>
    )
}


const styles = StyleSheet.create({
    topbox: {
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
    counttext: {
        height: 18,
        fontFamily: 'DM Sans',
        //fontWeight: 600,
        fontSize: 10,
        color: 'grey',
        marginTop: 20,
        // marginLeft: 15

    },
    leftnav: {
        flex: 1,
        flexDirection: 'column',
        width: 79,
        height: 716,

        // shadowColor: 'rgba(0, 0, 0, 0.12)',
        // shadowOffset: 1,
        // shadowOpacity: 4,
        // shadowRadius: 4,
        marginTop: 50
    },
    rounded: {
        marginTop: 20,
        marginLeft: 20
    },
    textleft: {
        fontFamily: 'DM Sans',
        //fontWeight: 700,
        fontSize: 10,
        color: '#3C5F58',
        marginTop: 10,
        marginLeft: 20
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
        //fontWeight: 500,
        fontSize: 14,
        /* or 18px */
        color: '#3C5F58',
        marginTop: 25
    },

    text1: {
        height: 18,
        fontFamily: 'DM Sans',
        //fontWeight: 500,
        fontSize: 10,
        /* or 18px */
        color: '#3C5F58',
        marginTop: 3
    },
    text2: {
        height: 18,
        fontFamily: 'DM Sans',
        //fontWeight: 500,
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
        paddingVertical: 10,
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
        height: 24,
        // borderRadius: 4,
        color: '#3C5F58',
        backgroundColor: '#F1F9F3',
        marginTop: -5,
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
        marginTop: 5
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
export default Category