import {login , register} from './Api';
import React, { useEffect, useState } from 'react';
import {TextInput, StyleSheet, View, Text,Image ,Button} from 'react-native';
import { useNavigation } from '@react-navigation/native';
 
const Account = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [isLoading,setIsLoading] = useState(false);// State for loading indicator

    const navigation = useNavigation(); // Get navigation reference

const styles = StyleSheet.create({
    parrent_main : { 
      backgroundColor: '#C4DFE6',
    flex : 1 ,
  
    },
  });


  const handleLogin = async () => {
    setIsLoading(true); // Show loading indicator

    try {
      const data = await login(username,password);
      
      if (data.token) { //the presence of a token means successful login 
        await AsyncStorage.setItem('@token', data.token); //this line just saves the item 
        navigation.navigate('MainApp'); //navigate to the mainpage after 
      } else {
        // Handle login failure
        console.error('Login failed' , data.token);
        alert('Login failed. Please check your credentials.'); // Inform the user

      }
    } catch (error) {
      // Handle error
      console.error(error);
      alert('An error occurred. Please try again later.');
    } finally{
      setIsLoading(false); // Hide the loading thing 
    }
  };


  const handleRegister = async () => {
    setIsLoading(true); // Show dak loading thing
    try {
      const data = await register( username , password , email );
      if (data.success) {
        // Handle successful registration
        console.log('Registeration kmel !')
        alert("Registration Successful ! You can log in now .")
        setUsername('');
        setPassword('');
        setEmail(''); // Clear registration fields 
      } else {
        // Handle registration failure
        console.error('Failed to create an account',data.error);
        alert('There was a problem ! Please try again. maybe with difrent info ? :) ')
      } 
    } catch(error) {
      // Handle any errors that occur during registration process
      console.error('Error while trying to register' , error);
      alert('An unexpected error occured, please try again later ! ');
    } finally {
        setIsLoading(false); //Hide the loading thing again
    }
    };
  

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.textInput}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {email && ( // Display email field only for registration
        <TextInput
          style={styles.textInput}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
      )}
      {isLoading ? (
        <Text>Loading...</Text> // Display loading indicator during login/register
      ) : (
        <>
          <Button title="Log In" onPress={handleLogin} />
          <Button title="Register" onPress={handleRegister} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  textInput: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
});

export default Account;
