import { View, Text, StyleSheet, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import CustomeButton2 from '../../components/CustomeButton2';
import axios from 'axios';
import DropDownPicker from 'react-native-dropdown-picker';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { useNavigation, StackActions, CommonActions } from '@react-navigation/native';
import { Dropdown } from 'react-native-element-dropdown';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const SelectSociety = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const type = route?.params?.type
  console.log("TYPE", type)
  const [selectedLanguage, setSelectedLanguage] = useState();
  const [societyList, setSocietyList] = useState([])
  const [selectedSociety, setSelectedSociety] = useState({})
  const [isClicked, setIsClicked] = useState(false)
  const [data, setData] = useState([])
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([]);
  // const navigation = useNavigation();

  const getSociety = async () => {
    try {
      let res = await axios.get("https://hibee-product.moshimoshi.cloud/society/customer")

      console.log(res?.data?.data)
      setSocietyList(res?.data?.data)
      let societyArray = []
      res?.data?.data.map((item) => {
        societyArray.push({ label: item.societyName, value: item._id })
      })
      setItems(societyArray)
    } catch (e) {
      console.log(e)
    }
  }

  const putSociety = async () => {
    let token = await AsyncStorage.getItem('token')
    const headers = {
      'x-access-token': token,
    }
    if (token) {
      let res = await axios.put("https://hybee-auth.moshimoshi.cloud/user", { "society_id": value }, { headers })
      if (res?.status == 200) {
        console.log("STATUS", res?.status)
        await AsyncStorage.setItem('society', (selectedSociety?._id))
        navigation.navigate('FlatNumber', { type })
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Something went wrong'
        })
      }
    }
    else {
      console.log("selectedSociety", selectedSociety)
      await AsyncStorage.setItem('society', JSON.stringify(selectedSociety))
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'TabHomeBottom' }],
        })
      );
    }
  }

  useEffect(() => {
    getSociety()
  }, [])

  return (
    <SafeAreaProvider style={styles.container} >
      {/* <KeyboardAwareScrollView> */}
      {/* <Image source={require('../../assets/img/backbutton.png')} style={{ marginTop: insets.top, width: 32, height: 22 }} /> */}
      <Toast ref={(ref) => { Toast.setRef(ref) }} />
      <View style={{ flex: 1, marginTop: insets.top + 22 }}>
        <View style={{ width: "100%", flexDirection: "row", alignSelf: "center", marginTop: 22 }}>
          <View style={{
            // position: "absolute",
            width: "33%",
            height: 4,
            // left: 20,
            backgroundColor: "#FEBF22",
            borderRadius: 4
          }}>
          </View>
          <View style={{
            width: "66%",
            height: 4,
            backgroundColor: "#EEEEEE",
            borderRadius: 4,
            // borderWidth: 0.5,
            // position: "relative",
            // margin: 20
          }}>

          </View>
        </View>
        <View style={{ flex: 1, marginTop: 50 }}>
          <Text style={styles.heading}>Find a Hibee </Text>
          <Text style={styles.heading}>near you</Text>
          {/* <Text>Based on your location please select the</Text>
          <Text>society you live in.</Text> */}
          <Text style={{ marginTop: 20 }}>Select the society you live in.</Text>

          <View style={{ marginTop: 36 }}>
            <Dropdown
              value={value}
              data={items}
              onChange={(item) => {
                console.log("SET ITEM", item);
                setValue(item.value)
                setSelectedSociety(societyList[societyList.findIndex(x => x._id == item.value)])
                setValue(item.value)
              }}
              placeholder="Select society"
              maxHeight={180}
              search
              labelField="label"
              valueField="value"
              style={[styles.dropdown, { borderColor: '#8F8F8F', borderWidth: 1 }]}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              itemTextStyle={{ fontSize: 12 }}
            />
          </View>
        </View>
        <View style={{ justifyContent: 'flex-end', paddingBottom: 50 }}>
          <CustomeButton2
            title="Next"
            navigationPath={async () => {
              await putSociety()
            }}
            btnStyle={{ backgroundColor: value != null ? "#12352F" : "grey", height: 40 }}
            btnText={{ color: value == null ? "white" : "#FEBF22", fontSize: 16 }}
            disabled={value == null ? true : false}
          />
        </View>
      </View>
      {/* </KeyboardAwareScrollView> */}
    </SafeAreaProvider>
  );

}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
  },
  btnStyle: {
    textDecorationColor: '#12352F',
  },
  heading: {
    color: '#000000',
    fontSize: 40,
    // fontWeight: 'bold',
    fontWeight: 500
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 12,
  },
});

export default SelectSociety;