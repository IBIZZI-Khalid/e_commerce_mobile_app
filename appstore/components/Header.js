import React from 'react';
// import { createStackNavigator } from '@react-navigation/stack';

import { View, Text, TextInput, Image, StyleSheet, Platform, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Account from './Account';
import { useNavigation } from '@react-navigation/native';
import { Animated } from 'react-native';
// const Stack = createStackNavigator();


const styles = StyleSheet.create({
    headerContainer: {
      flexDirection: 'row', // Arrange elements horizontally
      
      alignItems: 'center', // Align elements vertically
      marginTop: Platform.OS === 'ios' ? 40:30, // iOS has a different status bar height than Android
      height : Platform.OS === 'ios'? 80:60 ,// Set the height of the header container for iOS and add extra space for the status bar
      justifyContent: 'space-between', // Add space between elements
      backgroundColor: '#531889',
      padding:10,
    },
    searchInput: {
      
    },
    icon: {
      color : '#fff',
      fontSize: 24,
    },
    logo:{
      height: 40, // Set height for a consistent look
      width:100,
      shadowColor: '#ccc', // Add subtle shadow for depth
      shadowOffset: { width: 0, height: 2 }, // Position the shadow
      shadowOpacity: 0.2, // Set shadow opacity
      shadowRadius: 4, // Control the spread of the shadow
    },
  });
  
const Header = () => {
    const navigation = useNavigation();
    return (
        <View style={styles.headerContainer}>
            <Pressable onPress={() => navigation.navigate('Account')}>
              <MaterialCommunityIcons name="account" size={24} style={styles.icon} />     
            </Pressable>

            <Image source={require('../assets/Logo.png')} style={styles.logo} />
            {/* <TextInput style={styles.searchInput} placeholder="Search..." />  */}
            <Pressable onPress={() => navigation.navigate('CartScreen')}>
            <MaterialCommunityIcons name="cart" size={24} style={styles.icon} />
            </Pressable>
        </View>
    );
  };
  
  export default Header;
  