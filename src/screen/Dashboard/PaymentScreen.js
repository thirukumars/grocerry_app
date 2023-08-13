import React from 'react'
import { View, StyleSheet, Text, Image, TouchableOpacity, TouchableHighlight, Dimensions } from 'react-native'
import { BlurView, VibrancyView } from "@react-native-community/blur";
import { useNavigation } from '@react-navigation/native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
function PaymentScreen({ setIsDeliveryModalVisible }) {
    const navigation = useNavigation()

    return (

        <SafeAreaProvider style={{}}>
            <View style={{ width: 400, backgroundColor: "white", position: "absolute", bottom: 0, width: "100%", borderTopLeftRadius: 8, borderTopRightRadius: 8, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.2, shadowRadius: 2, borderBottomColor: '#E2E2E2', borderBottomWidth: 1 }}>

                <Text style={styles.grocerytext}>Delivery details for your groceries</Text>
                <View style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>

                    <Image source={require('../../assets/img/scooty.png')} resizeMode='contain' style={{ width: 169.87, height: 133, marginTop: 100 }}
                    />

                    <TouchableOpacity onPress={() => {
                        setIsDeliveryModalVisible(false)
                        navigation.navigate("Payment Option")
                    }}>
                        <View style={styles.continuebox}>
                            <Text style={styles.continuetext}>CONTINUE</Text>
                        </View>
                    </TouchableOpacity>

                    <Text style={styles.scootytext}>We freshly source our products every morning.
                        Orders made after 10PM tonight will be delivered by tomorrow 9AM.
                        So sit back, relax and wait for our delivery executive.
                    </Text>
                </View>

            </View>
        </SafeAreaProvider>

    )
}

const styles = StyleSheet.create({


    topbox: {
        width: 400,
        height: 52,
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: '#bfbfbf',
        opacity: 0.4,
        blurType: "dark",
        blurAmount: 10,
        reducedTransparencyFallbackColor: "white",
        blurRadius: 50,
        backfaceVisibility: 'hidden',
        borderWidth: 0.2,

    }
    ,
    continuebox: {
        width: 328,
        height: 42,
        backgroundColor: "black",
        borderRadius: 6,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 50,

    },
    continuetext: {
        height: 34,
        fontFamily: 'DM Sans',
        ////fontWeight: 700,
        fontSize: 14,
        marginTop: 15,
        color: '#FFD365',
        marginLeft: 10,

    },
    text: {

        height: 34,
        fontFamily: 'DM Sans',
        ////fontWeight: 500,
        fontSize: 16,
        marginTop: 15,
        color: 'black',
        marginLeft: 30,


    }, topbox1: {
        width: 400,
        height: 56,
        backgroundColor: '#bfbfbf',
        opacity: 0.4,
        marginTop: 2,
        display: 'flex',
        flexDirection: 'row',

    },
    scootytext: {

        fontFamily: 'DM Sans',
        ////fontWeight: 400,
        fontSize: 12,
        /* or 18px */
        color: '#505462',
        marginTop: 10,
        marginLeft: 10,
        padding: 5,
        height: 200,
        width: 350,
    },
    applytext: {
        height: 18,
        fontFamily: 'DM Sans',
        ////fontWeight: 700,
        fontSize: 14,
        /* or 18px */
        color: '#505462',
        marginTop: 10,
        marginLeft: 30
    },
    applytext2: {
        height: 13,
        fontFamily: 'DM Sans',
        ////fontWeight: 400,
        fontSize: 10,
        /* or 18px */
        color: '#999999',
        marginTop: 5,
        marginLeft: 30,
    },

    midbox: {
        width: 400,
        height: 220,
        marginTop: 2,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#bfbfbf',
        opacity: 0.4

    },
    endbox: {
        width: 400,
        height: 240,
        backgroundColor: 'white'
    },
    delivery: {
        height: 20,
        fontFamily: 'DM Sans',
        ////fontWeight: 700,
        fontSize: 16,
        /* or 18px */
        color: '#12352F',
        marginTop: 8,
        marginLeft: 100,
    },
    grocerytext: {
        height: 20,
        fontFamily: 'DM Sans',
        ////fontWeight: 700,
        fontSize: 16,
        /* or 18px */
        color: '#12352F',
        marginTop: 10,
        marginLeft: 68
    },
    innerbox: {

        width: 348,
        height: 67,
        shadowOpacity: 1,
        shadowOffset: 12,
        borderRadius: 10,
        borderColor: '#0000001f',
        borderWidth: 0.8,
        marginTop: 15,
        marginLeft: 25,
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: 'white'

    },
    img: {
        height: 20,
        width: 20
    },
    btn: {
        flexDirection: 'row'
    }
    , footer: {
        backgroundColor: '#FFFFFF',


    },
    footertext: {
        textDecorationLine: 'underline',
        display: 'flex',
        flexDirection: 'row'


    },
    underline: {
        height: 25,
        fontFamily: 'DM Sans',
        ////fontWeight: 500,
        fontSize: 18,
        /* or 18px */
        color: 'black',
        marginTop: 5,
        marginLeft: 30,
    },
    blackbtn: {
        width: 349,
        height: 42,
        backgroundColor: '#12352F',
        borderRadius: 10,
        marginTop: 50,
        marginLeft: 18,
        marginBottom: 15
    },
    blacktext: {
        height: 18,
        fontFamily: 'DM Sans',
        ////fontWeight: 700,
        fontSize: 14,
        color: '#FEBF22',
        marginTop: 10,
        marginLeft: 96
    },
    linebottom: {
        width: 106,
        height: 0,
        borderColor: '#707070',
        borderWidth: 2,
        borderRadius: 20,
        marginLeft: 140,
        marginTop: 25


    }

})
export default PaymentScreen
