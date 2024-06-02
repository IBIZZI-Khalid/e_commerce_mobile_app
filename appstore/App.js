import { 
  StyleSheet, 
  Text, 
  View ,
  Image
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import Header from './components/Header.js';
import AccountNavigator from './components/Account.js';
import Mainpage from './components/Mainpage.js';
import SearchComponent from './components/Search.js';
import MyTabBar from './components/MyTabBar'; // Import the MyTabBar component
import * as React from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { Asset } from 'expo-asset';
import SearchResultScreen from './components/SearchResultScreen.js';
import CartScreen from './components/CartScreen.js';
import CategoryScreen from './components/CategoryScreen.js';

SplashScreen.preventAutoHideAsync();

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator 
      tabBar={(props) => <MyTabBar {...props} />} 
      // screenOptions={{  
      //   header: () => <Header />,
      // }}
      style={styles.tabNavigator}
    > 
      <Tab.Screen name="Home" component={Mainpage} 
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <Image 
                source={require('./assets/home.png')}
                resizeMode="contain" 
                style={{
                  width: 25,
                  height: 25,
                  tintColor: focused? '#A77EFB' : '#4d3b75',
                }}
              />
              <Text style={{ color: focused? '#4d3b75' : '#20948B', fontSize: 12 }}>
                HOME
              </Text>
            </View>
          )
        }}
      />
      <Tab.Screen name="Promotion" component={Mainpage}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <Image 
                source={require('./assets/promotion.png')}
                resizeMode="contain" 
                style={{
                  width: 25,
                  height: 25,
                  tintColor: focused ? '#F98866' : '#20948B',
                }}
              />
              <Text style={{ color: focused ? '#F98866' : '#20948B', fontSize: 12 }}>
                PROMOTIONS
              </Text>
            </View>
          )
        }}
      />
      <Tab.Screen name="Categories" component={Mainpage} 
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <Image 
                source={require('./assets/categories.png')}
                resizeMode="contain" 
                style={{
                  width: 25,
                  height: 25,
                  tintColor: focused ? '#F98866' : '#20948B',
                }}
              />
              <Text style={{ color: focused ? '#F98866' : '#20948B', fontSize: 12 }}>
                CATEGORIES
              </Text>
            </View>
          )
        }}
      />
      <Tab.Screen name="Settings" component={Mainpage}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <Image 
                source={require('./assets/settings.png')}
                resizeMode="contain" 
                style={{
                  width: 25,
                  height: 25,
                  tintColor: focused ? '#F98866' : '#20948B',
                }}
              />
              <Text style={{ color: focused ? '#F98866' : '#20948B', fontSize: 12 }}>
                SETTINGS
              </Text>
            </View>
          )
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [appIsReady, setAppIsReady] = React.useState(false);

  React.useEffect(() => {
    async function prepare() {
      try {
        await Asset.loadAsync([
          require('./assets/splash.png'),
          //more assets to preload here
        ]);
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
        SplashScreen.hideAsync(); // Hide the splash screen after resources are loaded
      }
    }

    prepare();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Main">
        
        <Stack.Screen name="Main" component={TabNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="Account" component={AccountNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="SearchResultScreen" component={SearchResultScreen} />
        <Stack.Screen name="CartScreen" component={CartScreen} />
        <Stack.Screen name="CategoryScreen" component={CategoryScreen} />
        {/* <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabNavigator:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shadow :{
    shadowColor : '#246778',
    shadowOffset   :{
      width : 0 ,
      height : 10 , 
    },
    shadowOpacity : 0.25,
    shadowRadius : 3.5,
    elevation : 5 ,

  }
})