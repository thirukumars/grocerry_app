import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
function HelpSupport({ navigation }) {
  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <Text style={{ marginTop: 30, marginLeft: 16, marginBottom: 10 }}>HELP WITH OTHER QUERIES</Text>
      <View style={styles.box}>
        <Text style={styles.text}>General issues</Text>
        <TouchableOpacity onPress={() => navigation.navigate("My Account Page")}>
          <Image source={require('../../assets/img/rightarrow.png')} style={{ marginLeft: 225, marginTop: 25 }} />
        </TouchableOpacity>
      </View>
      <View style={styles.box}>
        <Text style={styles.text}>Partner Onboardings</Text>
        <TouchableOpacity>
          <Image source={require('../../assets/img/rightarrow.png')} style={{ marginLeft: 180, marginTop: 25 }} />
        </TouchableOpacity>
      </View>
      <View style={styles.box}>
        <Text style={styles.text}>Legal, Terms & Conditions</Text>
        <TouchableOpacity>
          <Image source={require('../../assets/img/rightarrow.png')} style={{ marginLeft: 140, marginTop: 25 }} />
        </TouchableOpacity>
      </View>
      <View style={styles.box}>
        <Text style={styles.text}>FAQs</Text>
        <TouchableOpacity>
          <Image source={require('../../assets/img/rightarrow.png')} style={{ marginLeft: 295, marginTop: 25 }} />
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
    marginTop: 340,
    marginBottom: 10
  }
})
export default HelpSupport
