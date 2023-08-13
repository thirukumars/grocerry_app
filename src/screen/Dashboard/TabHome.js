import { View, Text, StyleSheet, Image, TouchableOpacity, Button, ScrollView } from 'react-native';
import React from 'react';
import CustomeButton3 from '../../components/customButton3';
import CustomeButton4 from '../../components/CustomerButton4';
import { useNavigation } from '@react-navigation/native';

const TabHome = () => {
  const navigation = useNavigation()
  return (
    <ScrollView>
      <View style={styles.box}>
        <Text style={styles.headerText}>Get your orders delivered {"\n"}under 8 minutes!</Text>

        <View style={styles.bigbox}>
          <View style={styles.apple}>
            <View style={{
              display: "flex", alignSelf: 'flex-end', width: 48,
              height: 18, backgroundColor: '#12352F', justifyContent: 'center', alignItems: 'center', borderRadius: 4, padding: 5
            }}>
              <Text style={{ color: '#FFF15C', fontSize: 8, fontFamily: 'DM Sans', }}>14% OFF</Text>

            </View>
            <Image source={require('../../assets/img/apples.png')} style={{ marginLeft: 25, marginTop: 20 }} />
            <Text style={styles.text}>Royal Gala Apple</Text>
            <Text style={styles.text1}>500 g</Text>
            <Text style={styles.text2}>₹120</Text>
            <Text style={{ textDecorationLine: 'line-through', textDecorationStyle: 'solid' }}>
              ₹136
            </Text>
            <View style={styles.container}>
              <TouchableOpacity style={styles.adds}>
                <Image source={require('../../assets/img/cross.png')} style={{ marginBottom: 15, marginTop: -3 }} />
              </TouchableOpacity>
            </View>
          </View>


          <View style={styles.apple}>

            <Image source={require('../../assets/img/bigbread.png')} style={{ marginLeft: 25, marginTop: 25 }} />
            <Text style={styles.text}>Sliced bread</Text>
            <Text style={styles.text1}>400g</Text>
            <Text style={styles.text2}>₹80</Text>
            <Text style={{ textDecorationLine: 'line-through', textDecorationStyle: 'solid' }}>
              ₹85
            </Text>
            <View style={styles.container}>
              <TouchableOpacity style={styles.adds}>
                <Image source={require('../../assets/img/cross.png')} style={{ marginBottom: 15, marginTop: -3 }} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <CustomeButton4 title="View All" style={{ marginTop: 0, fontSize: 40 }}
          navigationPath={() => navigation.navigate('Category')} />
      </View>

      <View style={{ flex: 1, flexDirection: 'row' }}>

        <Image source={require('../../assets/img/Potato.png')} />
        <View>
          <Text style={styles.textVeg}>Vegetables</Text>
          <Text style={styles.underline}>16 products</Text>
        </View>
        <Image source={require('../../assets/img/arrow.png')} style={{ marginTop: 25, marginLeft: 150 }} />

      </View>

      <View style={styles.bottombox}>

        <View style={styles.applebig}>
          <View style={{
            display: "flex", alignSelf: 'flex-end', width: 48,
            height: 18, backgroundColor: '#12352F', justifyContent: 'center', alignItems: 'center', borderRadius: 4, padding: 5
          }}>
            <Text style={{ color: '#FFF15C', fontSize: 8, fontFamily: 'DM Sans', fontWeight: 600, }}>14% OFF</Text>

          </View>
          <Image source={require('../../assets/img/pichoi.png')} style={{ marginLeft: 25, marginTop: 12 }} />
          <Text style={[styles.textfooter, { marginTop: 10 }]}>Coriander Bunch
            (Kothambari Soppu)</Text>
          <Text style={[styles.text1, { marginTop: 5 }]}>20g</Text>
          <Text style={[styles.text2, { marginTop: 10 }]}>₹6</Text>
          <Text style={{ textDecorationLine: 'line-through', textDecorationStyle: 'solid' }}>
            ₹7
          </Text>
          <View style={[styles.container, { marginLeft: 90 }]}>
            <TouchableOpacity style={styles.adds}>
              <Image source={require('../../assets/img/cross.png')} style={{ marginBottom: 15, marginTop: -3 }} />
            </TouchableOpacity>
          </View>
        </View>


        <View style={styles.applebig}>

          <Image source={require('../../assets/img/tomato.png')} style={{ marginLeft: 6, marginTop: 25 }} />
          <Text style={styles.text}>Organic tomato</Text>
          <Text style={styles.text1}>500g</Text>
          <Text style={styles.text2}>₹70</Text>
          <Text style={{ textDecorationLine: 'line-through', textDecorationStyle: 'solid' }}>
            ₹73
          </Text>
          <View style={[styles.container, { marginLeft: 90 }]}>
            <TouchableOpacity style={styles.adds}>
              <Image source={require('../../assets/img/cross.png')} style={{ marginBottom: 15, marginTop: -3 }} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.linebottom}>

      </View>

    </ScrollView>
  );
};



const styles = StyleSheet.create({

  box: {
    height: 400,
    width: 394,
    backgroundColor: '#FFF9EB'
  },
  linebottom: {
    width: 106,
    height: 0,
    borderColor: '#707070',
    borderWidth: 2,
    borderRadius: 20,
    marginLeft: 140,
    marginTop: 15,
    marginBottom: 10


  },
  headerText: {
    height: 38,
    fontFamily: 'DM Sans',
    fontWeight: 700,
    fontSize: 16,
    /* or 19px */
    textAlign: 'center',
    color: '#3D3D3D',
    marginTop: 20

  },
  bigbox: {

    height: 184,
    width: 380,
    borderColor: 'white',
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap'
  },


  apple: {
    width: 118,
    height: 184,
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    marginLeft: 25,
    marginTop: 20,
    padding: 5
  },
  applebig: {

    width: 148,
    height: 214,
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    marginTop: 80,
    marginLeft: 30,
    padding: 5
  },
  text: {
    height: 18,
    fontFamily: 'DM Sans',
    fontWeight: 500,
    fontSize: 14,
    /* or 18px */
    color: '#3C5F58'
  },

  text1: {
    height: 18,
    fontFamily: 'DM Sans',
    fontWeight: 500,
    fontSize: 10,
    /* or 18px */
    color: '#3C5F58',
    marginTop: 3
  },
  text2: {
    height: 18,
    fontFamily: 'DM Sans',
    fontWeight: 500,
    fontSize: 14,
    /* or 18px */
    color: '#000000',
    marginTop: 3,
    marginTop: 5
  },
  // adds: {
  //   boxSizing: 'border-box',

  //   /* Auto layout */

  //   flex: 1,
  //   flexDirection: 'row',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   padding: 8,
  //   gap: 8,
  //   width: 28,
  //   height: 28,
  //   background: '#F1F9F3',
  //   border: 0.4,
  //   borderColor: '#12352F',
  //   borderRadius: 4,
  //   backgroundColor: 'white'

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
  adds: {
    alignItems: 'center',
    backgroundColor: 'white',
    border: 2,
    borderColor: '#12352F',
    borderWidth: 1,
    padding: 10,
    width: 32,
    height: 28,
    borderRadius: 4,
    color: 'black',
    backgroundColor: '#F1F9F3'

  },

  textVeg: {
    height: 21,
    fontFamily: 'DM Sans',
    fontWeight: 500,
    fontSize: 16,
    /* identical to box height */
    color: '#000000',
    marginLeft: 35,
    marginTop: 10


  },
  underline: {
    height: 21,
    fontFamily: 'DM Sans',
    fontWeight: 500,
    fontSize: 12,
    /* identical to box height */
    color: '#8F8F8F',

    marginLeft: 35,
    marginTop: 2,
    textDecorationLine: 'underline'

  },
  bottombox: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 10,
    backgroundColor: 'white',
    height: 300
  },
  footerbox: {
    width: 180,
    height: 260,
    border: 1,
    borderColor: '#F5F5F5',
    borderWidth: 1

  }
})
export default TabHome;
