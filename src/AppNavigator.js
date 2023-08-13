import {View, Text, ActivityIndicator, Image} from 'react-native';
import React, {useContext} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer, StackActions} from '@react-navigation/native';
import LoginScreen from './screen/auth/LoginScreen';
import SelectSociety from './screen/BottomTab/SelectSociety';
import FlatNumber from './screen/auth/FlatNumber';
import DetailsPage from './screen/auth/DetailsPage';
import MainPage from './screen/Dashboard/MainPage';
import Search from './screen/Dashboard/Search';
import MyAccount from './screen/BottomTab/MyAccount';
import TabHome from './screen/Dashboard/TabHome';
import Category from './screen/Dashboard/Category';
import Product from './screen/Dashboard/Product';
import CartScreen from './screen/Dashboard/CartScreen';
import PaymentScreen from './screen/Dashboard/PaymentScreen';
import OrderSuccessful from './screen/Dashboard/OrderSuccessful';
import OrderDetailsPro from './screen/Dashboard/OrderDetailsPro';
import OrderHistory from './screen/Dashboard/OrderHistory';
// import TabHomeBottom from './screen/BottomTab/TabHomeBottom'
import Aboutus from './screen/Dashboard/Aboutus';
import HelpSupport from './screen/Dashboard/HelpSupport';
import PageNotFound from './screen/Dashboard/PageNotFound';
import Signup from './screen/Dashboard/Signup';
import Splash from './normal/Splash';
import Otp from './screen/auth/Otp';
import {AuthContext} from '../src/context/AuthContext';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import CategoryList from './screen/Dashboard/CategoryList';
import PaymentOption from './screen/Dashboard/PaymentOption';
import SearchResults from './screen/Dashboard/SearchResults';
import MyDetails from './screen/Dashboard/MyDetails';
import EditAccountDetails from './screen/Dashboard/EditAccountDetails';
import CouponList from './screen/Dashboard/CouponList';
import Nativity from './screen/Dashboard/Nativity';
import ProductListPage from './screen/Dashboard/ProductListPage';

const Bottom = createBottomTabNavigator();

const Stack = createStackNavigator();

const initialNavigator = () => {
  const linking = {
    prefixes: ['hibee://'],
    config: {
      screens: {
        TabHomeBottom: {
          screens: {
            CategoryNavigator: {
              screens: {
                Category: 'category',
                Product: 'category/product/:productId',
              },
            },
          },
        },
        // Category: 'TabHomeBottom/Category',
        // Profile: 'settings/profile',
        // Details: 'home/details/:id',
      },
    },
  };
  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen
          name="Splash"
          component={Splash}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="About us"
          component={Aboutus}
          options={{headerShown: true}}
        />
        <Stack.Screen
          name="Otp"
          component={Otp}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="SignupScreen"
          component={Signup}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="TabHomeBottom"
          component={TabHomeBottom}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="SelectSociety"
          component={SelectSociety}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="FlatNumber"
          component={FlatNumber}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="DetailsPage"
          component={DetailsPage}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const MainStackScreens = () => {
  return (
    // <NavigationContainer>
    <Stack.Navigator initialRouteName="MainPage">
      <Stack.Screen
        name="MainPage"
        component={MainPage}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
    // </NavigationContainer>
  );
};

const CategoryStackScreens = ({route}) => {
  const categoryId = route.params?.categoryId || 0;
  const productId = route.params?.productId || 0;
  console.log('PRODUCT ID', route, productId);
  return (
    // <NavigationContainer>
    <Stack.Navigator initialRouteName="CategoryList">
      <Stack.Screen
        name="CategoryList"
        component={CategoryList}
        options={{headerShown: false}}
        // initialParams={{ categoryId }}
      />
      <Stack.Screen
        name="CategoryScreen"
        component={Category}
        options={{headerShown: false}}
        initialParams={{categoryId}}
      />
      <Stack.Screen
        name="Product"
        component={Product}
        options={{headerShown: false}}
        // initialParams={{ productId }}
      />
      <Stack.Screen
        name="Nativity"
        component={Nativity}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ProductListPage"
        component={ProductListPage}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
    // </NavigationContainer>
  );
};

const CartStackScreens = ({route}) => {
  return (
    // <NavigationContainer>
    <Stack.Navigator initialRouteName="CartScreen">
      <Stack.Screen
        name="Cart"
        component={CartScreen}
        options={{headerShown: false}}
        // listeners={({ navigation }) => ({
        //     // Reset the navigation stack when navigating back from the Cart screen
        //     blur: () => {
        //         navigation.dispatch(StackActions.popToTop());
        //     },
        // })}
      />
      <Stack.Screen
        name="CouponList"
        component={CouponList}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Payment Screen"
        component={PaymentScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Payment Option"
        component={PaymentOption}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="Order Success"
        component={OrderSuccessful}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="Order Details"
        component={OrderDetailsPro}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="OrderHistory"
        component={OrderHistory}
        options={{headerShown: true}}
      />
    </Stack.Navigator>
    // </NavigationContainer>
  );
};

const SearchStackScreens = ({route}) => {
  return (
    // <NavigationContainer>
    <Stack.Navigator initialRouteName="SearchPage">
      <Stack.Screen
        name="SearchPage"
        component={Search}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SearchResults"
        component={SearchResults}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
    // </NavigationContainer>
  );
};

const AccountStackScreens = ({route}) => {
  const orderId = route.params?.orderId || 0;

  return (
    <Stack.Navigator initialRouteName="My Account">
      <Stack.Screen
        name="My Account"
        component={MyAccount}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="My Account Page"
        component={MyDetails}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Edit Account Details"
        component={EditAccountDetails}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Order Details"
        component={OrderDetailsPro}
        options={{headerShown: false}}
        initialParams={{orderId}}
      />

      <Stack.Screen
        name="OrderHistory"
        component={OrderHistory}
        options={{headerShown: false}}
        initialParams={{orderId}}
      />
      <Stack.Screen
        name="Help & Support"
        component={HelpSupport}
        options={{headerShown: true}}
      />
    </Stack.Navigator>
  );
};
const AppNavigator = () => {
  const {userInfo, splashLoading} = useContext(AuthContext);

  const linking = {
    prefixes: ['hibee://'],
    config: {
      initialRouteName: 'MainPage',
      screens: {
        Category: {
          path: 'category',
        },
        Product: {
          path: 'product/:product_id',
        },

        // OrderHistory: {
        //     path: 'product/:order_id'
        // }
      },
    },
  };

  return (
    // <NavigationContainer
    //     linking={linking}
    //     fallback={<ActivityIndicator color="blue" size="large" />}>
    <Stack.Navigator
    // initialRouteName='Splash'
    >
      <Stack.Screen
        name="Splash"
        component={Splash}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen name="Otp" component={Otp} options={{headerShown: false}} />
      <Stack.Screen
        name="SignupScreen"
        component={Signup}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="TabHomeBottom"
        component={TabHomeBottom}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="SelectSociety"
        component={SelectSociety}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="FlatNumber"
        component={FlatNumber}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="DetailsPage"
        component={DetailsPage}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="MainPage"
        component={MainPage}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="My Account"
        component={MyAccount}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="TabHome"
        component={TabHome}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="My Account Page"
        component={MyDetails}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="Help & Support"
        component={HelpSupport}
        options={{headerShown: true}}
      />

      <Stack.Screen
        name="PageNotFound"
        component={PageNotFound}
        options={{headerShown: false}}
      />
    </Stack.Navigator>

    // </NavigationContainer>
  );
};
function TabHomeBottom() {
  return (
    <>
      {/* <NavigationContainer> */}
      <Bottom.Navigator
        style={{borderWidth: 10}}
        initialRouteName={'MainPage'}
        screenOptions={{
          tabBarInactiveBackgroundColor: 'white',
          tabBarActiveBackgroundColor: 'white',
          tabBarShowLabel: false,
        }}>
        <Bottom.Screen
          name="MainPage"
          component={MainPage}
          options={{
            headerShown: false,
            tabBarIcon: tabInfo => {
              return (
                <>
                  <Image
                    source={require('../src/assets/img/homeicon.png')}
                    style={{
                      width: 22,
                      height: 20,
                      tintColor: tabInfo.focused ? '#12352F' : '#BCBCBC',
                      marginTop: 10,
                    }}
                  />
                  <Text
                    style={{
                      color: tabInfo.focused ? '#12352F' : '#BCBCBC',
                      marginTop: 5,
                      fontSize: 10,
                    }}>
                    Home
                  </Text>
                </>
              );
            },
          }}
        />
        <Bottom.Screen
          name="CategoryNavigator"
          component={CategoryStackScreens}
          options={{
            headerShown: false,
            tabBarIcon: tabInfo => {
              return (
                <>
                  <Image
                    source={require('../src/assets/img/categories.png')}
                    style={{
                      width: 20,
                      height: 20,
                      tintColor: tabInfo.focused ? '#12352F' : '#BCBCBC',
                      marginTop: 10,
                    }}
                  />
                  <Text
                    style={{
                      color: tabInfo.focused ? '#12352F' : '#BCBCBC',
                      marginTop: 5,
                      fontSize: 10,
                    }}>
                    Categories
                  </Text>
                </>
              );
            },
          }}
        />
        <Bottom.Screen
          name="CartNavigator"
          component={CartStackScreens}
          options={{
            headerShown: false,
            tabBarIcon: tabInfo => {
              return (
                <>
                  <Image
                    source={require('../src/assets/img/CartBottomIcon.png')}
                    style={{
                      width: 20,
                      height: 20,
                      tintColor: tabInfo.focused ? null : '#BCBCBC',
                      marginTop: 10,
                    }}
                  />
                  <Text
                    style={{
                      color: tabInfo.focused ? '#12352F' : '#BCBCBC',
                      marginTop: 5,
                      fontSize: 10,
                    }}>
                    Cart
                  </Text>
                </>
              );
            },
          }}
        />
        <Bottom.Screen
          name="Search"
          component={SearchStackScreens}
          options={{
            headerShown: false,
            tabBarIcon: tabInfo => {
              return (
                <>
                  <Image
                    source={require('../src/assets/img/search.png')}
                    style={{
                      width: 20,
                      height: 20,
                      tintColor: tabInfo.focused ? '#12352F' : '#BCBCBC',
                      marginTop: 10,
                    }}
                  />
                  <Text
                    style={{
                      color: tabInfo.focused ? '#12352F' : '#BCBCBC',
                      marginTop: 5,
                      fontSize: 10,
                    }}>
                    Search
                  </Text>
                </>
              );
            },
          }}
        />
        <Bottom.Screen
          name="Account"
          component={AccountStackScreens}
          options={{
            headerShown: false,
            tabBarIcon: tabInfo => {
              return (
                <>
                  <Image
                    source={require('../src/assets/img/account.png')}
                    style={{
                      width: 20,
                      height: 20,
                      tintColor: tabInfo.focused ? '#12352F' : '#BCBCBC',
                      marginTop: 10,
                    }}
                  />
                  <Text
                    style={{
                      color: tabInfo.focused ? '#12352F' : '#BCBCBC',
                      marginTop: 5,
                      fontSize: 10,
                    }}>
                    Account
                  </Text>
                </>
              );
            },
          }}
        />
      </Bottom.Navigator>
      {/* </NavigationContainer> */}
    </>
  );
}

export default initialNavigator;
