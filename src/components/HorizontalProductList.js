import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    Image,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Keyboard,
    FlatList,
    Pressable,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    SafeAreaProvider,
    useSafeAreaInsets,
} from 'react-native-safe-area-context';
import {
    useFocusEffect,
    useNavigation,
    useIsFocused,
} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HorizontalProductList = props => {
    const {
        cart,
        setCart,
        cartType,
        modalOpen,
        setModalOpen,
        type,
        replaceCart,
        setReplaceCart,
    } = props;
    const isFocused = useIsFocused();
    const navigation = useNavigation();
    const [tempCart, setTempCart] = useState([]);
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            AsyncStorage.getItem('cart').then(value => {
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
        console.log('REPLACE VCARRTTTY', replaceCart, tempCart);
        if (replaceCart == true && tempCart.length > 0) {
            console.log('CONDITION TRUE');
            setCart(tempCart);
            setReplaceCart(false);
            setModalOpen(false);
            setTempCart([]);
            await AsyncStorage.setItem('cartType', type);
        } else {
            setModalOpen(false);
            console.log('CONDITION FAILED');
        }
    }
    useEffect(() => {
        replaceItems();
    }, [replaceCart]);
    const [products, setProducts] = useState([props?.products]);
    const handleAddToCart = async (productId, qty, price) => {
        // Check if the product already exists in the cart
        const newItem = { productId, qty, price };
        let globalCartType = await AsyncStorage.getItem('cartType');
        console.log('CARTTGH', cart);

        if (globalCartType != type && cart.length !== 0) {
            console.log('GLOBAL AND CURRENT', globalCartType, type);
            if (tempCart.length == 0) {
                setTempCart([newItem]);
                setModalOpen(true);
            } else {
                setModalOpen(true);
            }
        } else {
            if (cart.length == 0) {
                await AsyncStorage.setItem('cartType', type);
                console.log('TYPE IS SET');
            }
            const index = cart.findIndex(item => item.productId === productId);
            const newItem = { productId, qty, price };
            console.log('NEWITEMS', newItem);
            await AsyncStorage.setItem('cart', JSON.stringify([newItem]));

            if (cartType && cartType !== type) {
                // Show the popup for cart type mismatch
                await AsyncStorage.setItem('cartModelOpen', 'open');
            }
            if (cartType !== type) {
                await AsyncStorage.setItem('cartModelOpen', 'open');
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
                    await AsyncStorage.setItem(
                        'cart',
                        JSON.stringify([...cart, newItem]),
                    );
                    setCart([...cart, newItem]);
                }
            }
        }
    };
    const getQuantityInCart = productId => {
        const item = cart?.find(item => item.productId === productId);
        return item ? item.qty : 0;
    };
    const handleUpdateQuantity = async (productId, qty) => {
        // Find the index of the product in the cart
        const index = cart.findIndex(item => item.productId === productId);
        const newCart = [...cart];
        // If the qty is 0, remove the product from the cart
        if (newCart[index].qty + qty === 0) {
            newCart.splice(index, 1);
            console.log(newCart, 'NEW CART');
            await AsyncStorage.setItem('cart', JSON.stringify(newCart));
            setCart(newCart);
        } else {
            // Otherwise, update the qty
            const newCart = [...cart];
            console.log('OLD qty', newCart[index].qty);
            newCart[index].qty = newCart[index].qty + qty;
            await AsyncStorage.setItem('cart', JSON.stringify(newCart));
            setCart(newCart);
        }
    };
    const Item = ({ el }) => (
        <View
            style={[
                styles.applebig,
                { backgroundColor: props?.color, marginLeft: 20, borderRadius: 6 },
            ]}>
            <TouchableOpacity
                onPress={() =>
                    navigation.navigate('CategoryNavigator', {
                        screen: 'Product',
                        params: { productId: el?._id, type },
                        initial: false,
                    })
                }>
                <View
                    style={{
                        display: 'flex',
                        alignSelf: 'flex-end',
                        width: 52,
                        height: 18,
                        backgroundColor: '#12352F',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 4,
                    }}>
                    <Text
                        style={{
                            color: '#FFF15C',
                            fontSize: 10,
                            fontFamily: 'DM Sans',
                            fontWeight: '600',
                            padding: 2,
                        }}>
                        {((el?.price - el?.discountedPrice) / el?.price).toFixed(2) * 100 +
                            '% OFF'}
                    </Text>
                </View>
                <Image
                    source={{
                        uri: Array.isArray(el?.images) ? el.images[0]?.image : el.image,
                    }}
                    width={50}
                    height={50}
                    style={{ marginTop: 10, alignSelf: 'center' }}
                    resizeMode={'contain'}
                />
                <Text style={[styles.text, { marginTop: 10, width: 120 }]}>
                    {el?.product_name}
                </Text>
                <View style={{display:'flex', flexDirection:'row'}}>
                <Text style={[styles.text1, { marginTop: 5,margin:2 }]}>{el?.sizeList?.size}</Text>
                <Text style={[styles.text1, { marginTop: 5 ,margin:2}]}>{el?.sizeList?.unit}</Text>
                </View>
               
                <Text style={[styles.text2, { marginTop: 10 }]}>
                    ₹{el?.discountedPrice}
                </Text>
                <Text
                    style={[
                        styles.text2,
                        {
                            textDecorationLine: 'line-through',
                            textDecorationStyle: 'solid',
                            color: '#999999',
                            marginTop: 0,
                            fontSize: 10,
                        },
                    ]}>
                    ₹{el?.price}
                </Text>
                <View>
                    {getQuantityInCart(el?._id) == 0 ? (
                        <View>
                            <TouchableOpacity
                                style={styles.adds}
                                onPress={() =>
                                    handleAddToCart(el?._id, 1, el?.discountedPrice, 'superfast')
                                }>
                                {/* <Image source={require('../../assets/img/cross.png')} style={{ marginBottom: 15, marginTop: -3 }} /> */}
                                <Text style={styles.addtext}>ADD</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={styles.addssubtract}>
                            <TouchableOpacity
                                style={styles.adds1}
                                onPress={async () => await handleUpdateQuantity(el?._id, -1)}>
                                <Image
                                    source={require('../assets/img/subtract.png')}
                                    style={{ marginBottom: 15, marginTop: 3 }}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.quantityText}>
                                {/* < style={styles.adds1} onPress={() => handleUpdateQuantity(el?._id, -1)}> */}
                                <Text style={{ color: '#12352F' }}>
                                    {getQuantityInCart(el?._id)}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.adds2}
                                onPress={async () => await handleUpdateQuantity(el?._id, 1)}>
                                <Image
                                    source={require('../assets/img/cross.png')}
                                    style={{ marginBottom: 15, marginTop: -3 }}
                                />
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </TouchableOpacity>
        </View>
    );

    return (
        <>
            {/* {
              header ?
                  <View style={{ flexDirection: "row", width: "100%", }}>
                      <Text style={styles.besttext}>{data?.name}</Text>
                      <TouchableOpacity style={{ flexDirection: "row", }}>
                          <Text style={[, { fontSize: 14, fontWeight: 'bold', marginTop: 28, marginLeft: "50%", marginBottom: 10, color: "#3C5F58", fontWeight: 500, }]}>
                              View All
                          </Text>
                          <Image source={require('../assets/img/arrow_circle_right.png')} style={{ height: 24, width: 24, marginTop: 24, marginLeft: 3 }} />
                      </TouchableOpacity>
                  </View> : null
          } */}

            <FlatList
                horizontal={true}
                data={props?.products}
                renderItem={({ item }) => (
                    <Item el={item} showsHorizontalScrollIndicator={false} />
                )}
                ListHeaderComponent={<View></View>}
                ListFooterComponent={
                    <View
                        style={[
                            styles.applebig,
                            { justifyContent: 'center', backgroundColor: 'white' },
                        ]}>
                        <TouchableOpacity
                            style={{ flexDirection: 'row' }}
                            onPress={() => {
                                navigation.navigate('CategoryNavigator', {
                                    screen: 'ProductListPage',
                                    params: { products: props.products },
                                    initial: false,
                                });
                            }}>
                            <Text
                                style={[
                                    ,
                                    {
                                        fontSize: 14,
                                        fontWeight: 'bold',
                                        marginTop: 10,
                                        marginLeft: 10,
                                        marginBottom: 10,
                                        color: '#3C5F58',
                                        fontWeight: 500,
                                    },
                                ]}>
                                View All
                            </Text>
                            <Image
                                source={require('../assets/img/arrow_circle_right.png')}
                                style={{ height: 24, width: 24, marginTop: 6, marginLeft: 3 }}
                            />
                        </TouchableOpacity>
                    </View>
                }
            />
        </>
    );
};

export default HorizontalProductList;
const styles = StyleSheet.create({
    applebig: {
        width: 118,
        height: 240,
        // backgroundColor: 'white',
        borderRadius: 2,
        padding: 10,
        // marginTop: 50,
        marginBottom: 10,
        // borderWidth: 0.5,
        // borderColor: '#F5F5F5'
        // margin: 2,
        // padding: 5,
    },
    text: {
        height: 18,
        fontFamily: 'DM Sans',
        fontWeight: '500',
        fontSize: 14,
        /* or 18px */
        color: '#3C5F58',
        marginTop: 25,
    },

    text1: {
        height: 18,
        fontFamily: 'DM Sans',
        fontWeight: '500',
        fontSize: 10,
        /* or 18px */
        color: '#3C5F58',
        marginTop: 3,
    },
    text2: {
        height: 18,
        fontFamily: 'DM Sans',
        fontWeight: '500',
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
        marginTop: 5,
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
        justifyContent: 'space-evenly',
        // marginBottom:0
    },
    adds1: {
        alignItems: 'center',
        borderColor: '#12352F',
        paddingVertical: 16,
        width: '33%',
        height: '100%',
        // backgroundColor: 'black',
    },
    adds2: {
        alignItems: 'center',
        borderColor: '#12352F',
        paddingVertical: 16,
        width: '33%',
        height: '100%',
        // backgroundColor: 'black',
    },
    quantityText: {
        // alignItems: 'center',
        height: '100%',
        color: '#3C5F58',
        // backgroundColor: 'yellow',
        paddingHorizontal: '15%',
        marginTop: 10,

        // paddingVertical: 10
    },
    bottombox: {
        flex: 1,
        flexDirection: 'row',
        marginTop: 2,
        marginLeft: 2,
        backgroundColor: 'white',
        // height: 300
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});
