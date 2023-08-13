import { View, Text, ScrollView, StyleSheet, SafeAreaView, ImageBackground, Image, Dimensions, TouchableOpacity, Linking, useWindowDimensions } from 'react-native'
import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import Carousel from 'react-native-reanimated-carousel';
import Dots from 'react-native-dots-pagination';
const width = Dimensions.get('screen').width;

const HomeTopBanner = ({ }) => {
    const navigation = useNavigation()
    const windowWidth = useWindowDimensions().width;
    const windowHeight = useWindowDimensions().height;
    const [bannerImages, setBannerImages] = useState([])
    const [index, setIndex] = useState(0);
    async function getBanners() {
        let result = await axios.get('https://hibee-adminapi.moshimoshi.cloud/admin/banner')
        console.log('result', result?.data?.data);
        setBannerImages(result?.data?.data)
    }
    useEffect(() => {
        getBanners()
    }, [])
    
    return (
        <View style={{ backgroundColor: '#ffffff', height: 280, marginLeft: 15, marginRight: 15,marginTop:20 }}>
            <Text style={styles.bestoffer}>Get best offers</Text>
            {/* <ImageBackground source={require('../assets/img/apples.png')} resizeMode="cover" > */}
            {/* <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} >
                {bannerImages?.map((x, i) => {
                    console.log('x', x?.image);
                    return (
                        <TouchableOpacity key={i} onPress={() => Linking.openURL(x?.link)}
                            style={styles.bannerScroll}>
                            <Image source={{ uri: x?.image }} style={styles.image} />
                        </TouchableOpacity>
                    )
                })}
            </ScrollView> */}
            <Carousel
                loop
                width={width}
                height={220}
                data={bannerImages}
                pagingEnabled={true}
                autoPlay={true}
                autoPlayInterval={4000}
                autoFillData={false}
                renderItem={({ item, index }) => (
                    <TouchableOpacity key={index} onPress={() => Linking.openURL(item?.link)}
                        style={styles.bannerScroll}>
                        <Image source={{ uri: item?.image }} style={styles.image} />
                    </TouchableOpacity>
                )}
                onProgressChange={(offsetProgress, absoluteProgress) => {
                    //when absolute progress changes to a whole number update index
                    if (absoluteProgress % 1 === 0) {
                        setIndex(absoluteProgress)
                    }
                }}
            />
            <Dots length={bannerImages?.length} active={index} paddingHorizontal={0} passiveDotHeight={6} passiveDotWidth={6} activeDotWidth={6} activeDotHeight={6}  activeColor='#FEBF22' />
        </View>
    )
}

export default HomeTopBanner

const styles = StyleSheet.create({
    bannerScroll: {
        height: 210,
        width: width - 30,
        // borderRadius: 20,
        // borderWidth: 1,
        marginVertical: 20,
        // marginHorizontal: 10,
        // marginLeft: 30
    },
    image: {
        width: width - 30,
        justifyContent: "center",
        borderRadius: 20,
        height: 200,
        resizeMode: 'stretch',
        alignContent: 'center'
    },
    text: {
        color: '#fff',
        fontSize: 20,
    },
    text1: {
        color: '#fff',
        fontSize: 12,
    },
    textContainer: {
        flex: 4,
        alignItems: 'flex-end',
        marginTop: 20,
        marginRight: 20
    },
})