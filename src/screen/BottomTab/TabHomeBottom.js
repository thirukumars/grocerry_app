import { View, Text, Image } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MainPage from '../Dashboard/MainPage';
import Category from '../Dashboard/Category';
import SelectSociety from './SelectSociety';
import MyAccount from './MyAccount';
import OrderHistory from '../Dashboard/OrderHistory';

const Bottom = createBottomTabNavigator();
const BottomNavigator = ({ navigation }) => {
  return (
    <>
      <Bottom.Navigator style={{ borderWidth: 10 }}
        initialRouteName={'MainPage'}
        screenOptions={{
          tabBarInactiveBackgroundColor: 'white',
          tabBarActiveBackgroundColor: 'white',
          tabBarShowLabel: false
        }}
      >

        <Bottom.Screen
          name="MainPage"
          component={MainPage}
          options={{
            headerShown: false,
            tabBarIcon: tabInfo => {
              return (
                <>
                  <Image
                    source={require('../../assets/img/homeicon.png')}
                    style={{
                      width: 20,
                      height: 20,
                      tintColor: tabInfo.focused ? '#12352F' : '#BCBCBC',
                      marginTop: 10
                    }}
                  />
                  <Text style={{ color: tabInfo.focused ? '#12352F' : '#BCBCBC', marginTop: 5 }}>
                    Home
                  </Text>
                </>
              );
            },
          }}
        />
        <Bottom.Screen
          name="Category"
          component={Category}
          options={{
            headerShown: false,
            tabBarIcon: tabInfo => {
              return (
                <>
                  <Image
                    source={require('../../assets/img/categories.png')}
                    style={{
                      width: 20,
                      height: 20,
                      tintColor: tabInfo.focused ? '#12352F' : '#BCBCBC',
                      marginTop: 10
                    }}
                  />
                  <Text style={{ color: tabInfo.focused ? '#12352F' : '#BCBCBC', marginTop: 5 }}>
                    Categories
                  </Text>
                </>
              );
            },
          }}
        />
        <Bottom.Screen
          name="Account"
          component={MyAccount}
          options={{
            headerShown: false,
            tabBarIcon: tabInfo => {
              return (
                <>
                  <Image
                    source={require('../../assets/img/account.png')}
                    style={{
                      width: 20,
                      height: 20,
                      tintColor: tabInfo.focused ? '#12352F' : '#BCBCBC',
                      marginTop: 10
                    }}
                  />
                  <Text style={{ color: tabInfo.focused ? '#12352F' : '#BCBCBC', marginTop: 5 }}>
                    Account
                  </Text>
                </>
              );
            },
          }}
        />

      </Bottom.Navigator>
    </>
  );
};

export default BottomNavigator;