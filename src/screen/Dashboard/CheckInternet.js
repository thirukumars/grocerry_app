import { View, Text, StyleSheet, Image } from 'react-native'
import React, { useEffect } from 'react'
import NetInfo from "@react-native-community/netinfo";
import { TouchableOpacity } from 'react-native-gesture-handler';
const CheckInternet = ({ isConnected, setIsconnected }) => {

    useEffect(() => {
        // Subscribe
        const unsubscribe = NetInfo.addEventListener(state => {
            console.log("Connection type", state.type);
            console.log("Is connected?", state.isConnected);
            setIsconnected(state.isConnected)
        });

        // Unsubscribe
        return () => {
            unsubscribe();
        }
    }, [])
    const checkConnection = () => {
        NetInfo.fetch().then(state => {
            console.log("Connection type", state.type);
            console.log("Isconnected?", state.isConnected);
            setIsconnected(state.isConnected)
        });
    }
    return (
        <View style={styles.container}>
            {isConnected == true ? null : (<View style={styles.container}>
                <Image source={require('../../assets/img/nodata.png')} style={styles.image} />
                <Text style={styles.message}>{isConnected == true ? '' : "No Internet Connection"}</Text>
                <TouchableOpacity style={styles.refresh} onPress={() => {
                    checkConnection()
                }}>
                    <Text style={styles.txt}>Reload</Text>
                </TouchableOpacity>
            </View>)}
        </View>

    )
}

export default CheckInternet


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    image: {
        width: 200,
        height: 200,
        alignSelf: 'center',
        marginTop: 200
    },
    message: {
        fontSize: 22,
        //fontWeight: '600',
        color: 'black',
        alignSelf: 'center',
        marginTop: 25
    },
    refresh: {
        backgroundColor: 'black',
        height: 50,
        width: 200,
        alignSelf: 'center',
        marginTop: 109,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    txt: {
        color: "white",
        fontSize: 20,
        //fontWeight: "600"

    }

})


