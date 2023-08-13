import { View, Text, StyleSheet, SafeAreaView, Image, TouchableOpacity, TextInput, ScrollView, Keyboard, FlatList, Pressable, TouchableHighlight } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation, useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';


const CategoryListTile = (props) => {
    const navigation = useNavigation();
    console.log("PROPS", props?.categories)
    const Item = ({ el }) => (
        <View style={{
            justifyContent: 'center',
            alignItems: 'center',
            // backgroundColor: "black",
            marginLeft: 15,
            width: "20%"
            // height: 20
        }}
        >
            <TouchableHighlight
                style={{
                    width: 75,
                    height: 75,
                    marginTop: 18,
                    // marginLeft: 20,
                    backgroundColor: 'rgb(232, 250, 248)',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 6,
                    alignSelf: "center"
                }}
                underlayColor='#ccc'
                onPress={() => {
                    console.log("SELECTED CATEGORY FROM MAIN PAGE", el._id)
                    // navigation.navigate('CategoryNavigator', { screen: 'CategoryScreen', categoryId: el?._id })
                    navigation.navigate('CategoryNavigator', { screen: 'CategoryScreen', params: { categoryId: el?._id }, initial: false })
                }
                }
            >
                <Image source={{ uri: el?.image }} width={55} height={55} style={{ position: "absolute", borderRadius: 0, overflow: "hidden", padding: 10 }} />
            </TouchableHighlight>
            <Text style={[styles.textleft]}>
                {el?.name}
            </Text>
        </View>
    )
    return (
        // <View style={{ width: "100%", height: "10%", backgroundColor: "blue" }}>
        <FlatList numColumns={4} data={props.categories} renderItem={({ item }) => <Item el={item} />} showsHorizontalScrollIndicator={false} />
        // </View>
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
        fontWeight: "700",
        fontSize: 14,
        fontFamily: 'DM Sans',
        color: '#111111',
        marginTop: 5,
        alignSelf: 'flex-start'
    },
    del: {
        marginRight: 15,
        fontWeight: "700",
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
export default CategoryListTile