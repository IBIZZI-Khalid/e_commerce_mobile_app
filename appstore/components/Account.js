import { login, register, updateUsername, changePassword, getUserDetails } from './Api';
import React, { useState, useEffect } from 'react';
import { TextInput, StyleSheet, View, Text, Button, Alert, TouchableOpacity, ActivityIndicator, ImageBackground, Image } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    setIsLoading(true); // Show loading indicator

    try {
      const data = await login(username, password);

      if (data.access) { // the presence of a token means successful login 
        await AsyncStorage.setItem('@accessToken', data.access);
        await AsyncStorage.setItem('@refreshToken', data.refresh);
        navigation.navigate('AccountDetails'); // navigate to the mainpage after 
      } else {
        // Handle login failure
        alert('Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred. Please try again later.', error.message);
    } finally {
      setIsLoading(false); // Hide the loading indicator
    }
  };

  return (
    <ImageBackground source={require('../assets/Login_signup_bckg.jpg')} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>
        <TextInput
          style={styles.textInput}
          placeholder='Username'
          placeholderTextColor="#888"
          value={username}
          onChangeText={setUsername}
        />

        <TextInput
          style={styles.textInput}
          placeholder='Password'
          placeholderTextColor="#888"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {isLoading ? (
          <ActivityIndicator size="large" color="#fff" />
        ) : (
          <>
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Log In</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.signupButton} onPress={() => navigation.navigate('Signup')}>
              <Text style={styles.signupButtonText}>Don't have an account? Sign Up!</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ImageBackground>
  );
};

const SignupScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    setIsLoading(true);
    try {
      console.log('test handleRegister function...');
      const data = await register(username, password, email);
      if (data.success) {
        alert("Registration Successful! You can log in now.");
        setUsername('');
        setPassword('');
        setEmail(''); // Clear registration fields 
      } else {
        console.error('Failed to create an account', data.error);
        alert('There was a problem! Please try again. Maybe with different info? :)');
      }
    } catch (error) {
      // Handle any errors that occur during registration process
      console.error('Error while trying to register', error);
      alert('An unexpected error occurred, please try again later!');
    } finally {
      setIsLoading(false); // Hide the loading indicator
      navigation.goBack();
    }
  };

  return (
    <ImageBackground source={require('../assets/Login_signup_bckg.jpg')} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>Sign Up</Text>
        <TextInput
          style={styles.textInput}
          placeholder='Username'
          placeholderTextColor="#888"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.textInput}
          placeholder='Password'
          placeholderTextColor="#888"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TextInput
          style={styles.textInput}
          placeholder='Email'
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
        />

        {isLoading ? (
          <ActivityIndicator size="large" color="#fff" />
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        )}
      </View>
    </ImageBackground>
  );
};

const EditAccountScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleUpdateDetails = async () => {
    try {
      const response = await updateUsername(username);
      Alert.alert('Success');
    } catch (error) {
      Alert.alert('Error', error.response?.data?.error || error.message);
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
    <ImageBackground source={require('../assets/Login_signup_bckg.jpg')} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>Account Management</Text>

        <Text style={styles.label}>Update Username:</Text>
        <TextInput
          style={styles.textInput}
          value={username}
          onChangeText={setUsername}
          placeholder="Enter new username"
          placeholderTextColor="#888"
        />
        <TouchableOpacity style={styles.button} onPress={handleUpdateDetails}>
          <Text style={styles.buttonText}>Update Username</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Change Password:</Text>
        <TextInput
          style={styles.textInput}
          value={oldPassword}
          onChangeText={setOldPassword}
          placeholder="Enter old password"
          placeholderTextColor="#888"
          secureTextEntry
        />
        <TextInput
          style={styles.textInput}
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder="Enter new password"
          placeholderTextColor="#888"
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
          <Text style={styles.buttonText}>Change Password</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userProfile = await getUserDetails();
        setProfile(userProfile);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        if (error.response && error.response.status === 401) {
          await AsyncStorage.removeItem('@accessToken');
          navigation.navigate('Login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigation]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }
  return (
    <ImageBackground source={require('../assets/Login_signup_bckg.jpg')} style={styles.background}>
      <View style={styles.profileContainer}>
        {profile ? (
          <View style={styles.profileContent}>
            <Image style={styles.profileImage} source={{ uri: profile.user.profilePicture }} />
            <Text style={styles.profileName}>Hey {profile.user.username}</Text>
            <Text style={styles.profileBio}>
              Thanks for logging in. This will help us analyze the viral searches, 
              and will help you save your favorite products to your cart!
            </Text>
            <Text style={styles.profileEmail}>Your email: {profile.user.email}</Text>
            <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('EditAccountDetails')}>
              <Text style={styles.profileButtonText}>Edit Details</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('Main')}>
              <Text style={styles.profileButtonText}>Home</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={styles.loadingText}>Loading...</Text>
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    width: 'auto',
    height: 'auto',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  profileContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  profileContent: {
    alignItems: 'center',
    justifyContent:'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  profileName: {
    fontSize: 28,
    color: '#fff',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  profileEmail: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 10,
  },
  profileBio: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  profileButton: {
    width: '80%',
    padding: 15,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  profileButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 32,
    color: '#fff',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  textInput: {
    width: '100%',
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    fontSize: 16,
  },
  button: {
    width: '100%',
    padding: 15,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signupButton: {
    width: '100%',
    padding: 15,
    backgroundColor: '#2196F3',
    borderRadius: 5,
    alignItems: 'center',
  },
  signupButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  label: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 5,
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
  },
  logoutButton: {
    width: '100%',
    padding: 15,
    backgroundColor: '#f44336',
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

const AccountStack = createStackNavigator();
const AccountNavigator = () => {
  const [initialRouteName, setInitialRouteName] = useState('Login');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const accessToken = await AsyncStorage.getItem('@accessToken');
        if (accessToken) {
          setInitialRouteName('AccountDetails');
        }else{
          setInitialRouteName('Login');
        }
      } catch (error) {
        console.error('Error checking login status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <AccountStack.Navigator initialRouteName={initialRouteName}>
      <AccountStack.Screen name='Login' component={LoginScreen} />
      <AccountStack.Screen name='Signup' component={SignupScreen} />
      <AccountStack.Screen name='AccountDetails' component={UserProfile} />
      <AccountStack.Screen name='EditAccountDetails' component={EditAccountScreen} />
    </AccountStack.Navigator>
  );
};

export default AccountNavigator;
