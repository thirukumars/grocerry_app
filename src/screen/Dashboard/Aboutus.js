import React from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
function Aboutus() {
    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <Text style={{ padding: 15, marginTop: 15 }}>Lorem ipsum dolor sit amet, consectet adipiscing elit. Et quam accumsan congue purus consec. Lorem ipsum dolor sit amet, consectet adipiscing elit. Et quam accumsan congue purus consec.Lorem ipsum dolor sit amet, consectet adipiscing elit. Et quam accumsan congue purus consec.Lorem ipsum dolor sit amet, consectet adipiscing elit. Et quam accumsan congue purus consec.Lorem ipsum dolor sit amet, consectet adipiscing elit.

                Et quam accumsan congue purus consec.Lorem ipsum dolor sit amet, consectet adipiscing elit. Et quam accumsan congue purus consec
                Lorem ipsum dolor sit amet, consectet adipiscing elit. Et quam accumsan congue purus consec.Lorem ipsum dolor sit amet, consectet adipiscing elit.
                Et quam accumsan congue purus consec.Lorem ipsum dolor sit amet, consectet adipiscing elit. Et quam accumsan congue purus consec.Lorem ipsum dolor</Text>

            <View style={styles.line}>

            </View>
            <View style={styles.box}>
                <Text style={styles.text}>Privacy Policy</Text>
                <TouchableOpacity>
                    <Image source={require('../../assets/img/rightarrow.png')} style={{ marginLeft: 220, marginTop: 25 }} />
                </TouchableOpacity>
            </View>
            <View style={styles.box}>
                <Text style={styles.text}>Terms & Conditions</Text>
                <TouchableOpacity>
                    <Image source={require('../../assets/img/rightarrow.png')} style={{ marginLeft: 180, marginTop: 25 }} />
                </TouchableOpacity>
            </View>
            <View style={styles.box}>
                <Text style={styles.text}>Licenses</Text>
                <TouchableOpacity>
                    <Image source={require('../../assets/img/rightarrow.png')} style={{ marginLeft: 258, marginTop: 25 }} />
                </TouchableOpacity>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    line: {
        width: 328,
        height: 0,
        borderWidth: 1,
        opacity: 0.1,
        marginLeft: 20
    },
    box: {
        width: 400,
        height: 70,
        backgroundColor: 'white',
        borderWidth: 0.5,
        borderColor: 'grey',
        display: 'flex',
        flexDirection: 'row'
    },
    text: {
        height: 21,
        fontFamily: 'DM Sans',
        //fontWeight: 700,
        fontSize: 16,
        color: '#12352F',
        marginTop: 20,
        marginLeft: 20
    },
    linebottom: {
        width: 106,
        height: 0,
        borderColor: '#707070',
        borderWidth: 2,
        borderRadius: 20,
        marginLeft: 140,
        marginTop: 135,
        marginBottom: 10
    }
})
export default Aboutus
