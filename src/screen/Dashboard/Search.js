import { View, Text, StyleSheet, SafeAreaView, Image, TouchableOpacity, TextInput, ScrollView, Keyboard, FlatList, ImageBackground } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios';
// import CustomHeader2 from '../../../../components/CustomHeader2'
// import ApiServicesCustomer from '../../../../apiServices/ApiServicesCustomer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import HorizontalProductList from '../../components/HorizontalProductList';
import Modal from "react-native-modal";
const Search = ({ }) => {
    const navigation = useNavigation()
    const [productList, setProductList] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchText, setSearchText] = useState('')
    const [isFocused, setIsFocused] = useState(false);
    const [searchQuery, setSearchQuery] = useState([]);
    const [cart, setCart] = useState(null)
    const [modalOpen, setModalOpen] = useState(false)
    const [replaceCart, setReplaceCart] = useState(false)
    const [cartType, setCartType] = useState(null);
    const onFocus = () => {
        setIsFocused(true);
    };
    const onBlur = () => {
        setIsFocused(false);
    };
    useEffect(() => {
        getUserSearchQuery()
        productListData();
    }, [])
    useEffect(() => {
        if (isFocused) {
            AsyncStorage.getItem('cartType').then((cart_type) => {
                setCartType(cart_type)
              }
              )
              AsyncStorage.getItem('cart').then((value) => {
                if (value) {
                  setCart(JSON.parse(value))
                } else {
                  setCart([]);
                }
              });
              console.log('FOCUSSED')
        }
    }, [isFocused, navigation]);
    function RemoveInputText() {
        onBlur()
        setSearchText('')
    }
    async function getUserSearchQuery() {
        // await AsyncStorage.removeItem('userSearchQuery')
        let userSearchQuery = JSON.parse(await AsyncStorage.getItem('userSearchQuery'));
        if (userSearchQuery) {
            console.log("SEARCH QUERY", userSearchQuery)
            setSearchQuery(userSearchQuery);
        }
    }
    async function storeUserSearchQuery(query) {
        let userSearchQuery = JSON.parse(await AsyncStorage.getItem('userSearchQuery'));
        if (userSearchQuery) {
            let tempArray = [...userSearchQuery]
            let index = tempArray.findIndex(x => x == query)
            console.log("INDEX", index)
            if (index == -1) {
                userSearchQuery.unshift(query);
            } else {
                userSearchQuery.splice(index, 1);
                userSearchQuery.unshift(query);
            }
            await AsyncStorage.setItem('userSearchQuery', JSON.stringify(userSearchQuery));
        }
        else {
            await AsyncStorage.setItem('userSearchQuery', JSON.stringify([query]));
        }
    }

    async function removeUserSearchQuery(query) {
        let userSearchQuery = JSON.parse(await AsyncStorage.getItem('userSearchQuery'));
        if (userSearchQuery) {
            let tempArray = [...userSearchQuery]
            let index = tempArray.findIndex(x => x == query)
            console.log("INDEX", index)
            if (index == -1) {
                userSearchQuery.unshift(query);
            } else {
                //remove search query
                userSearchQuery.splice(index, 1);
            }
            await AsyncStorage.setItem('userSearchQuery', JSON.stringify(userSearchQuery));
            await getUserSearchQuery()
        }
        else {
            await AsyncStorage.setItem('userSearchQuery', JSON.stringify([query]));
        }
    }
    // useEffect(() => {
    //     // Focus the search input and open up the keyboard
    //     searchInputRef.current.focus();

    //     // // Hide the keyboard when the user clicks away from the text input
    //     // const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
    //     //     searchInputRef.current.blur();
    //     // });

    //     // Clean up the event listener
    //     // return () => {
    //     //     keyboardDidHideListener.remove();
    //     // };
    // }, []);
    const productListData = async () => {
        try {
            console.log("PRODUCT LIST")
            const productData = await axios.get('https://hibee-product.moshimoshi.cloud/product')
            console.log('productData', productData?.data?.data);
            // if (productData?.data?.error === false) {
            setProductList(productData?.data?.data)
            // } 
        }
        catch (e) {
            console.log('failed to list shops data', e);
        }
    }

    useEffect(() => {
        const searchFilter = productList.filter((item) => item?.product_name?.toUpperCase().indexOf(searchText?.toUpperCase()) > -1)
        console.log('searchFilter', searchFilter);
        setFilteredData(searchFilter.slice(0, 3));
        setSearchText(searchText)
    }, [searchText])

    const Item = ({ id, name, image }) => (
        <TouchableOpacity key={id} onPress={async () => {
            console.log("PRESSED")
            await storeUserSearchQuery(name)
            console.log("ID OF PRODUCT", id)
            navigation.navigate('CategoryNavigator', { screen: 'Product', initial: false, params: { productId: id } })
        }} style={{ flexDirection: 'row', height: 50, marginVertical: 5, borderWidth: 1, borderColor: "#E1E1E1", borderRadius: 6 }}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-start', marginLeft: 12 }}>
                <Image
                    source={{ uri: Array.isArray(image) ? image[0]?.image : image }}
                    style={{ alignItems: "center", height: 32, width: 32, borderRadius: 20 }}
                />
            </View>
            <View style={{ flex: 5, flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.text}>{name}</Text>
            </View>
        </TouchableOpacity>
    );
    // console.log('productList', productList);

    return (
        <SafeAreaView style={{ backgroundColor: '#fff', height: '100%' }}>
            {/* <CustomHeader2 backAction={() => navigation.goBack()} rightAction={() => navigation.navigate('Notification')} notification /> */}
            <View showsVerticalScrollIndicator={false}>
                <View style={{ marginHorizontal: 30 }}>
                    <View style={styles.search}>
                        <View style={{ flex: 1, justifyContent: 'center' }}>
                            <TouchableOpacity onPress={() => isFocused ? RemoveInputText() : navigation.goBack()}>
                                <View style={{ flex: 1, justifyContent: 'center', height: 10, width: 10, marginLeft: 9 }}>
                                    <Image source={require("../../assets/img/leftarrow.png")}
                                        style={{ alignItems: "center" }} />
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flex: 7, justifyContent: 'center' }}>
                            <TextInput style={[styles.text, { marginLeft: 0 }]} value={searchText} onChangeText={(e) => setSearchText(e)} placeholder='Search for products' onFocus={onFocus} />
                        </View>

                    </View>
                    {searchText?.length > 0 ?
                        < FlatList data={filteredData} renderItem={({ item }) => <Item id={item?._id} name={item?.product_name} image={item?.images} />} keyExtractor={item => item.id} ListFooterComponent={

                            filteredData.length > 0 ?
                                <TouchableOpacity onPress={async () => {
                                    console.log("PRESSED")
                                    navigation.navigate('SearchResults', { query: searchText })
                                }} style={{ flexDirection: 'row', height: 50, marginVertical: 5, borderWidth: 1, borderColor: "#E1E1E1", borderRadius: 6 }}>

                                    <View style={{ flex: 5, flexDirection: 'row', alignItems: 'center' }}>
                                        <Text style={[styles.text, { color: "#3C5F58", marginLeft: 15 }]}>Show all results</Text>
                                    </View>
                                </TouchableOpacity> : null

                        } /> :
                        <View>
                            <Text style={{ fontSize: 14, marginBottom: 16, color: "black" }}>
                                Recent searches
                            </Text>
                            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                                {searchQuery?.map((query, index) => {
                                    return <TouchableOpacity onPress={() => {
                                        onFocus()
                                        setSearchText(query)
                                    }}>

                                        <View style={{ backgroundColor: "white", borderColor: "#4E4E4E", borderWidth: 0.5, alignSelf: 'center', paddingHorizontal: 12, paddingVertical: 6, margin: 2, flexDirection: "row", borderRadius: 60 }}>
                                            <Text style={{ fontSize: 12, color: "#4E4E4E" }}>
                                                {query}
                                            </Text>
                                            <TouchableOpacity onPress={
                                                async () => { await removeUserSearchQuery(query) }
                                                // console.log("PRESSING")
                                            }>
                                                <Image source={require("../../assets/img/closebutton.png")} style={{ alignItems: "center", width: 14, height: 14, marginLeft: 10 }} />
                                            </TouchableOpacity>
                                        </View>
                                    </TouchableOpacity>
                                })}
                            </View>
                            <View style={{ marginTop: 30, marginBottom: 20 }}>

                                <Text style={styles.besttext}>
                                    Suggested for you
                                </Text>
                                <HorizontalProductList products={productList} color="#F2F1F9" cart={cart} setCart={setCart} cartType={cartType} modalOpen={modalOpen} setModalOpen={setModalOpen} type='normal' replaceCart={replaceCart} setReplaceCart={setReplaceCart} />
                            </View>
                        </View>
                    }
                    {filteredData.length === 0 && searchText?.length > 0 ? (
                        <View style={{ width: '100%', alignContent: "center", justifyContent: "center", marginLeft: '25%' }}>
                            <Image source={require('../../assets/img/noitems.png')} style={{
                                marginBottom: 15, marginTop: 80,
                                width: '50%',
                                height: undefined,
                                aspectRatio: 0.69, //this is not a joke, it was the actual ratio of the png
                            }} />
                            <Text style={{ marginLeft: 5, fontSize: 20 }}> No Items Available</Text>
                            <Text style={{ marginLeft: 20, fontSize: 14, width: 150, marginTop: 12 }}> There is no data to show you right now.</Text>
                        </View>
                    ) : null}
                    {/* { filteredData.length === 0  && searchText ==='' && productList?.map((shop) => {
            return (
              <TouchableOpacity onPress={() => navigation.navigate('ShopDetail', {
                selectedShop: shop
              })} style={{ flexDirection: 'row', height: 50, marginVertical: 5 }}>
                <View style={{ flex: 2, justifyContent: 'center', alignItems: 'flex-start' }}>
                  <Image
                    source={{uri: shop?.logo }}
                    style={{ alignItems: "center", height: 32, width: 32, borderRadius:20 }}
                  />
                </View>
                <View style={{ flex: 4, justifyContent: 'center', alignItems: 'flex-start' }}>
                  <Text style={styles.text}>{shop?.name}</Text>
                </View>
              </TouchableOpacity>
            )
          })} */}

                </View>
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
            </View>

        </SafeAreaView>
    )
}

export default Search

const styles = StyleSheet.create({
    search: {
        // borderWidth: 1,
        // borderColor: '#D5AF61',
        height: 40,
        borderRadius: 6,
        marginVertical: 30,
        flexDirection: 'row',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 5,
        // elevation:20,
        // justifyContent:'center',
        // alignItems:'center',
        backgroundColor: "white"
    },
    text: {
        fontSize: 16,
        color: '#999999',
        // fontFamily: 'Montserrat-Medium',
        fontStyle: 'normal',
        //fontWeight: '500',
        // backgroundColor:'#fff'
    },
    apple1: {
        width: 118,
        height: 184,
        borderRadius: 10,
        marginLeft: 25,
        marginTop: 10,
        padding: 5,
        backgroundColor: "#F2F1F9"

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
        marginTop: 3,
        marginTop: 5
    },
    addbox: {

        width: 53,
        height: 32,
        borderColor: '#12352F',
        borderWidth: 0.4,
        borderRadius: 4,
        display: 'flex',
        alignSelf: 'flex-end',
        marginLeft: 100,
        backgroundColor: '#F1F9F3',
        marginBottom: 20,
        marginRight: 5,
        marginTop: -34

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
        alignSelf: "center",
        marginLeft: 10
    },
    producttext: {
        height: 18,
        fontFamily: 'DM Sans',
        //fontWeight: 500,
        fontSize: 14,
        /* or 18px */
        width: '85%',
        color: '#3C5F58',
        marginTop: 15,
        // numberOfLines:2,
        // ellipsizeMode: 'clip'
    },
    bigbox: {
        height: 240,
        // width: 380,
        borderColor: 'rgb(232, 250, 248)',
        // borderWidth: 1,
        display: "flex",
        flexDirection: 'row',
        paddingBottom: 20,
    },
    besttext: {
        //fontWeight: 700,
        fontSize: 15,
        fontFamily: 'DM Sans',
        color: "black",
        marginTop: 25,
        // marginLeft: 25,
        marginBottom: 15

    },
})