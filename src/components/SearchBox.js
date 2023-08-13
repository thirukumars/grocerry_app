import { View, Text, StyleSheet, TextInput, Image, ImageBackground, SafeAreaView, ScrollView, TouchableOpacity, Button, TouchableHighlight, Pressable, FlatList } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation, useIsFocused } from '@react-navigation/native';


const SearchBox = () => {
    const navigation = useNavigation();
    return <Pressable style={styles.SectionStyle} onPress={() => navigation.navigate('Search')}>
        <Image
            source={require('../assets/img/searcher.png')} //Change your icon image here
            style={styles.ImageStyle}
        />
        <Text
            style={{ flex: 1, color: "#8F8F8F" }}
        >Search for products
        </Text>
    </Pressable>
}

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
    }
})

export default SearchBox;