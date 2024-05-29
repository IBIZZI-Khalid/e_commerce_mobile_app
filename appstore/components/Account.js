import {login , register, updateUsername , changePassword,getUserDetails} from './Api';
import React, { useState, useEffect } from 'react';
import { TextInput, StyleSheet, View, Text, Button, Alert } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [username , setUsername ] = useState('');
  const [password , setPassword ] = useState('');

  
  const handleLogin = async () => {
    setIsLoading(true); // Show loading indicator

    try {
      // console.log('test handlelogin function...');

      const data = await login(username,password);
      
      if (data.access) { //the presence of a token means successful login 
        await AsyncStorage.setItem('@accessToken', data.access);
        await AsyncStorage.setItem('@refreshToken', data.refresh);
        navigation.navigate('AccountDetails'); //navigate to the mainpage after 
      } else {
        // Handle login failure
        alert('Login failed. Please check your credentials.');
      }
    }catch(error){
      console.error(error);
      alert('An error occurred. Please try again later.',error.message);
    }finally{
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

      <Button title='Log In' onPress={handleLogin} style={styles.login_button}/>
      <Button title='Dont have an account ? Sign Up !' style={styles.login_button} onPress={()=> navigation.navigate('Signup')}/>
      

    </View>
  );

};

const SignupScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email,setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  
  const handleRegister = async () => {
    setIsLoading(true); 
    try {
      console.log('test handleregister function...');
      const data = await register( username , password , email );
      if (data.success) {
        
        alert("Registration Successful ! You can log in now .")
        setUsername('');
        setPassword('');
        setEmail(''); // Clear registration fields 
      } else {
        
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
    await AsyncStorage.removeItem('@accessToken');
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

const UserProfile =({navigation})=> {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userProfile = await getUserDetails();
        setProfile(userProfile);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <View>
      {profile ? (
        <View>
          <Text>Username: {profile.user.username}</Text>
          <Text>Email: {profile.user.email}</Text>
          <Text>Bio: {profile.bio}</Text>
          <Button title="Edit Details" onPress={() => navigation.navigate('EditAccountDetails')} />
        </View>
      ) : (
        
        <Text>Loading...</Text>
      )}
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
      <AccountStack.Screen name='AccountDetails' component={UserProfile} />
      <AccountStack.Screen name='EditAccountDetails' component={EditAccountScreen} />
    </AccountStack.Navigator>
  )
}

export default AccountNavigator;
