import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Pressable, Image, Text, Alert, TouchableHighlight, TouchableOpacity, ScrollView, ImageBackground, Button, Dimensions, FlatList } from 'react-native'
import { Icon } from '@iconify/react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import Modal from "react-native-modal";
import PaymentScreen from './PaymentScreen';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import CustomeButton1 from '../../components/CustomeButton1';
import HorizontalProductList from '../../components/HorizontalProductList';

function CartScreen(props) {
    const insets = useSafeAreaInsets();
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    const green = "green";
    const black = "black";
    const [userLoggedIn, setUserLoggedIn] = useState(false)
    const [offers, setOffers] = useState([{}])
    const [cart, setCart] = useState([{}])
    const [reviewCart, setReviewCart] = useState([{}])
    const [products, setProducts] = useState([{}])
    const [buttonColor, setButtonColor] = useState(black);
    const [text, setText] = useState('Use');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isDeliveryModalVisible, setIsDeliveryModalVisible] = useState(false);
    const [cartPrices, setCartPrices] = useState({})
    const handleModal = () => setIsModalVisible(() => !isModalVisible);
    const [couponDropdown, setCouponDropdown] = useState(false)
    const [selectedOffer, setSelectedOffer] = useState(null)
    const isFocused = useIsFocused();
    const [modalOpen, setModalOpen] = useState(false)
    const [replaceCart, setReplaceCart] = useState(false)

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            AsyncStorage.getItem('token').then(value => {
                if (value.length > 0) {
                    setUserLoggedIn(true)

                    AsyncStorage.getItem('cart').then((value) => {
                        value = JSON.parse(value)
                        console.log("VALUE BEFORE IF", value, typeof value)
                        if (value) {
                            console.log("VALUE-->", value)
                            setCart(value);
                            updateCartAPI(value)
                        } else {
                            console.log("No cart")
                            setCart([]);
                        }
                    });
                }
                else {
                    setUserLoggedIn(false)
                }
            })
        });

        return unsubscribe;
    }, [isFocused, navigation, selectedOffer]);

    useEffect(() => {
        console.log("SELECTED OFFER GOT CHANGED", selectedOffer)
        updateCartAPI(cart)
    }, [selectedOffer])

    async function getCart() {
        const cartFromStorage = JSON.parse(await AsyncStorage.getItem("cart"))
        await updateCartAPI(cartFromStorage)

    }

    function handleColorChange(e) {
        const button = e.target.style.backgroundColor;
        const newButton = e.target.style.backgroundColor;
        const newColor = buttonColor === black ? green : black;
        setButtonColor(newColor);
    }
    const getOffers = async (cartId) => {
        try {
            console.log("CARTTTT IDD")
            // await AsyncStorage.removeItem('cart')
            let token = await AsyncStorage.getItem('token')
            const headers = {
                'x-access-token': token,
                // 'content-type': 'multipart/form-data',
            }
            let res = await axios.get("https://hibee-adminapi.moshimoshi.cloud/admin/offer?cartId=" + cartId, { headers })

            console.log("GET OFFERSS", res?.data?.data)

            setOffers(res.data.data)
        } catch (e) {
            console.log(e)
        }
    }

    const showCart = async () => {
        try {
            let token = await AsyncStorage.getItem('token')
            const headers = {
                'x-access-token': token,
                // 'content-type': 'multipart/form-data',
            }
            let res = await axios.get("https://hibee-cart.moshimoshi.cloud/cart/", { headers }).then((response) => {
                console.log("RESPONSEEE", response?.data?.data, token)

                setCart(response?.data?.data?.items)

            })
        } catch (e) {
            console.log(e)
        }
    }



    const handleChnageTextColor = (e) => {

        const newColor = textColor === "black" ? "green" : "black"
        e.target.style.backgroundColor = newColor
        setTextColor(newColor)
        setText("Applied")
    }

    const showProducts = async () => {
        try {
            let token = await AsyncStorage.getItem("token")
            const headers = {
                'x-access-token': token
            }
            let res = await axios.get("https://hibee-product.moshimoshi.cloud/product", { headers }).then((response) => {
                console.log("jojojojo", response?.data?.data)
                setProducts(response?.data?.data)
            })
        }
        catch (e) {
            console.log(e)
        }
    }

    // useEffect(() => {
    //     getOffers()
    // }, [])

    useEffect(() => {
        showProducts()
    }, [])


    const handleAddToCart = async (productId, qty, price) => {
        // Check if the product already exists in the cart
        const index = cart.findIndex((item) => item.productId === productId);

        // If the product exists, update the qty
        if (index !== -1) {
            const newCart = [...cart];
            newCart[index].qty += qty;
            setCart(newCart);
            await AsyncStorage.setItem('cart', JSON.stringify([...newCart, newItem]));
            await updateCartAPI(newCart)

        } else {
            // If the product does not exist, add it to the cart
            const newItem = { productId, qty, price };
            setCart([...cart, newItem,]);
            await AsyncStorage.setItem('cart', JSON.stringify([...cart, newItem]));
            await updateCartAPI([...cart, newItem])
        }
    };

    const getQuantityInCart = (productId) => {
        const item = cart.find((item) => item.productId === productId);
        console.log("ITEMs", item)
        return item ? item?.qty : 0;
    };

    const handleUpdateQuantity = async (productId, qty) => {
        // Find the index of the product in the cart
        console.log("cart", cart)
        const index = cart.findIndex((item) => item.productId === productId);
        console.log("INDEX", index)
        const newCart = [...cart];
        // If the qty is 0, remove the product from the cart
        if (newCart[index].qty + qty === 0) {
            console.log("QUANTITY", qty)
            const newCart = [...cart];
            newCart.splice(index, 1);
            await updateCartAPI(newCart)
            setCart(newCart);
            await AsyncStorage.setItem('cart', JSON.stringify(newCart));
        } else {
            // Otherwise, update the qty
            const newCart = [...cart];
            console.log("OLD QUANTITY", newCart[index].qty)
            newCart[index].qty = newCart[index].qty + qty;
            await updateCartAPI(newCart)
            setCart(newCart);
            await AsyncStorage.setItem('cart', JSON.stringify(newCart));
        }
    };

    async function updateCartAPI(updatedCart) {
        console.log("UPDATED CART", updatedCart, selectedOffer)
        const token = await AsyncStorage.getItem('token')
        const headers = {
            'x-access-token': token,
        }
        let response
        if (!selectedOffer) {
            response = await axios.put("https://hibee-cart.moshimoshi.cloud/cart/cart-user", {
                products: updatedCart
            }, { headers })
        }
        else {
            response = await axios.put("https://hibee-cart.moshimoshi.cloud/cart/cart-user", {
                products: updatedCart,
                "offerId": selectedOffer?._id
            }, { headers })
        }
        setReviewCart(response?.data?.data?.items)
        setCartPrices(response?.data?.data)
        await getOffers(response?.data?.data?._id)
    }
    const [active, setActive] = useState(false)
    const navigation = useNavigation()

    const handleClick = () => {
        setActive(!active)
        handleModal()
    }
    const Item = ({ name, image, price, quantity, discountedPrice, sizeList, qty, id, mrp }) => (
        <View key={id} style={styles.productsbox}>

            <View>

                <Image source={{ uri: Array.isArray(image) ? image[0].image : image }} height={70} width={70} style={{ alignSelf: "center" }} />
                <Text style={styles.tomatoes}>{name}</Text>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={[styles.tomatotext, { marginLeft: 12 }]}>{sizeList?.size}</Text>
                    <Text style={[styles.tomatotext, { marginLeft: 0 }]}>{sizeList?.unit}</Text>
                </View>

                <Text style={styles.tomatotext1}>₹{price}</Text>
                <Text style={styles.tomatotext2}>₹{mrp}</Text>
                {getQuantityInCart(id) == 0 ?
                    <View >
                        <TouchableOpacity style={styles.adds} onPress={async () => await handleAddToCart(id, 1, price)}>
                            {/* <Image source={require('../../assets/img/cross.png')} style={{ marginBottom: 15, marginTop: -3 }} /> */}
                            <Text style={styles.addtext}>ADD</Text>
                        </TouchableOpacity>


                    </View> :
                    (
                        <View style={[styles.addssubtract1, { alignSelf: "center" }]}>
                            <TouchableOpacity style={styles.adds1} onPress={async () => await handleUpdateQuantity(id, -1)}>
                                <Image source={require('../../assets/img/subtract.png')} style={{ marginBottom: 15, marginTop: 3 }} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.quantityText}>
                                {/* < style={styles.adds1} onPress={() => handleUpdateQuantity(id, -1)}> */}
                                <Text style={{ color: "#12352F" }}>{getQuantityInCart(id)}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.adds2} onPress={async () => await handleUpdateQuantity(id, 1)}>
                                <Image source={require('../../assets/img/cross.png')} style={{ marginBottom: 15, marginTop: -3 }} />
                            </TouchableOpacity>
                        </View>

                    )
                }
            </View>
        </View >
    );

    const CartItem = ({ name, image, price, quantity, cutout_price, sizeList, id, mrp }) => (

        <View key={id} style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", marginBottom: 15, backgroundColor: "white", width: "100%" }}>
            <Image source={{ uri: Array.isArray(image) ? image[0]?.image : image }} style={{ marginTop: 24, marginLeft: 0, height: 40, width: 40, borderRadius: 20 }} resizeMode='contain' />
            <View style={{ marginLeft: 0, marginTop: 20, width: "25%",backgroundColor:"white" ,flexDirection:"column",}}>
                <Text style={styles.freshtext}>{name}</Text>
                {/* <Text style={styles.freshtext}>{sizeList?.size}</Text> */}
                {/* <View style={{ flexDirection: 'row',backgroundColor:"white",height:32 }}>
                    <Text style={[styles.tomatotext, { marginLeft: 12 }]}>{sizeList?.size}</Text>
                    <Text style={[styles.tomatotext, { marginLeft: 0 }]}>{sizeList?.unit}</Text>
                </View> */}
                {/* <Text style={[styles.tomatotext,{marginLeft:12}]}>{sizeList?.size}</Text>
                <Text style={[styles.tomatotext,{marginLeft:0}]}>{sizeList?.unit}</Text> */}

            </View>
            <View style={{ marginTop: 15, marginLeft: 35, flexDirection: 'row' }}>
                {
                    // getQuantityInCart(_id) == 0

                    <View style={styles.addssubtract}>
                        <TouchableOpacity style={styles.adds1} onPress={async () => await handleUpdateQuantity(id, -1)}>
                            <Image source={require('../../assets/img/subtract.png')} style={{ marginBottom: 15, marginTop: 3 }} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.quantityText}>
                            {/* < style={styles.adds1} onPress={() => handleUpdateQuantity(id, -1)}> */}
                            <Text style={{ color: "#12352F" }}>{quantity}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.adds2} onPress={async () => await handleUpdateQuantity(id, 1)}>
                            <Image source={require('../../assets/img/cross.png')} style={{ marginBottom: 15, marginTop: -3 }} />
                        </TouchableOpacity>
                    </View>

                }
                <View>
                    <Text style={styles.twenty}>₹{price}</Text>
                    <Text style={styles.twentytwo}>₹{mrp * quantity}
                    </Text>
                </View>
            </View>
        </View>
    )

    const OffersItem = ({ item }) => (
        <View style={styles.topbox1}>
            <>
                <View>
                    <Text style={styles.applytext}>{item?.title}</Text>
                    <Text style={styles.applytext2}>{item?.offer_code}</Text>
                </View>
                <TouchableOpacity onPress={handleClick} style={{ backgroundColor: active ? "#359975" : "#12352F", height: 40, width: 60, alignSelf: "center", marginRight: 20 }}>
                    <View style={styles.use}>
                        <Text style={{
                            color: active ? "white" : "yellow"
                            , alignText: "center", justifyContent: "center"

                        }}>{active ? "Applied" : "Use"}</Text>
                    </View>
                </TouchableOpacity>
            </>
        </View>)
    return (
        <SafeAreaProvider style={{ flex: 1 }}>

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', height: 52, backgroundColor: "#FFFFFF", shadowColor: '#171717', shadowOffset: { width: -2, height: 4 }, shadowOpacity: 0.2, marginTop: insets.top }}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image source={require('../../assets/img/leftarrow.png')} style={{ marginLeft: 20, marginTop: 15 }} />
                </TouchableOpacity>
                <Text style={styles.vegtext}>Review cart</Text>
            </View>
            {
                userLoggedIn ?
                    <>
                        {cart.length > 0 ?
                            <ScrollView>
                                <View style={styles.yelbox}>
                                    {selectedOffer ?

                                        cartPrices?.offerDiscount ?
                                            <View>
                                                <Text style={[styles.savetext,]}>₹{cartPrices?.offerDiscount} saved on this order!</Text>
                                                {/* <Text style={styles.savetext1}></Text> */}
                                                <TouchableOpacity onPress={() => navigation.goBack()}>
                                                <Text style={styles.savetext2}>Shop more </Text>
                                                </TouchableOpacity>
                                            </View>
                                            : <View>
                                                <Text style={[styles.savetext,]}>{selectedOffer?.offer_code} not applied!</Text>
                                                <Text style={styles.savetext1}>This code is only applicable for orders above {selectedOffer?.min_order_value}</Text>
                                                <TouchableOpacity onPress={() => navigation.goBack()}>
                                                <Text style={styles.savetext2}>Shop more </Text>
                                                </TouchableOpacity>
                                            </View>
                                        :


                                        offers[0].applicable ?
                                            <View>
                                                <Text style={[styles.savetext, { width: '100%', height: 50 }]}>Apply {offers[0]?.offer?.offer_code} and Save ₹{offers[0]?.discount}</Text>
                                                {/* <Text style={styles.savetext}>Save ₹{offers[0]?.discount} </Text> */}
                                                <TouchableOpacity onPress={() => navigation.goBack()}>
                                                    <View style={{ flexDirection: "row" }}>
                                                        <Text style={styles.savetext2}>Continue shopping </Text>
                                                        <Image source={require("../../assets/img/LabelLeft.png")} style={{ height: 6, width: 6, marginTop: 15 }} />
                                                    </View>
                                                </TouchableOpacity>
                                            </View> :
                                            <View>
                                                <Text style={[styles.savetext, { width: '100%', height: 50 }]}>Save ₹{offers[0]?.discount} by adding ₹{offers[0]?.addMore} to cart</Text>
                                                {/* <Text style={styles.savetext1}>₹{cartPrices?.offerDiscount} saved on this order </Text> */}
                                                <TouchableOpacity onPress={() => navigation.goBack()}>
                                                    <Text style={styles.savetext2}>Continue shopping </Text>
                                                    {/* <Image source={require("../../assets/img/LabelLeft.png")} /> */}
                                                </TouchableOpacity>
                                            </View>
                                    }
                                    <View style={{ height: "100%", width: 50, position: "absolute", right: 0 }}>
                                        <Image source={require('../../assets/img/hexcart.png')} style={{ height: "100%", width: 70, position: "absolute", right: 0 }} />
                                    </View>
                                </View>
                                <Pressable onPress={() =>
                                    //  setCouponDropdown(!couponDropdown)
                                    navigation.navigate("CouponList", { cartId: cartPrices?._id, "setSelectedOffer": setSelectedOffer })
                                } >
                                    {selectedOffer ?
                                        <View style={styles.topbox}>
                                            <Image source={require('../../assets/img/discount.png')} style={{ marginLeft: 10, marginTop: 15 }} />
                                            <View>
                                                {cartPrices?.offerDiscount ?
                                                    <>
                                                        <Text style={styles.applytext}>Coupon Applied</Text>
                                                        <Text style={[styles.applytext2, { color: "#359975" }]}>Saved ₹{cartPrices?.offerDiscount} with {cartPrices?.offer?.offer_code}</Text>
                                                    </> :
                                                    <>
                                                        <Text style={styles.applytext}>{selectedOffer.offer_code} is not applied</Text>
                                                        <Text style={[styles.applytext2, { color: "red" }]}>This coupon is valid only on orders worth {selectedOffer?.min_order_value} or more</Text>
                                                    </>
                                                }
                                            </View>
                                            <TouchableOpacity onPress={() => {
                                                setSelectedOffer(null)
                                            }} style={{ right: 20, position: 'absolute', top: 11, }}>
                                                <Text style={[styles.applytext, { color: "red", fontSize: 12 }]}>Remove</Text>
                                            </TouchableOpacity>
                                            {/* <Image source={require('../../assets/img/rightarrow.png')} style={{ marginLeft: "70%", marginTop: 28 }} /> */}
                                        </View>
                                        :
                                        <View style={styles.topbox}>
                                            <Image source={require('../../assets/img/discount.png')} style={{ marginLeft: 10, marginTop: 15 }} />
                                            <View style={{ flexDirection: "row", width: "100%" }}>
                                                <View style={{ flex: 5 }}>
                                                    <Text style={styles.applytext}>Apply Coupon</Text>
                                                    <Text style={styles.applytext2}>Save ₹{offers[0]?.discount} with {offers[0]?.offer?.offer_code}</Text>
                                                </View>
                                                <View style={{ flex: 1, marginTop: 27 }}>
                                                    <Image source={require("../../assets/img/LabelLeft.png")} style={{ height: 6, width: 6 }} />
                                                </View>
                                            </View>
                                            {/* <Image source={require('../../assets/img/rightarrow.png')} style={{ marginLeft: "70%", marginTop: 28 }} /> */}
                                        </View>}
                                </Pressable>
                                {
                                    couponDropdown ?
                                        <FlatList data={offers} renderItem={OffersItem} />
                                        : null
                                }
                                <View style={styles.midbox}>

                                    <View style={{ display: 'flex', flexDirection: 'row' }}>
                                        <Image source={require('../../assets/img/baskin.png')} style={{ marginLeft: 15, marginTop: 15, height: 19, width: 19 }} />
                                        <Text style={[styles.reviewtext, { marginTop: 15 }]}>Review Items</Text>

                                    </View>
                                    <FlatList horizontal={false} data={reviewCart} scrollEnabled={true} renderItem={({ item }) => <CartItem scrollEnabled={false} name={item.product_name} image={item.images} price={item.discountedPrice} quantity={item.qty} discountedPrice={item.discountedPrice} sizeList={item.sizeList} id={item._id} mrp={item?.price} />}
                                    />
                                </View>


                                <View style={{ display: "flex", flexDirection: "row", backgroundColor: "white", padding: 10 }}>
                                    <Image source={require('../../assets/img/baskin.png')} style={{ height: 19, width: 19, marginLeft: 6, }} />

                                    <Text style={styles.reviewtext}>Your last minute add-ons</Text>
                                </View>
                                <View style={styles.lowerbox}>

                                    <View style={{ display: 'flex', flexDirection: 'row' }}>

                                        <HorizontalProductList products={products} color="#F2F1F9" cart={cart} setCart={setCart} modalOpen={modalOpen} setModalOpen={setModalOpen} type='normal' replaceCart={replaceCart} setReplaceCart={setReplaceCart} />

                                    </View>

                                </View>
                                <View style={{ flex: 1, backgroundColor: "white", paddingBottom: 20 }}>
                                    <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", marginRight: 15 }}>
                                        <Text style={styles.incltext}>Items total (incl. taxes)</Text>
                                        <Text style={styles.incltext}>₹{cartPrices?.subTotal}</Text>
                                    </View>
                                    <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", marginRight: 15}}>
                                        <Text style={styles.incltext}>Packaging charge</Text>
                                        <Text style={[styles.incltext, { color: "green" }]}>FREE</Text>
                                    </View>
                                    <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", marginRight: 15 }}>
                                        <Text style={styles.incltext}>Delivery charge</Text>
                                        <Text style={[styles.incltext, { color: "green" }]}>FREE</Text>
                                    </View>
                                    <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", marginRight: 15 }}>
                                        <Text style={styles.incltext}>Discount</Text>
                                        <Text style={[styles.incltext, { color: "green" }]}>-₹{cartPrices?.subTotal - cartPrices?.afterDiscount}</Text>
                                    </View>
                                    <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", marginRight: 15 }}>
                                        <Text style={[styles.incltext, { color: "#12352F" }]}>Bill Total</Text>
                                        <Text style={[styles.incltext, { color: "#12352F" }]}>₹{cartPrices?.afterDiscount}</Text>
                                    </View>
                                    <Text style={styles.incltext}>Hooray! You saved ₹{cartPrices?.subTotal - cartPrices?.afterDiscount}!</Text>
                                </View>

                                <Image source={require('../../assets/img/zigzag.png')} style={{ width: "100%" }} />

                                <View style={styles.cancel}>

                                    <Text style={styles.canceltext}>Cancellation Policy</Text>
                                    <Text style={styles.policytext}>Orders cannot be cancelled once packed for delivery. In case of unexpected delays, a refund will be provided, if applicable.</Text>
                                </View>

                                <View style={{ width: "100%", height: 202 }}>

                                </View>

                                <Modal isVisible={isModalVisible}>

                                    <View style={{
                                        display: "flex", width: 308,
                                        alignItems: "center", justifyContent: "center", borderRadius: 12, backgroundColor: "white", alignSelf: "center", boxShadow: 0,
                                        borderColor: "rgba(0, 0, 0, 0.12)", shadowColor: "rgba(0, 0, 0, 0.12)", elevation: 5, marginBottom: 30
                                    }}>

                                        <Image source={require('../../assets/img/hexleft.png')} style={{ position: "absolute", left: 0, top: 0 }} />
                                        <Image source={require('../../assets/img/hexcenter.png')} style={{ position: "absolute", left: 35, top: 0 }} />
                                        <Image source={require('../../assets/img/hexright.png')} style={{ position: "absolute", left: 8, top: 25 }} />

                                        <Text style={styles.couponmodal}>Coupon Applied!!</Text>
                                        <Text style={styles.couponmodal1}>You are saving ₹20 on your order!</Text>
                                        <Image source={require('../../assets/img/hexleft.png')} style={{ position: "absolute", right: 0, bottom: 0 }} />
                                        <Image source={require('../../assets/img/hexcenter.png')} style={{ position: "absolute", right: 35, bottom: 0 }} />
                                        <Image source={require('../../assets/img/hexright.png')} style={{ position: "absolute", right: 8, bottom: 25 }} />
                                        <TouchableOpacity onPress={handleModal} style={{ position: "absolute", right: 10, top: 10 }}>
                                            <Image source={require("../../assets/img/closemodal.png")} />
                                        </TouchableOpacity>
                                    </View>

                                </Modal>

                            </ScrollView > : <View style={{ justifyContent: "center" }}>
                                <Image source={require('../../assets/img/emptycart.png')} style={{
                                    marginBottom: 15, marginTop: 80,
                                    width: '25%',
                                    height: undefined,
                                    aspectRatio: 0.69, //this is not a joke, it was the actual ratio of the png
                                    alignSelf: "center"
                                }} />
                                <Text style={{ fontSize: 20, alignSelf: 'center', }}> Your Cart is Empty</Text>
                                <Text style={{ fontSize: 14, width: 150, marginTop: 12, alignSelf: 'center', }}> Add items to cart and they will show up here.</Text>
                            </View>
                        }</> : <View style={{ justifyContent: "flex-start", width: "100%", height: "100%" }}>
                        <Text style={{ alignSelf: "center", marginTop: 150, color: "#3C5F58" }}>
                            You aren't logged in yet
                        </Text>
                        <CustomeButton1
                            title="Login"
                            btnStyle={{ backgroundColor: "#FEBF22", width: "90%", alignSelf: "center" }}
                            // disabled={phone.length == 10 ? false : true}
                            navigationPath={() => { navigation.navigate('LoginScreen') }}
                        />
                    </View>}

            {userLoggedIn ? <>{cart?.length > 0 ? <View style={{ position: "absolute", bottom: 0, width: "100%", backgroundColor: "white", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, }}>

                <View style={{ flexDirection: "row", padding: 10, marginLeft: 12 }}>

                    <View style={{ marginTop: 20 }}>
                        <Image source={require('../../assets/img/locationcart.png')} styles={{ marginTop: 0 }} />
                    </View>
                    <View>

                        <Text style={{ fontSize: 12, color: "#3C5F58z", marginTop: 10, marginLeft: 20 }}>
                            Deliver to Prestige Layout
                        </Text>
                        <Text style={{ fontSize: 12, color: "#3C5F58", marginTop: 10, marginLeft: 20, width: 300 }}>
                            Banavadi Road, Near Malani Market, Shankarpura, 560056
                        </Text>
                    </View>
                </View>
                <TouchableOpacity onPress={() => {
                    setIsDeliveryModalVisible(true)
                    // navigation.navigate("Payment Screen")}
                }
                }>
                    <View style={[styles.blackbtn, { flexDirection: "row" }]}>
                        <Text style={[styles.blacktext, { marginLeft: 20, flex: 5 }]}>PROCEED TO PAY</Text>
                        <View style={{ flex: 1, flexDirection: "row", marginTop: 12, }}>
                            <Text style={{ color: "#FFD365", }}>
                                ₹{cartPrices?.afterDiscount}
                            </Text>
                            <Image source={require("../../assets/img/LabelLeftYellow.png")} style={{ height: 5, width: 7, marginTop: 8, marginLeft:3 }} />
                        </View>
                    </View>
                </TouchableOpacity>
            </View> : null}</> : null}
            <ScrollView>
                <Modal
                    transparent={true}
                    style={{ margin: 0 }}
                    visible={isDeliveryModalVisible}
                    animationOutTiming={0}
                    onRequestClose={() => {
                        // Alert.alert('Modal has been closed.');
                        setIsDeliveryModalVisible(!isDeliveryModalVisible);
                    }}>
                    <TouchableOpacity onPress={() => setIsDeliveryModalVisible(false)}>

                        <View
                            style={{
                                backgroundColor: 'rgba(100,100,100, 0.5)',
                                width: '100%',
                                height: "100%"
                            }}
                        >
                        </View>
                    </TouchableOpacity>
                    <PaymentScreen setIsDeliveryModalVisible={setIsDeliveryModalVisible} />
                </Modal>
            </ScrollView>
        </SafeAreaProvider >

    )
}


const styles = StyleSheet.create({
    absolute: {
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
    },
    // adds: {
    //     alignItems: 'center',
    //     justifyContent: 'center',
    //     backgroundColor: 'white',
    //     border: 2,
    //     borderColor: '#3C5F58',
    //     borderWidth: 1,
    //     paddingVertical: 10,
    //     width: '20%',
    //     height: 38,
    //     borderRadius: 4,
    //     color: '#3C5F58',
    //     backgroundColor: '#F1F9F3',
    //     marginTop: 5
    //     // marginLeft: -40
    // },
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
        // marginTop: -5,
        paddingVertical: 4,

    },
    addssubtract: {
        flexDirection: 'row',
        border: 2,
        borderColor: '#3C5F58',
        // color: '',
        borderWidth: 1,
        // padding: 10,
        width: 65,
        height: 38,
        borderRadius: 4,
        color: '#3C5F58',
        backgroundColor: '#F1F9F3',
        marginTop: 15,
        marginLeft: 30,
        justifyContent: "space-evenly"
        // marginBottom:0
        // flex:1
    },
    addssubtract1: {
        flexDirection: 'row',
        border: 2,
        borderColor: '#3C5F58',
        // color: '',
        borderWidth: 1,
        // padding: 10,
        width: "90%",
        height: 38,
        borderRadius: 4,
        color: '#3C5F58',
        backgroundColor: '#F1F9F3',
        marginTop: 5,
        justifyContent: "space-evenly",
        // marginLeft: 30,
        // marginBottom:0
        // flex:1
    },
    adds1: {
        alignSelf: 'center',
        borderColor: '#12352F',
        paddingVertical: 16,
        // width: '33%',
        height: "100%",
        // backgroundColor: 'black',
    },
    adds2: {
        alignSelf: 'center',
        borderColor: '#12352F',
        paddingVertical: 16,
        // width: '33%',
        height: "100%",
        // backgroundColor: 'black',
    },
    quantityText: {
        // alignSelf: 'center',
        height: "100%",
        color: '#3C5F58',
        // backgroundColor: 'yellow',
        paddingHorizontal: 5,
        marginTop: 10,
        // width:"33%"

        // paddingVertical: 10
    },
    adds: {
        alignItems: 'center',
        justifyContent: 'center',
        border: 2,
        borderColor: '#3C5F58',
        borderWidth: 1,
        width: '90%',
        height: 38,
        borderRadius: 4,
        color: '#3C5F58',
        backgroundColor: '#F1F9F3',
        marginTop: 5,
        marginHorizontal: 12,
        marginLeft: "5%"
    },
    topbox: {
        width: "100%",
        height: 66,
        backgroundColor: 'white',
        marginTop: 5,
        display: 'flex',
        flexDirection: 'row',
    },
    tomatoes: {
        height: 34,
        fontFamily: 'DM Sans',
        //fontWeight: 500,
        fontSize: 12,
        /* or 18px */
        color: '#12352F',
        marginTop: 10,
        marginLeft: 10,

    },
    couponmodal: {
        height: 34,
        fontFamily: 'DM Sans',
        //fontWeight: 700,
        fontSize: 20,
        /* or 18px */
        color: '#111111',
        marginTop: 10,
        marginLeft: 10,
    },
    couponmodal1: {
        height: 34,
        fontFamily: 'DM Sans',
        //fontWeight: 400,
        fontSize: 14,
        color: '#3C5F58',
        marginTop: 5,
        marginLeft: 10,
    },
    tomatotext: {
        height: 15,
        fontFamily: 'DM Sans',
        //fontWeight: 400,
        fontSize: 12,
        /* or 18px */
        color: '#999999',
        marginTop: -15,
        // marginLeft: 10,
    },
    tomatotext1: {
        height: 15,
        fontFamily: 'DM Sans',
        //fontWeight: 700,
        fontSize: 12,
        /* or 18px */
        color: '#000000',
        marginLeft: 10,
    },
    tomatotext2: {
        height: 15,
        fontFamily: 'DM Sans',
        //fontWeight: 400,
        fontSize: 10,
        /* or 18px */
        color: '#999999',

        marginLeft: 10,
        textDecorationLine: "line-through"
    },

    productsbox: {
        width: 94,
        height: 220,
        borderWidth: 0.5,
        borderColor: "rgba(210, 209, 209, 0.29)",
        borderRadius: 6,
        marginTop: 15,


    },

    yelbox: {
        width: "100%",
        height: 100,
        backgroundColor: '#FEF9EC',
        borderRadius: 6,
        // display: "flex",
        flexDirection: 'row',

    },
    incltext: {
        height: 16,
        fontFamily: 'DM Sans',
        //fontWeight: 500,
        fontSize: 12,
        /* or 18px */
        color: '#999999',
        marginTop: 6,
        marginLeft: 30,
    },
    incltext1: {
        height: 14,
        fontFamily: 'DM Sans',
        //fontWeight: 500,
        fontSize: 12,
        /* or 18px */
        color: '#999999',
        marginTop: 10,
        marginLeft: 30,
        textDecorationLine: "line-through"
    },

    topbox1: {
        width: "100%",
        height: 66,
        backgroundColor: 'white',
        marginTop: 5,
        display: 'flex',
        flexDirection: 'row',
        // marginLeft: ,
        justifyContent: "space-between"
    },
    addbox1: {
        width: 65,
        height: 30,
        borderWidth: 0.8,
        borderRadius: 4,
        borderColor: '#8F8F8F',
        marginLeft: 80,
        marginTop: 20,
        display: 'flex',
        flexDirection: 'row'

    },
    greenbox: {
        width: 65,
        height: 30,

        borderWidth: 0.8,
        borderColor: ' #8F8F8F',
        borderRadius: 4
    },
    use: {
        width: 54,
        height: 22,

        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 12,
        marginRight: 10

    },
    applytext: {
        height: 18,
        fontFamily: 'DM Sans',
        //fontWeight: 700,
        fontSize: 14,
        /* or 18px */
        color: '#505462',
        marginTop: 10,
        marginLeft: 30
    },
    applytext2: {
        height: 13,
        fontFamily: 'DM Sans',
        //fontWeight: 400,
        fontSize: 10,
        /* or 18px */
        color: '#999999',
        marginTop: 5,
        marginLeft: 30,
    },
    midbox: {
        width: "100%",
        backgroundColor: 'white',
        marginTop: 5,
        display: 'flex',
        flexDirection: 'column',
        marginBottom: 15
    },

    reviewtext: {
        height: 18,
        fontFamily: 'DM Sans',
        //fontWeight: 700,
        fontSize: 14,
        color: '#3C5F58',
        marginLeft: 15,
    },
    freshtext: {
        height: 26,
        fontFamily: 'DM Sans',
        //fontWeight: 500,
        fontSize: 10,
        /* or 18px */
        color: '#12352F',

        marginLeft: 45,
    },
    savetext: {
        height: 26,
        fontFamily: 'DM Sans',
        //fontWeight: 700,
        fontSize: 15,
        /* or 18px */
        color: '#12352F',
        marginTop: 10,
        marginLeft: 25,
        paddingTop:10
        
        
    },
    savetext1: {
        height: 26,
        fontFamily: 'DM Sans',

        fontSize: 10,
        color: '#12352F',
        marginLeft: 25
    },
    savetext2: {
        height: 26,
        fontFamily: 'DM Sans',
        fontWeight: '700',
        fontSize: 10,
        color: '#12352F',
        marginLeft: 25,
        textDecorationLine: 'underline',
        marginTop:10

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
        marginLeft: 250,
        marginTop: -36,
        display: 'flex',
        flexDirection: 'row',


    },
    twenty: {
        height: 32,
        fontFamily: 'DM Sans',
        //fontWeight: 500,
        fontSize: 12,
        /* or 18px */
        color: '#12352F',
        marginTop: 20,
        marginLeft: 25,

    },
    twentytwo: {
        height: 26,
        fontFamily: 'DM Sans',
        //fontWeight: 500,
        fontSize: 10,
        /* or 18px */
        color: '#999999',
        marginTop: -15,
        marginLeft: 27,
        textDecorationLine: 'line-through',
        textDecorationStyle: 'solid'
    },
    lowerbox: {


        backgroundColor: 'white',
        display: "flex",
        padding: 20,
        flex: 1,
        flexDirection: "column",


    },


    //resuable component====>


    apple: {
        width: 80,
        height: 80,
        backgroundColor: 'white',
        borderRadius: 6,
        marginLeft: 15,
        marginTop: 5,
        padding: 5,
        marginTop: 15,
        marginBottom: 15,

        display: "flex",
        flexDirection: "row"
    },
    text: {
        height: 34,
        fontFamily: 'DM Sans',
        //fontWeight: 600,
        fontSize: 12,
        marginTop: 8,
        color: 'black'
    },
    text1: {
        height: 14,
        fontFamily: 'DM Sans',
        //fontWeight: 500,
        fontSize: 10,
        color: 'black',
        marginTop: 3
    },
    text2: {
        height: 18,
        fontFamily: 'DM Sans',
        //fontWeight: 500,
        fontSize: 14,
        /* or 18px */
        color: '#000000',
        marginTop: 3,
        marginTop: 5
    },
    container: {

        justifyContent: 'center',
        paddingHorizontal: 10,
        width: 32,
        height: 28,
        marginLeft: 60,


        borderColor: '#12352F',
        marginTop: -55,
    },
    addsboxo: {
        alignItems: 'center',
        backgroundColor: 'white',
        border: 2,
        borderColor: '#12352F',
        borderWidth: 1,
        padding: 10,
        width: 32,
        height: 28,
        borderRadius: 4,
        color: 'black',
        backgroundColor: '#F1F9F3'

    },
    applytextend: {
        height: 18,
        fontFamily: 'DM Sans',
        //fontWeight: 700,
        fontSize: 14,
        /* or 18px */
        color: '#505462',
        marginTop: 10,

        marginLeft: 250,
        alignItems: "flex-end",
        display: 'flex',
    },
    cancel: {
        width: 400,
        height: 80,
        backgroundColor: 'white',
        padding: 15,
        marginTop: 10


    },
    cancel1: {
        width: 400,
        height: 80,
        backgroundColor: 'white',
        marginTop: 2,
        padding: 5,

    },
    canceltext: {
        height: 20,
        fontFamily: 'DM Sans',
        //fontWeight: 500,
        fontSize: 14,
        color: '#12352F',
        marginTop: 5

    },
    policytext: {
        fontFamily: 'DM Sans',
        //fontWeight: 500,
        fontSize: 10,
        marginTop: 5,
        color: '#999999',
    },
    canceltext1: {
        height: 20,
        fontFamily: 'DM Sans',
        //fontWeight: 500,
        fontSize: 12
        ,
        color: '#12352F',
        marginTop: 5

    },
    lastBox: {
        width: 70,
        height: 30,
        borderRadius: 4,
        borderColor: '#8F8F8F',
        borderWidth: 0.8,
        marginLeft: 290,
        marginTop: -40,
        padding: 5

    },
    blackbtn: {
        width: "90%",
        height: 42,
        backgroundColor: '#12352F',
        borderRadius: 10,
        marginTop: 25,
        alignSelf: "center",
        // marginRight:"5%",
        marginBottom: 18,

    },
    blacktext: {
        height: 18,
        fontFamily: 'DM Sans',
        //fontWeight: 700,
        fontSize: 14,
        color: '#FEBF22',
        marginTop: 0,

        alignSelf: "center"

    }, linebottom: {
        width: 106,
        height: 0,
        borderColor: '#707070',
        borderWidth: 2,
        borderRadius: 20,
        marginLeft: 140,
        marginTop: 15,
        marginBottom: 10,
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
export default CartScreen
