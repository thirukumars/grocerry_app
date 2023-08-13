import React from 'react'
import { View, Text, Image, StatusBar, StyleSheet } from 'react-native'
import BottomNavigator from '../BottomTab/TabHomeBottom'
function PageNotFound() {
    return (
        <View>
            <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

                <Image source={require('../../assets/img/nodata.png')} style={{ marginTop: 200 }} />
                <Text style={styles.bigtext}>No Data Available</Text>
                <Text style={styles.smalltext}>There is no data to show you
                    right now.</Text>
            </View>
            <BottomNavigator style={{ marginTop: 200 }} />
        </View>

    )
}
const styles = StyleSheet.create({
    bigtext: {

        fontFamily: 'DM Sans',
        //fontWeight: 700,
        fontSize: 20,
        color: '#000000',
        marginTop: 10,

    },
    smalltext: {
        fontFamily: 'DM Sans',
        //fontWeight: 400,
        fontSize: 14,
        color: '#000000',
        marginTop: 10,
        marginBottom: 322
    }
})
export default PageNotFound
