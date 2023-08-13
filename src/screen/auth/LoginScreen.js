import {
  View,
  Text,
  Image,
  SafeAreaView,
  TextInput,
  StyleSheet,
  Button,
  ScrollView,
  TouchableHighlight,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import CustomeButton1 from '../../components/CustomeButton1';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { AuthContext } from '../../context/AuthContext';
import Spinner from 'react-native-loading-spinner-overlay';
import CheckInternet from '../Dashboard/CheckInternet';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useHeaderHeight } from "@react-navigation/elements";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const LoginScreen = () => {

  const navigation = useNavigation();
  const { isLoading, login } = useContext(AuthContext);
  const [phone, setPhone] = useState('')
  const [isConnected, setIsconnected] = useState(true)
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();

  const keyboardVerticalOffset = Platform.OS === 'ios' ? 100 : 0
  return (
    <SafeAreaProvider>
      <KeyboardAwareScrollView>
        <View style={{ marginTop: insets.top, height: "100%", backgroundColor: "white" }}>
          <Spinner visible={isLoading} />
          {isConnected ? (
            <>
              <View style={styles.canvasContainer}>
                <Image
                  resizeMode="cover"
                  source={require('../../assets/img/loginImg.jpg')}
                  style={styles.canvas}
                />
              </View>

              <View>
                <Text></Text>
              </View>


              <View style={styles.mainDiv}>
                <Text style={styles.heading}>Fresh groceries at</Text>
                <Text style={styles.heading}>your doorstep.</Text>
                <TouchableOpacity onPress={() => navigation.navigate("SignupScreen")}>
                  {/* <Text style={styles.smtext}>Signup</Text> */}
                </TouchableOpacity>

                <Text style={{ color: "#3C5F58", fontWeight: '500', marginTop: 30, fontSize: 14 }}>Log in or Sign up</Text>
                <TextInput
                  style={styles.input}
                  placeholder="+91    Enter your phone number"
                  name="phone"
                  onChangeText={(text) => {
                    let updatedtext = text.replace(/[^0-9]/g, '')
                    setPhone(updatedtext)
                  }}
                  autoComplete='off'
                  autoCorrect={false}
                  autoCapitalize='none'
                  maxLength={10}
                  value={phone}
                  keyboardType='number-pad'
                />
                {/* </KeyboardAvoidingView> */}
                <CustomeButton1
                  title="Continue"
                  onPress={() => {
                    login(phone)
                  }}
                  btnStyle={{ backgroundColor: phone.length == 10 ? "#FEBF22" : "#D4C6A0", }}
                  disabled={phone.length == 10 ? false : true}
                  navigationPath={() => { navigation.navigate('Otp', { phone: phone }) }}
                  btnText={{ fontSize: 14, fontWeight: 500, color: "#12352F" }}
                />
                <TouchableOpacity style={{ marginTop: 16, alignItems: "center", justifyContent: "center" }} onPress={async () => {
                  let society = await AsyncStorage.getItem('society')
                  if (society !== null) {
                    navigation.dispatch(
                      CommonActions.reset({
                        index: 0,
                        routes: [{ name: 'TabHomeBottom' }],
                      })
                    );
                  }
                  else {
                    console.log("ELSE CONDITION")
                    await AsyncStorage.setItem('skipLogin', "yes").then(() => navigation.navigate("SelectSociety"))

                  }
                }
                }
                >
                  <Text style={{ fontSize: 14, textDecorationLine: "underline", marginTop: 33, fontWeight: 500, color: "#3C5F58" }}>Skip for now</Text>
                </TouchableOpacity>
                <View style={{ backgroundColor: "white", marginTop: 60, }}>

                  <TouchableOpacity onPress={() => navigation.navigate("About us")} style={{}}>
                    <Text style={styles.bottomText}>
                      Cookie policy | Terms & Conditions
                    </Text>

                  </TouchableOpacity>
                </View>

              </View>
            </>) : null}

          {/* <CheckInternet isConnected={isConnected} setIsconnected={setIsconnected} /> */}
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaProvider>
  );
};

var styles = StyleSheet.create({
  canvasContainer: {

  },
  heading: {
    color: '#12352F',
    fontSize: 32,
    textAlign: 'center',
    fontWeight: 'bold',
  },

  canvas: {
    width: '100%',
    height: undefined,
    aspectRatio: 1,
    marginTop: -76
  },
  smtext: {
    textDecorationColor: '#3C5F58',
    textAlign: 'center',
    fontSize: 17,
    paddingTop: 10,
    paddingBottom: 10,
  },
  mainDiv: {
    marginTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
  },
  input: {
    marginBottom: 20,
    height: 40,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    marginTop: 8
  },
  bottomText: {
    color: '#8F8F8F',
    fontSize: 12,
    textAlign: 'center',
  },
});
export default LoginScreen;
