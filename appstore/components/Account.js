import {login , register, updateUsername , changePassword,getUserDetails} from './Api';
import React, { useState, useEffect } from 'react';
import { TextInput, StyleSheet, View, Text, Button, Alert ,ActivityIndicator} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const LoginScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [username , setUsername ] = useState('');
  const [password , setPassword ] = useState('');

  
  const handleLogin = async () => {
    setIsLoading(true); // Show loading indicator

    try {
      // console.log('test handlelogin function...');

      const data = await login(username,password);
      
      if (data.token) { //the presence of a token means successful login 
        await AsyncStorage.setItem('@token', data.token); //this line just saves the item 
        navigation.navigate('AccountDetails'); //navigate to the mainpage after 
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

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        placeholder='Username'
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        style={styles.textInput}
        placeholder='Password'
        value={password}
        onChangeText={setPassword}
        secureTextEntry

      />

      <Button title='Log In' onPress={handleLogin}/>
      <Button title='Dont have an account ? Sign Up !' onPress={()=> navigation.navigate('Signup')}/>
      

    </View>
  );

};

const SignupScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email,setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  
  const handleRegister = async () => {
    setIsLoading(true); // Show dak loading thing
    try {
      console.log('test handleregister function...');
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
        navigation.goBack();
      }
    
    };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder='Username'
        onChangeText={setUsername}
        value={username}
        style = {styles.textInput}
      />
      <TextInput
        placeholder='Password'
        onChangeText={setPassword}
        value={password}
        style = {styles.textInput}
        secureTextEntry
      />
      <TextInput
        placeholder='Email'
        onChangeText={setEmail}
        value={email}
        style = {styles.textInput}
      />

      <Button title='Sign Up' onPress={handleRegister} />

    </View>
  );
  
};


const AccountDetailsScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        console.log('fetching user details...');
        const data = await getUserDetails();
        console.log('user details fetched:', data);

        setUsername(data.user.username);
        setEmail(data.user.email);
      } catch (error) {
        console.log('error while fetching the details : ',error);
        Alert.alert('Error', error.response?.data?.error || error.message);
      }
    };

    fetchUserDetails();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Account Details</Text>
      <Text>Username: {username}</Text>
      <Text>Email: {email}</Text>

      <Button title="Edit Details" onPress={() => navigation.navigate('EditAccountDetails')} />
    </View>
  );
};
 

const UserProfileScreen = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8000/api/user')
      .then(response => setUserData(response.data));
  }, []);

  if (!userData) {
    return <Text>Loading...</Text>;
  }

  return (
    <View>
      <Text>{userData.username}</Text>
      <Text>{userData.email}</Text>
      // display other user data...
    </View>
  );
};

 

const EditAccountScreen = ({navigation}) =>{

  const [username, setUsername] = useState('');
  const [oldPassword,setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');


  const handleUpdateDetails = async () => {
    try{
      const response =await updateUsername(username) ; 
      Alert.alert('Success')
      
    }catch(error){
      Alert.alert('Error',error.response?.data?.error || error.message)
    }
  };

  const handleChangePassword = async () => {
      try {
        const response = await changePassword(oldPassword, newPassword);
        Alert.alert('Success', response.message);
      } catch (error) {
        Alert.alert('Error', error.response?.data?.error || error.message);
      }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('@token');
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <Text>Account Management</Text>

      <Text>Update Username:</Text>
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        placeholder="Enter new username"
      />
      <Button title="Update Username" onPress={handleUpdateDetails} />

      <Text>Change Password:</Text>
      <TextInput
        style={styles.input}
        value={oldPassword}
        onChangeText={setOldPassword}
        placeholder="Enter old password"
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        value={newPassword}
        onChangeText={setNewPassword}
        placeholder="Enter new password"
        secureTextEntry
      />
      <Button title="Change Password" onPress={handleChangePassword} />

      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    padding : 16 ,
  },
  textInput: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#C4DFE6',
    borderRadius: 5,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    padding: 8,
  },

});

const AccountStack = createStackNavigator();
const AccountNavigator =() =>{
  return (
    <AccountStack.Navigator initialRouteName='Login'>
      <AccountStack.Screen name='Login' component={LoginScreen} />
      <AccountStack.Screen name='Signup' component={SignupScreen} />
      <AccountStack.Screen name='AccountDetails' component={AccountDetailsScreen} />
      {/* <AccountStack.Screen name='AccountDetails' component={UserProfileScreen} /> */}

      <AccountStack.Screen name='EditAccountDetails' component={EditAccountScreen} />
    </AccountStack.Navigator>
  )
}

export default AccountNavigator;
