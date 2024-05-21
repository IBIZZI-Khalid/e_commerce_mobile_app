import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';   
 import { login, register } from './Api';

const Account = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState(''); 
  const [isLoading, setIsLoading] = useState(false); // State for loading indicator

  const navigation = useNavigation(); // Get navigation reference

  const handleLogin = async () => {
    setIsLoading(true); // Show loading indicator
    try {
      const data = await login(username, password);

      if (data.access) {
        await localStorage.setItem('@token', data.token);
        navigation.navigate('MainApp'); // Navigate to main app
      } else {
        // Handle login failure
        console.error('Login failed:', data.error); // Log the error message
        alert('Login failed. Please check your credentials.'); // Inform the user
      }
    } catch (error) {
      // Handle errors
      console.error('Login error:', error);
      alert('An error occurred. Please try again later.'); // Inform the user
    } finally {
      setIsLoading(false); // Hide loading indicator
    }
  };

  const handleRegister = async () => {
    setIsLoading(true); // Show loading indicator
    try {
      const data = await register(username, password, email);

      if (data.success) {
        // Handle successful registration (e.g., show success message, navigate to login)
        console.log('Registration successful!');
        alert('Registration successful! Please log in.');
        setUsername('');
        setPassword('');
        setEmail(''); // Clear registration fields
      } else {
        // Handle registration failure
        console.error('Registration failed:', data.error);
        alert('Registration failed. Please try again.'); // Inform the user
      }
    } catch (error) {
      // Handle errors
      console.error('Registration error:', error);
      alert('An error occurred. Please try again later.'); // Inform the user
    } finally {
      setIsLoading(false); // Hide loading indicator
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
