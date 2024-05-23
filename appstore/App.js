import { 
  StyleSheet, 
  Text, 
  View ,
  TouchableOpacity  } from 'react-native';
import { Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import Header from './components/Header.js';
import AccountNavigator from './components/Account.js';
import Mainpage from './components/Mainpage.js';
import * as React from 'react';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { Asset } from 'expo-asset';
import SplashScreenComponent from './components/SplashScreen.js';

// SplashScreen.preventAutoHideAsync(); // Keep the splash screen visible while we fetch resources

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

function MyTabBar({ state, descriptors, navigation }) {
  return (
    <View 
    style={{ 
      flexDirection: 'row', 
      position :'absolute',
      bottom:25,
      left : 20,
      right: 20,
      elevation :0,
      backgroundColor: '#f7f9fa',
      borderRadius:15,
      height : 90,
      ...styles.shadow
    }}
     >
      {state.routes.map((route, index) => {

        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return ( 
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{ flex: 1 ,
                   }
                  }
          >
            {options.tabBarIcon && options.tabBarIcon({ focused: isFocused })}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}



const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function TabNavigator() {
  return (
      <Tab.Navigator 
      tabBar={(props) => <MyTabBar {...props} />} 
      
      // tabBarOptions = {{
      //         style :{
      //           position :'absolute',
      //           bottom :25,
      //           backgroundColor : '#F98866'
      //         }
      // }} 
      
      screenOptions={{  
        header: () => <Header />,
        // showLabel : false , //not working tho :(
       }}
       style={styles.tabNavigator}
      > 

        {/* {...props} is a spread operator that returns all th props it gets from Tab.navigator to  MyTabBar component */}
        
        <Tab.Screen name="Home" component={Mainpage}
          options={{
            tabBarIcon : ({focused}) => (
              <View  style={{
                flex:1,
                alignItems:'center' ,
                justifyContent:'center' , 

                }}>
        
                <Image 
                  source={require('./assets/home.png')}
                  resizeMode= "contain" 
                  style={{
                    
                    width:25,
                    height :25,
                    tintColor : focused ? '#4d3b75' : '#20948B',
                  }}/>

                
                <Text
                  style ={{color : focused ?'#4d3b75' : '#20948B',fontSize : 12}}> 
                HOME
                </Text>

              </View>
            )
        }}/>

        <Tab.Screen name="Promotion" component={Mainpage}
         options={{
          tabBarIcon : ({focused}) => (
            <View  style={{flex:1,
              alignItems:'center' ,
              justifyContent:'center' , }}>
      
              <Image 
                source={require('./assets/promotion.png')}
                resizeMode= "contain" 
                style={{
                  
                  width:25,
                  height :25,
                  tintColor : focused ? '#F98866' : '#20948B',
                }}/>

              
              <Text
                style ={{color : focused ?'#F98866' : '#20948B',fontSize : 12}}> 
              PROMOTIONS
              </Text>

            </View>
          )
        }}/>

        <Tab.Screen name="categories" component={Mainpage} 
         options={{
          tabBarIcon : ({focused}) => (
            <View  style={{flex:1,
              alignItems:'center' ,
              justifyContent:'center' , }}>
      
              <Image 
                source={require('./assets/categories.png')}
                resizeMode= "contain" 
                style={{
                  
                  width:25,
                  height :25,
                  tintColor : focused ? '#F98866' : '#20948B',
                }}/>

              
              <Text
                style ={{color : focused ?'#F98866' : '#20948B',fontSize : 12}}> 
              CATEGORIES
              </Text>

            </View>
          )
        }}/>

        <Tab.Screen name="Settings" component={Mainpage}
         options={{
          tabBarIcon : ({focused}) => (
            <View  style={{
              flex:1,
              alignItems:'center' ,
              justifyContent:'center' , }}>
      
              <Image 
                source={require('./assets/settings.png')}
                resizeMode= "contain" 
                style={{
                  
                  width:25,
                  height :25,
                  tintColor : focused ? '#F98866' : '#20948B',
                }}/>

              
              <Text
                style ={{color : focused ?'#F98866' : '#20948B',fontSize : 12}}> 
              SETTINGS
              </Text>

            </View>
          )
        }}/>
      </Tab.Navigator>
    
  );
}

export default function App(){
  const [appIsReady , setAppIsReady] = React.useState(false);

 
    
  React.useEffect(() => {
//     const prepare = async () => {
//       try {
//         //simulate a loading task ...
//         await new Promise (resolve => setTimeout(resolve,2000));
//         setAppIsReady(true);
        
//       }catch(error){
//         throw new error('error at prepare function App.js ',error);
//       }}
//      
//  if (!appIsReady) {
  //     // return <SplashScreenComponent />; 
  //   }
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        // await Font.loadAsync({
        // // Load any custom fonts here
        // });
        // Pre-load assets
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

   prepare();}, []);

  return(
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Main" component={TabNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="Account" component={AccountNavigator}   options={{ headerShown: false }} 
/>
      </Stack.Navigator>
    </NavigationContainer>
    // react-navigation is used to manage and control the navigation between different screens in our app
  )
}
