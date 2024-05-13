import React from 'react';
// import { createStackNavigator } from '@react-navigation/stack';

import { View, Text, TextInput, Image, StyleSheet, Platform, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Account from './Account';
import { useNavigation } from '@react-navigation/native';

// const Stack = createStackNavigator();


const styles = StyleSheet.create({
    headerContainer: {
      flexDirection: 'row', // Arrange elements horizontally
      alignItems: 'center', // Align elements vertically
      paddingHorizontal: 10, // Add horizontal padding
      marginTop: Platform.OS === 'ios' ? 40:30, // iOS has a different status bar height than Android
      height : Platform.OS === 'ios'? 80:60 ,// Set the height of the header container for iOS and add extra space for the status bar
      justifyContent: 'space-between', // Add space between elements
      backgroundColor: '#66A5AD',
      
    },
    searchInput: {
      flex: 1, // Allow search input to fill available space
      backgroundColor: '#fff', // Set background color for search input
      paddingHorizontal: 15, // Add horizontal padding to search input
      borderRadius: 5, // Add rounded corners to search input (optional)
      margin : 10,
      fontSize: 16, // Set font size for better readability
      height: 40, // Set height for a consistent look
      shadowColor: '#ccc', // Add subtle shadow for depth
      shadowOffset: { width: 0, height: 2 }, // Position the shadow
      shadowOpacity: 0.2, // Set shadow opacity
      shadowRadius: 4, // Control the spread of the shadow
      elevation: 2, 
    },
    icon: {
      color : '#fff',
      fontSize: 24,
    },
  });
  
const Header = () => {
    const navigation = useNavigation();
    return (
        <View style={styles.headerContainer}>

            {/* 
              <Image
              style={{ 
                position: 'absolute',
                top: 0,
                left: 0, 
                width: '100%', 
                height: '100%' }}
              source={{ uri: 'https://example.com/background-image.jpg' }}
              resizeMode="cover"
              /> 
            */}
            
            <Pressable onPress={() => navigation.navigate('Account')}>
              <MaterialCommunityIcons name="account" size={24} style={styles.icon} />     
            </Pressable>

            <TextInput style={styles.searchInput} placeholder="Search..." /> 

            <MaterialCommunityIcons name="cart" size={24} style={styles.icon} />
        </View>
    );
  };
  
  export default Header;
  