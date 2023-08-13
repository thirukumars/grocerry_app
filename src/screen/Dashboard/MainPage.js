import { View, Text, StyleSheet, TextInput, Image, ImageBackground, SafeAreaView, ScrollView, TouchableOpacity, Button, TouchableHighlight, Pressable, FlatList } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import HomeTopBanner from '../../components/HomeTopBanner';
import { useWindowDimensions } from 'react-native';
import axios from 'axios';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HorizontalProductList from '../../components/HorizontalProductList';
import CategoryListTile from '../../components/CategoryListTile';
import CartFooter from '../../components/CartFooter';
import SearchBox from '../../components/SearchBox';
import Modal from "react-native-modal";

const MainPage = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const windowWidth = useWindowDimensions().width;
  const windowHeight = useWindowDimensions().height;
  const [categoryList, setCategoryList] = useState([{}])
  const [cart, setCart] = useState(null)
  const [cartType, setCartType] = useState(null);
  const isFocused = useIsFocused();
  const [staticBanner1, setStaticBanner1] = useState({})
  const [staticBanner2, setStaticBanner2] = useState({})
  const [products, setProducts] = useState([]);
  const [modalOpen, setModalOpen] = useState(false)
  const [replaceCart, setReplaceCart] = useState(false)

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
    }
  }, [isFocused]);

  const [productList, setProductList] = useState([{}])

  async function getCategoryList() {

    let result = await axios.get('https://hibee-product.moshimoshi.cloud/category')
    console.log(result.data.data)
    //filter out results where SubCategoryCount is 0
    result.data.data = result.data.data.filter((el) => {
      return el?.activated
    })
    //sort result by SubCategoryCount field
    result.data.data.sort((a, b) => { return a.index - b.index })
    console.log("sorted list", result.data.data)
    setCategoryList(result.data.data)
    // setSelectedCategory(0)
  }

  async function getproductList() {
    let result = await axios.get('https://hibee-product.moshimoshi.cloud/product')

    console.log("PRODUCT LIST", result.data.data)

    setProductList(result.data.data)
  }

  async function getStaticBanners() {
    let result = await axios.post('https://hibee-adminapi.moshimoshi.cloud/admin/banner/advertisment_list?sort=&search=')
    console.log("advertisement", result.data.data)
    setStaticBanner1(result?.data?.data[0])
    setStaticBanner2(result?.data?.data[1])
  }
  useEffect(() => {
    getCategoryList()
    getproductList()
    getStaticBanners()
  }, [])
  return (
    <>
      <SafeAreaProvider style={{ flex: 1, marginTop: insets.top }}>
        <View style={{ height: "100%", backgroundColor: "white" }}>

          <View style={{}}>
            <FlatList
              ListHeaderComponent={<>
                <View style={styles.topbox}>
                  <Text style={styles.topheader}>Prestige Layout, Shankarpura</Text>
                  <Text style={styles.greentext}>Order by 10PM, get it next day by 9AM</Text>
                </View>
                <SearchBox />
              </>}
              data={[(<>
                {/* <Text style={styles.bestoffer}>Get best offers</Text> */}
                <HomeTopBanner />
              </>), <>
                <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between" }}>
                  <Text style={styles.explore}>Explore all products</Text>
                  {/* <Text style={styles.del}>Next day delivery</Text> */}
                </View>
                <CategoryListTile categories={categoryList} /></>
                ,
              <>
                <ImageBackground source={require('../../../src/assets/img/superfast.png')} style={{ width: "100%", height: 480, marginVertical: 30 }}>
                  <Text style={{ fontSize: 20, marginTop: 12, marginLeft: 16, color: "#095344", fontWeight: 600, width: 200 }}>
                    Get Superfast Delivery!
                  </Text>
                  <Text style={{ fontSize: 20, marginTop: 6, marginLeft: 16, color: "#147A66", fontWeight: 700, textDecorationLine: "underline", fontSize: 12 }}>
                    8-10 mins
                  </Text>
                  <View style={{ backgroundColor: "white", width: "90%", height: 370, alignSelf: "center", marginTop: 10 }}>
                    <Text style={{ color: "black", fontSize: 16, fontWeight: 700, alignSelf: "center", marginTop: 18 }}>
                      Instant Delivery
                    </Text>
                    <Text style={{ color: "#8F8F8F", fontSize: 10, fontWeight: 400, alignSelf: "center", marginTop: 2, marginBottom: 12 }}>
                      Get your daily essentials instantly
                    </Text>
                    <View style={{ height: 260, width: "100%" }}>

                      <HorizontalProductList products={productList} color="#F8F7F5" cart={cart} setCart={setCart} modalOpen={modalOpen} setModalOpen={setModalOpen} type='superfast'
                        replaceCart={replaceCart} setReplaceCart={setReplaceCart} />
                    </View>
                    <TouchableOpacity style={{ width: "90%", backgroundColor: "white", height: 34, alignSelf: 'center', borderWidth: 1, borderColor: "#12352F", borderRadius: 8 }}
                      onPress={() => navigation.navigate('CategoryNavigator', { screen: 'ProductListPage', params: { products: productList }, initial: false })}
                    >
                      <Text style={{ color: "#3C5F58", fontSize: 14, fontWeight: 500, alignSelf: "center", marginTop: 8, }}>
                        View all
                      </Text>
                    </TouchableOpacity>
                  </View>
                </ImageBackground>
              </>
                ,
              <>
                <TouchableOpacity onPress={() => navigation.navigate('CategoryNavigator', { screen: 'Nativity', initial: false })}>

                  <Image source={require('../../../src/assets/img/nativity_banner.png')} style={{ width: "90%", height: 180, borderRadius: 6, marginLeft: "5%", marginBottom: 20 }} />
                </TouchableOpacity>
              </>

                , (
                staticBanner1 ?
                  <View style={{}}>
                    <Image source={{ uri: staticBanner1?.image }} style={{ width: "90%", height: 116, borderRadius: 20, marginLeft: "5%" }} />
                  </View>
                  : null
              ), (<>
                <TouchableOpacity style={{ flexDirection: "row" }}>
                  <Text style={styles.besttext}>Bestseller products</Text>
                  <Image source={require('../../../src/assets/img/arrow_circle_right.png')} style={{ height: 24, width: 24, marginTop: 6, marginLeft: 3 }} />
                </TouchableOpacity>


                <View style={styles.box}>
                  <View style={styles.bigbox}>
                    <HorizontalProductList products={productList} color="#F1F9F3" cart={cart} setCart={setCart} cartType={cartType} modalOpen={modalOpen} setModalOpen={setModalOpen} type='normal' replaceCart={replaceCart} setReplaceCart={setReplaceCart} />
                  </View>
                  {
                    staticBanner2 ?
                      <View style={{}}>
                        <Image source={{ uri: staticBanner2?.image }} style={{ width: "90%", height: 116, borderRadius: 20, marginLeft: "5%" }} />
                      </View>
                      : null
                  }
                </View></>,

                <>
                  <View style={{ flexDirection: "row", width: "100%", }}>
                    <Text style={styles.besttext}>Bestseller products</Text>
                    <TouchableOpacity style={{ flexDirection: "row", }} onPress={()=>navigation.navigate('CategoryNavigator', { screen: 'ProductListPage', params: { products: productList }, initial: false })}>

                      <Text style={[, { fontSize: 14, fontWeight: 'bold', marginTop: 28, marginLeft: "50%", marginBottom: 10, color: "#3C5F58", fontWeight: 500, }]}>
                        View All
                      </Text>
                      <Image source={require('../../../src/assets/img/arrow_circle_right.png')} style={{ height: 24, width: 24, marginTop: 24, marginLeft: 3 }} />
                    </TouchableOpacity>
                  </View>
                  <HorizontalProductList products={productList} color="#F1F9F3" cart={cart} setCart={setCart} modalOpen={modalOpen} setModalOpen={setModalOpen} type='normal' replaceCart={replaceCart} setReplaceCart={setReplaceCart} />
                </>), (
                <>{staticBanner2 ?
                  <View style={{}}>
                    <Image source={{ uri: staticBanner2?.image }} style={{ width: "90%", height: 116, borderRadius: 20, marginLeft: "5%" }} />
                  </View>
                  : null}</>
              ),
              (<>
                <View style={{ flexDirection: "row", width: "100%", }}>
                  <Text style={styles.besttext}>Suggested for you</Text>
                  <TouchableOpacity style={{ flexDirection: "row", }} onPress={()=>navigation.navigate('CategoryNavigator', { screen: 'ProductListPage', params: { products: productList }, initial: false })}>

                    <Text style={[, { fontSize: 14, fontWeight: 'bold', marginTop: 28, marginLeft: "50%", marginBottom: 10, color: "#3C5F58", fontWeight: 500, }]}>
                      View All
                    </Text>
                    <Image source={require('../../../src/assets/img/arrow_circle_right.png')} style={{ height: 24, width: 24, marginTop: 24, marginLeft: 3 }} />
                  </TouchableOpacity>
                </View>
                <View style={styles.bigbox}>
                  <HorizontalProductList products={productList} color="#F2F1F9" cart={cart} setCart={setCart} modalOpen={modalOpen} setModalOpen={setModalOpen} type='normal' replaceCart={replaceCart} setReplaceCart={setReplaceCart} />
                </View></>),
              ]}
              renderItem={({ item }) => <>{item}</>}
              ListFooterComponent={
                <>
                  <View style={{ height: 200, width: "100%" }} />
                </>}
            />
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
                    <Text style={{ color: "#111111", fontSize: 20, 
                    fontWeight: '700', 
                    }}>Replace cart?</Text>
                  </TouchableOpacity>
                  <Text style={{ width: "75%", textAlign: "center", marginTop: 8, fontWeight: "400", color: "#3C5F58" }}>

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
        </View>
        {
          cart?.length > 0 ?
            <CartFooter cart={cart} />
            : null
        }
      </SafeAreaProvider>
    </>
  );
};



const styles = StyleSheet.create({
  topbox: {
    marginTop: 10,
    width: "100%",
    height: 52,
    backgroundColor: 'white'
  },
  textleft: {
    // marginLeft: 20,
    // alignSelf: "center",
    // justifyContent: 'center',
    // alignItems: 'center',
    // ////fontWeight: 600,
    fontSize: 12,
    fontFamily: 'DM Sans',
    color: '#3C5F58',
    textAlign: "center",
    height: 50,
    // marginLeft:20,
    // marginTop: 7,
    width: 65,
  },
  greentext: {
    marginLeft: 20,
    //fontWeight: 500,
    fontSize: 12,
    fontFamily: 'DM Sans',
    color: '#298472',
    marginTop: 5,
    alignSelf: 'flex-start'
  },
  bestoffer: {
    marginLeft: 20,
    ////fontWeight: 700,
    fontSize: 14,
    fontFamily: 'DM Sans',
    color: 'black',
    marginTop: 24,
    alignSelf: 'flex-start'
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
    ////fontWeight: 500,
    fontSize: 12,
    /* identical to box height */
    color: '#12352F',
    marginTop: 7,
    alignSelf: "center",
    marginLeft: 10
  },
  topheader: {
    marginLeft: 20,
    ////fontWeight: 700,
    fontSize: 16,
    fontFamily: 'DM Sans',
    color: '#111111',
    marginTop: 20,
    alignSelf: 'flex-start'
  },

  explore: {

    marginLeft: 20,
    ////fontWeight: 700,
    fontSize: 14,
    fontFamily: 'DM Sans',
    color: '#111111',
    marginTop: 5,
    alignSelf: 'flex-start'
  },
  del: {
    marginRight: 15,
    ////fontWeight: 700,
    fontSize: 12,
    fontFamily: 'DM Sans',
    color: '#2B8D7A',
    marginTop: 5,
    alignSelf: 'flex-start',
    textDecorationLine: "underline"
  },

  category: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 10,
    width: 328,
    height: 32
  },
  button: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    padding: 10,
  },

  searchcontainer: {
    marginTop: 40,
    marginBottom: 24,
    marginLeft: 16,
    marginRight: 16,
    shadowColor: 'rgba(0, 0, 0, 0.12)',
    elevation: 2,


  },
  greenbigbtn: {
    width: 328,
    height: 36,
    backgroundColor: '#135C4E',
    borderRadius: 8,
    // marginTop: 60,
    marginLeft: 32,
    marginRight: 20,
    justifyContent: "center",
    alignItems: "center"

  },
  greenbigbtntext: {

    ////fontWeight: 500,
    fontSize: 12,
    fontFamily: 'DM Sans',
    color: '#FFFFFF',


  },
  besttext: {
    ////fontWeight: 700,
    fontSize: 15,
    fontFamily: 'DM Sans',
    color: '#111111',
    marginTop: 25,
    marginLeft: 25,
    marginBottom: 15

  },


  item1: {
    marginTop: 15
  },
  category: {
    width: 328,
    height: 32,


  },
  icon: {
    position: 'absolute',
    right: 10,
  },

  imagebig: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#485a96',
    borderWidth: .5,
    borderColor: '#fff',
    height: 40,
    borderRadius: 5,
    margin: 5,

  },
  SectionStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 0.2,
    borderColor: 'gray',
    height: 50,
    borderRadius: 5,
    // margin: 10,
    marginTop: 30,
    // marginBottom: 20,
    marginLeft: 20,
    width: "90%",
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
  // slider: {
  //   width: 54,
  //   height: 6,
  //   marginTop: 10
  // },
  slider: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'

  }
  ,
  canvasContainer: {
    marginBottom: 5,

  },

  gridcont: {
    flex: 1,
    marginTop: 20,
    flexWrap: 'wrap',
    margin: 10,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: 'row'
  },
  item: {

    marginVertical: 10,
    width: 63,
    height: 63,
    textAlign: 'center',
    marginLeft: 20,
    border: 5

  },
  // category: {
  //   width: 328,
  //   height: 32,
  //   shadowColor: 'rgba(0, 0, 0, 0.25)'
  // },
  itemtext: {
    fontFamily: 'DM Sans',
    ////fontWeight: 500,
    fontSize: 12,
    /* or 16px */

    textAlign: 'center',

    color: '#3C5F58'


  },
  box: {
    marginTop: 15,
    width: "100%",
    backgroundColor: 'white',
    height: 550
  },
  linebottom: {
    width: 106,
    height: 0,
    borderColor: '#707070',
    borderWidth: 2,
    borderRadius: 20,
    marginLeft: 140,
    marginTop: 15,
    marginBottom: 10


  },
  headerText: {
    height: 38,
    fontFamily: 'DM Sans',
    ////fontWeight: 700,
    fontSize: 16,
    /* or 19px */
    textAlign: 'center',
    color: '#3D3D3D',
    marginTop: 20

  },
  bigbox: {
    // height: 240,
    // width: 380,
    borderColor: 'rgb(232, 250, 248)',
    borderWidth: 1,
    display: "flex",
    flexDirection: 'row',
    // paddingBottom: 20,
  },


  apple: {
    width: 118,
    height: 184,
    borderRadius: 10,
    marginLeft: 25,
    marginTop: 5,
    padding: 5,
    backgroundColor: "rgb(232, 250, 248)",

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
  applebig: {

    width: 148,
    height: 214,
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    marginTop: 80,
    marginLeft: 30,
    padding: 5
  },
  text: {
    height: 18,
    fontFamily: 'DM Sans',
    ////fontWeight: 500,
    fontSize: 14,
    /* or 18px */
    width: '85%',
    color: '#3C5F58',
    marginTop: 15,
    // numberOfLines:2,
    ellipsizeMode: 'clip'
  },

  text1: {
    height: 18,
    fontFamily: 'DM Sans',
    ////fontWeight: 500,
    fontSize: 10,
    /* or 18px */
    color: '#3C5F58',
    marginTop: 3
  },
  text2: {
    height: 18,
    fontFamily: 'DM Sans',
    ////fontWeight: 500,
    fontSize: 14,
    /* or 18px */
    color: '#000000',
    marginTop: 3,
    marginTop: 5
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
  adds: {
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

  textVeg: {
    height: 21,
    fontFamily: 'DM Sans',
    ////fontWeight: 500,
    fontSize: 16,
    /* identical to box height */
    color: '#000000',
    marginLeft: 35,
    marginTop: 10


  },
  underline: {
    height: 21,
    fontFamily: 'DM Sans',
    ////fontWeight: 500,
    fontSize: 12,
    /* identical to box height */
    color: '#8F8F8F',

    marginLeft: 35,
    marginTop: 2,
    textDecorationLine: 'underline'

  },
  bottombox: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    backgroundColor: 'white',
    marginBottom: 60
  },
  footerbox: {
    width: 180,
    height: 260,
    border: 1,
    borderColor: '#F5F5F5',
    borderWidth: 1

  }
})




export default MainPage;
