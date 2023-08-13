import React, { useState, useEffect } from 'react'
import { View, StyleSheet, ActivityIndicator, TouchableOpacity, Image, Text, ImageBackground, ScrollView, TouchableHighlight, Dimensions, Alert, SafeAreaView, Pressable } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import BASE_URLS from '../../api_interface/BaseUrl';
import { CATEGORY_PATH } from '../../api_interface/apiURLs';
import Spinner from 'react-native-loading-spinner-overlay';
import CategoryListTile from '../../components/CategoryListTile';
import SearchBox from '../../components/SearchBox';

function CategoryList() {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const [categoryList, setCategoryList] = useState({ data: [], loader: false })

    const getCategoryList = async () => {
        try {
            setCategoryList({ ...categoryList, loader: true, })
            let result = await axios.get(BASE_URLS + CATEGORY_PATH)
            if (result.status == 200) {
                result.data.data = result.data.data.filter((el) => {
                    return el?.activated
                })
                //sort result by SubCategoryCount field
                result.data.data.sort((a, b) => { return a.index - b.index })
                setCategoryList({ ...categoryList, data: result.data.data, loader: false })
                // setSelectedCategory(0)
            }

        } catch (error) {
            console.log(error, 'error');
        }
    }

    useEffect(() => {
        getCategoryList()
    }, [])

    return (
        <SafeAreaProvider style={{ flex: 1, marginTop: insets.top }}>
            <View style={{ height: "100%", backgroundColor: "white", }}>
                <SearchBox />
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 15 }}>
                    <Text style={styles.explore}>Explore all products</Text>
                    {/* <Text style={styles.del}>Next day delivery</Text> */}
                </View>
                <CategoryListTile categories={categoryList?.data} />
            </View >
        </SafeAreaProvider >

    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    horizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
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
        margin: 10,
        marginTop: 30,
        marginBottom: 20,
        marginLeft: 20,
        width: 340,
        shadowColor: 'black',
        elevation: 5,
        shadowOffset: { width: 0, height: -1 }, shadowOpacity: 0.1, shadowRadius: 2, borderBottomColor: '#E2E2E2', borderBottomWidth: 1
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
    textleft: {
        fontSize: 12,
        fontFamily: 'DM Sans',
        color: '#3C5F58',
        textAlign: "center",
        height: 50,
        width: 65,
    },
    ImageStyle: {
        padding: 10,
        margin: 5,
        height: 20,
        width: 20,
        resizeMode: 'stretch',
        alignItems: 'center',
    },

})

export default CategoryList