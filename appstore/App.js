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
import Account from './components/Account.js';
import Mainpage from './components/Mainpage.js';
import * as React from 'react';

//   const Tab = createBottomTabNavigator();


//   const styles = StyleSheet.create({
//     container: {
//       paddingTop:25,
//       flex: 1,
//       flexDirection :'column',
//       backgroundColor: '#0093AF',
//       alignItems: 'center',
//       justifyContent: 'center',
//     },
//     header: {
//       flex: 1, // Allocates equal space to the header (can be adjusted)
//       backgroundColor: '#f0f0f0', // Example background color
//       alignItems: 'center', // Centers content horizontally
//       justifyContent: 'center', // Centers content vertically
      
//     },
//     content: {
//       flex: 2, // Allocates twice the space for content (can be adjusted)
//       backgroundColor: 'red', // Example background color
//       padding: 10, // Adds some padding for better readability
//     },
//   });

//   function MyTabs(){
//     return (
//       <Tab.Navigator>
//         <Tab.Screen name="HOME" component={Mainpage} />
//         <Tab.Screen name="SEARCH" component={Mainpage} />
//         <Tab.Screen name="CART" component={Mainpage} />
//         <Tab.Screen name="ACCOUNT" component={Mainpage} />

//         {/* zid other screens ... */}
//       </Tab.Navigator>
//     )
//   }

// export default function App() {
//   return (<>
    
//     {/* we use SafeAreaView so that  our app will adapt to any screen size and device type. It helps us create responsive apps. */}
    

//       <SafeAreaView style={styles.container}>
//         <Header style={styles.header} /> 
//         <NavigationContainer style={styles.content}>
//           <MyTabs />
//           <StatusBar style="auto" />
//         </NavigationContainer>  

//       </SafeAreaView>

//     </>);
// }
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
      height : 10 , },

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
        // const label =
        //   options.tabBarLabel !== undefined
        //     ? options.tabBarLabel
        //     : options.title !== undefined
        //       ? options.title
        //       : route.name;

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
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{ flex: 1 ,
             }}
          >
            {options.tabBarIcon && options.tabBarIcon({ focused: isFocused })}
            {/* <Text style={{ color: isFocused ? '#673ab7' : '#222' }}>
              {label}
            </Text> */}
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
  return(
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Main" component={TabNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="Account" component={Account} />
      </Stack.Navigator>
    </NavigationContainer>
    // react-navigation is used to manage and control the navigation between different screens in our app
  )
}
