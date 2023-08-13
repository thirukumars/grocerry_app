import { View, Text, StyleSheet, TextInput, Button, TouchableOpacity, TextComponent, Pressable, Image } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import axios from 'axios'
import React, { useState, useEffect } from 'react';
import CustomeButton2 from '../../components/CustomeButton2';
import DropDownPicker from 'react-native-dropdown-picker';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { useNavigation, StackActions, CommonActions } from '@react-navigation/native';
import { Dropdown } from 'react-native-element-dropdown';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const FlatNumber = ({ navigation, route }) => {

  const insets = useSafeAreaInsets();
  const type = route?.params?.type
  // const [isLoading, setIsLoading] = useState(false);
  const [flat_no, setFlatNo] = useState("");
  const [towers, setTowers] = useState([]);
  const [villas, setVillas] = useState([])
  const [selectedVilla, setSelectedVilla] = useState("")
  const [selectedTower, setSelectedTower] = useState("")
  const [villaValidation, setVillaValidation] = useState(true)
  const [towerValidation, setTowerValidation] = useState(true)
  const [floorValidation, setFloorValidation] = useState(true)
  const [flatValidation, setFlatValidation] = useState(true)
  const [floors, setFloors] = useState([]);
  const [societyDropdown, setSocityDropdown] = useState(false)
  const [societyDropdownData, setSocietyDropdownData] = useState([])
  const [floorDropdown, setFloorDropdown] = useState(false)
  const [selectedFloor, setSelectedFloor] = useState("")
  const [nextButtonEnabled, setNextButtonEnabled] = useState(false)
  const onChangeFloorHandler = (floor) => {
    setFloor(floor);
  };
  const onChangeBuildingHandler = (building) => {
    // setBuilding(building);
  };

  const fetchTowers = async () => {
    try {
      let society = (await AsyncStorage.getItem('society'))

      console.log('https://hibee-product.moshimoshi.cloud/society/floors?societyId=' + society)
      const response = await axios.get('https://hibee-product.moshimoshi.cloud/society/floors?societyId=' + society);
      if (response.status === 200) {
        let tempvillaarray = []
        response.data.data?.villas.map((item) => {
          tempvillaarray.push({ label: item.villaName, value: item.villaName })
        })
        setVillas(tempvillaarray)
        setSocietyDropdownData(response.data.data.towers)
        let temparray = []

        response.data.data?.towers.map((item) => {
          temparray.push({ label: item.towerName, value: item.towerName })
        })

        setTowers(temparray)
      }
    } catch (error) {
      console.log(error)
    }
  }

  // const nextButtonEnabled=()=>{
  //   setnext flatValidation && floorValidation && towerValidation
  // }

  const putFlatDetails = async () => {

    let token = await AsyncStorage.getItem('token')
    const headers = {
      'x-access-token': token,
    }
    let res = await axios.put("https://hybee-auth.moshimoshi.cloud/user", { tower: selectedTower, floor: selectedFloor, flat_no: flat_no, villa: selectedVilla }, { headers })
    if (res?.status == 200) {
      console.log("STATUS", res?.status)
      if (type == 'edit') navigation.navigate('TabHomeBottom')
      else
        navigation.navigate('DetailsPage')
    } else {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Something went wrong'
      })
    }


  }

  useEffect(() => {
    fetchTowers()
  }, [])

  // useEffect(() => {
  //   if (towers?.length > 0 && villas.length == 0)
  //     setNextButtonEnabled(flat_no > 0 && floorValidation && towerValidation)
  //   else if (villas.length > 0 && towers?.length == 0) {
  //     setNextButtonEnabled(villaValidation)
  //   }
  //   else {
  //     console.log("ELSE")
  //     setNextButtonEnabled(flat_no > 0 && floorValidation && towerValidation || villaValidation)
  //   }

  // }, [selectedTower, selectedFloor, flat_no, selectedVilla])

  useEffect(() => {
    // Logic to enable the next button based on the selected address type
    if (selectedVilla) {
      // If a villa is selected, all other fields should be empty
      setNextButtonEnabled(true);
      setSelectedTower('');
      setSelectedFloor('');
      setFlatNo('');
    } else if (selectedTower && selectedFloor && flat_no.length > 0) {
      // If a tower is selected and tower floor and flat number are filled, enable the next button
      setNextButtonEnabled(true);
      setSelectedVilla('');
    } else {
      // Otherwise, disable the next button
      setNextButtonEnabled(false);
    }
  }, [selectedVilla, selectedTower, selectedFloor, flat_no]);

  const handleVillaSelect = (item) => {
    setSelectedVilla(item.value);
    setVillaValidation(true);
    setSelectedTower('');
    setSelectedFloor('');
    setFlatNo('');
  };

  const handleTowerSelect = (item) => {
    setSelectedTower(item.value);
    setTowerValidation(true);
    setSelectedVilla('');
    setFlatNo('');
  };

  useEffect(() => {
    console.log("asdasd", selectedTower)
    if (selectedTower.length > 0) {
      console.log("TOWER IS SLEECTEDD")
      console.log("JHJO", societyDropdownData[towers?.findIndex(x => x?.value === selectedTower)])
      let tempfloors = societyDropdownData[towers?.findIndex(x => x?.value === selectedTower)]
      let tempfloorsarray = []
      console.log("weqweqw", tempfloors)
      tempfloors?.floors?.map((item) => {
        console.log("ITEM-->", item)
        tempfloorsarray.push({ label: item.floorName, value: item.floorName })
      })
      console.log("FLOORS", tempfloorsarray)
      setFloors(tempfloorsarray)

    }
  }, [selectedTower])

  const onSubmitFormHandler = async (event) => {
    // if (!fullName.trim() || !email.trim()) {
    //   alert("Name or Email is invalid");
    //   return;
    // }
    try {
      const response = await axios.post('https://hybee-auth.moshimoshi.cloud/user/customer_register', {
        flat_no,
        // floor,
        // building
      });
      if (response.status === 200) {
        console.warn(`flat details`);
        setBuilding('');
        setFlatNo('')
        navigation.navigate("DetailsPage")

      } else {
        throw new Error("An error has occurred");
      }
    } catch (error) {
      // alert("An error has occurred");
      navigation.navigate("DetailsPage")
    }
  };

  return (
    <SafeAreaProvider style={styles.container}>
      <KeyboardAwareScrollView>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require('../../assets/img/backbutton.png')} style={{ marginTop: insets.top, width: 32, height: 22 }} />
        </TouchableOpacity>
        <View style={{}}>
          <View style={{ width: "100%", flexDirection: "row", alignSelf: "center", marginTop: 22 }}>
            <View style={{
              // position: "absolute",
              width: "66%",
              height: 4,
              // left: 20,
              backgroundColor: "#FEBF22",
              borderRadius: 4
            }}>
            </View>
            <View style={{
              width: "33%",
              height: 4,
              backgroundColor: "#EEEEEE",
              borderRadius: 4,
              // borderWidth: 0.5,
              // position: "relative",
              // margin: 20
            }}>

            </View>
          </View>
          <View style={{ flex: 1, marginTop: 30 }}>
            <Text style={styles.heading}>Enter your flat </Text>
            <Text style={styles.heading}>details</Text>
            <Text style={{ fontSize: 16, fontWeight: 400, marginTop: 18 }}>Where do you want your products to be </Text>
            <Text style={{ fontSize: 16, fontWeight: 400 }}>delivered at?</Text>
            <View style={{ marginTop: 15 }}>
              {villas?.length > 0 ? <>
                <Dropdown
                  value={selectedVilla}
                  data={villas}
                  onChange={handleVillaSelect}
                  placeholder="Select Villa"
                  labelField="label"
                  valueField="value"
                  search
                  style={[styles.dropdown, { borderColor: '#8F8F8F', borderWidth: 1 }]}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  placeholderStyle={{ fontSize: 14, color: "#8F8F8F" }}
                  itemTextStyle={{ fontSize: 12 }}
                  maxHeight={180}
                />
                {villaValidation == false && <Text style={{ color: "red" }}>Please select a Tower</Text>}
              </>
                : null}
              {towers?.length > 0 ? <>
                <Dropdown
                  value={selectedTower}
                  data={towers}
                  onChange={handleTowerSelect}
                  placeholder="Select Tower"
                  labelField="label"
                  valueField="value"
                  search
                  style={[styles.dropdown, { borderColor: '#8F8F8F', borderWidth: 1, marginTop: 40 }]}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  placeholderStyle={{ fontSize: 14, color: "#8F8F8F" }}
                  maxHeight={180}
                  itemTextStyle={{ fontSize: 12 }}
                />
                {towerValidation == false && <Text style={{ color: "red" }}>Please select a Tower</Text>}
                < Dropdown
                  value={selectedFloor}
                  data={floors}
                  onChange={(item) => {
                    setFloorValidation(true)
                    setSelectedFloor(item.value)
                  }}
                  labelField="label"
                  valueField="value"
                  placeholder="Select Floor"
                  style={[styles.dropdown, { borderColor: '#8F8F8F', borderWidth: 1, marginTop: 40 }]}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  placeholderStyle={{ fontSize: 14, color: "#8F8F8F" }}
                  maxHeight={180}
                  itemTextStyle={{ fontSize: 12 }}
                />
                {floorValidation == false && <Text style={{ color: "red" }}>Please select a Floor</Text>}
                <View style={{ marginTop: 40 }}>

                  <TextInput
                    style={styles.input}
                    placeholder="Select Flat Number"
                    returnKeyType='go'
                    value={flat_no}
                    placeholderTextColor={"#8F8F8F"}
                    placeholderStyle={{ fontSize: 14, fontWeight: 500, color: "#8F8F8F" }}
                    onChangeText={(value) => {
                      if (value.length > 0) {
                        setFlatValidation(true)
                      } else {
                        setFlatValidation(false)
                      }
                      setFlatNo(value)
                    }}
                    zIndex={998}
                  />
                  {flatValidation == false && <Text style={{ color: "red" }}>Please select a Flat</Text>}
                </View></> : null}
            </View>

          </View>
        </View>
      </KeyboardAwareScrollView>
      <View style={{ justifyContent: 'flex-end', paddingBottom: 50 }}>
        <Pressable style={{
          backgroundColor: nextButtonEnabled ? "#12352F" : "grey",
          borderRadius: 10,
          alignItems: "center",
          alignSelf: "center",
          justifyContent: "center",
          width: "90%",
          height: 40,
          alignSelf: 'center',
          // position: 'absolute',
          // bottom: 15,
          marginTop: 30
        }}
          disabled={!nextButtonEnabled}
          onPress={putFlatDetails}>
          <Text style={{ color: nextButtonEnabled ? "#FEBF22" : "white", fontSize: 16 }}>Next
          </Text>
        </Pressable>
      </View>
    </SafeAreaProvider>
  );
};

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
  input: {
    marginBottom: 10,
    height: 44,
    borderWidth: 1,
    padding: 10,
    borderRadius: 4,
    borderColor: '#8F8F8F'
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  placeholderStyle: {
    fontSize: 14,
    color: "pink",
    fontWeight: 500
  },
  selectedTextStyle: {
    fontSize: 12,
  },
});

export default FlatNumber;
