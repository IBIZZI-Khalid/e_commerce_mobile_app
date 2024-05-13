import {login , register} from './Api';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text,Image } from 'react-native';


const Account = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

const styles = StyleSheet.create({
    parrent_main : { 
      backgroundColor: '#C4DFE6',
    flex : 1 ,
  
    },
  });


  const handleLogin = async () => {
    try {
      const data = await login('username', 'password');
      
      if (data.token) {
        await AsyncStorage.setItem('@token', data.token);
        navigation.navigate('MainApp');
      } else {
        // Handle login failure
        console.log('Failed to log in');
      }
    } catch (error) {
      // Handle error
      console.error(error);
    }
  };
  const handleRegister = async () => {
    const data = await register(username, password,email);
    if (data.success) {
      // Handle successful registration
    } else {
      // Handle registration failure
    }
  };


  return(
    <View>
        <TextInput
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
        />
        <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
        />
        <Button title="Log In" onPress={handleLogin} />
        <Button title="Register" onPress={handleRegister} />


    </View>
  )
}
  
export default Account;


//   const handleRegister = async () => {
//     const data = await register('username', 'password', 'email@example.com');
//     // Handle register data
//   };
  