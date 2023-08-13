import { View, Text, StyleSheet, TextInput, Pressable, Image } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';

import React, { useState, useEffect } from 'react';
import CustomeButton2 from '../../components/CustomeButton2';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
const countries = ['Egypt', 'Canada', 'Australia', 'Ireland'];
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Toast from 'react-native-toast-message';
import { useNavigation, CommonActions } from '@react-navigation/native';
const DetailsPage = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [isFinishButtonEnabled, setFinishButtonEnabled] = useState(false);
  const validateName = (name) => {
    // Add your name validation logic here
    return name.trim() !== ''; // For example, check if the name is not empty
  };

  const validateEmail = (email) => {
    // Add your email validation logic here
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const handleNameChange = (text) => {
    setName(text);
    setFinishButtonEnabled(validateName(text) && validateEmail(email));
  };
  const handleEmailChange = (text) => {
    setEmail(text);
    setFinishButtonEnabled(validateName(name) && validateEmail(text));
  };
  const getUserDetails = async () => {

    let token = await AsyncStorage.getItem('token')
    const headers = {
      'x-access-token': token,
    }

    let response = await axios.get('https://hybee-auth.moshimoshi.cloud/user', { headers })
    console.log("USER DETAILS", response?.data?.data)
    setName(response?.data?.data?.name)
    setEmail(response?.data?.data?.email)
  }

  const editProfile = async () => {
    if (isFinishButtonEnabled) {
      try {
        let token = await AsyncStorage.getItem('token')
        const headers = {
          'x-access-token': token,
        }
        let response = await axios.put('https://hybee-auth.moshimoshi.cloud/user', { name, email }, { headers })
        console.log("DATA", response?.status)
        if (response?.status == 200) {
          Toast.show({
            type: 'success',
            text2: 'Profile Updated'
          })
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'TabHomeBottom' }],
            })
          );
        } else {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'Something went wrong'
          })
        }
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: error,
          text2: 'Something went wrong'
        })
      }
    }
  }
  useEffect(() => {
    getUserDetails()
  }, [])

  return (
    <SafeAreaProvider style={styles.container}>
      <KeyboardAwareScrollView>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require('../../assets/img/backbutton.png')} style={{ marginTop: insets.top, width: 32, height: 22 }} />
        </TouchableOpacity>
        <View style={{ flex: 1, marginTop: 22 }}>
          <Toast ref={(ref) => { Toast.setRef(ref) }} />
          <View style={{ width: "100%", flexDirection: "row", alignSelf: "center", marginTop: 22 }}>
            <View style={{
              // position: "absolute",
              width: "100%",
              height: 4,
              // left: 20,
              backgroundColor: "#FEBF22",
              borderRadius: 4
            }}>
            </View>
            {/* <View style={{
              width: "66%",
              height: 4,
              backgroundColor: "#EEEEEE",
              borderRadius: 4,
              // borderWidth: 0.5,
              // position: "relative",
              // margin: 20
            }}>

            </View> */}
          </View>
          <View style={{ flex: 1, paddingTop: 100 }}>
            <Text style={styles.heading}>Finish your {"\n"}account set up</Text>

            <View style={{ marginTop: 25 }}>
              <TextInput
                style={styles.input}
                placeholder="Enter your Full Name"
                value={name}
                onChangeText={handleNameChange}
              />
            </View>
            <View style={{ marginTop: 15 }}>
              <TextInput style={styles.input} placeholder="Enter your Email" value={email} onChangeText={handleEmailChange} />
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
      <View style={{ justifyContent: 'flex-end', paddingBottom: 50 }}>
        <Pressable style={{
          backgroundColor: isFinishButtonEnabled ? "#12352F" : "grey",
          borderRadius: 10,
          alignItems: "center",
          alignSelf: "center",
          justifyContent: "center",
          width: "90%",
          height: 40,
          alignSelf: 'center',
          // position: 'absolute',
          // bottom: 15,
          disabled: !isFinishButtonEnabled,
          marginTop: 30
        }}
          onPress={editProfile}
        >
          <Text style={{ color: isFinishButtonEnabled ? "#FEBF22" : "white", fontSize: 16 }}>Finish
          </Text>
        </Pressable>
      </View>
    </SafeAreaProvider >
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
    height: 50,
    borderWidth: 1,
    padding: 10,
    borderRadius: 2,
  },
});

export default DetailsPage;
