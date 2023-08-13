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
import React, {useEffect, useState} from 'react';
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
import ProductList from '../../components/ProductList';

const SearchResults = ({route}) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [cart, setCart] = useState(null);
  const isFocused = useIsFocused();

  const [products, setProducts] = useState([]);
  async function getProducts() {
    const response = await axios.get(
      'https://hibee-product.moshimoshi.cloud/product?search=' +
        route.params.query,
    );
    console.log('FILTERED PRODUCTS', response?.data?.data);
    setProducts(response?.data?.data);
  }

  useEffect(() => {
    getProducts();
  }, []);

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

  return (
    <SafeAreaProvider
      style={{flex: 1, marginTop: insets.top, backgroundColor: 'white'}}>
      <Pressable
        style={styles.SectionStyle}
        // onPress={() => navigation.goBack()}
        >
        {/* <Image
          source={require('../../assets/img/leftarrow.png')} //Change your icon image here
          style={{alignItems: 'center', marginLeft: 10}}
        /> */}

        <Text
          style={{flex: 1, color: '#8F8F8F', marginLeft: 10,color: 'blue'}}

          // value="Search for products"
          // underlineColorAndroid="transparent"
          // editable={false}
          // selectTextOnFocus={false}
          // onPress={() => navigation.navigate('Search')}
        >
          Search for products
        </Text>
      </Pressable>
      {products.length > 1 ? <ProductList products={products} /> : null}
    </SafeAreaProvider>
  );
};

export default SearchResults;

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
    marginLeft: '5%',
    width: '90%',
    shadowColor: 'black',
    elevation: 5,
    shadowOffset: {width: 0, height: -1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderBottomColor: '#E2E2E2',
    borderBottomWidth: 1,
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

    flexWrap: 'wrap',
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
    borderColor: '#F5F5F5',
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
    ////fontWeight: 500,
    fontSize: 14,
    /* or 18px */
    color: '#3C5F58',
    marginTop: 25,
  },

  text1: {
    height: 18,
    fontFamily: 'DM Sans',
    ////fontWeight: 500,
    fontSize: 10,
    /* or 18px */
    color: '#3C5F58',
    marginTop: 3,
  },
  text2: {
    height: 18,
    fontFamily: 'DM Sans',
    ////fontWeight: 500,
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
    marginTop: 5,
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
