import axios from 'axios';
// const BASE_URL = 'http://127.0.0.1/'
// const BASE_URL = 'http://10.0.2.2:8000/'
// const BASE_URL = 'http://localhost:8000/';
const BASE_URL = 'http://192.168.100.150:8000/';
// const BASE_URL = 'http://192.168.254.213:8000/'
// const BASE_URL = 'http://192.168.0.100:8000/'
// const BASE_URL = 'http://192.168.100.109:8000/';

export const fetchProducts = async () => { 
    
    const response = await axios.get(`${BASE_URL}mongo-products/`).then(response=>{
      if (response.status== 200) {
        console.log("got the response from the BE")
        return response.data.products_data;                       
      }
      else{
        console.log('response =! 200')
      }
    }).catch(error => {
      console.log(error);});   
  return response;  
    }

const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    // 'X-CSRFToken': csrftoken ,
  'Content-Type' : 'application/json',
  },
  timeout :1000,
});

import AsyncStorage from '@react-native-async-storage/async-storage';

export const login = async (username,password) =>{
    try{
      console.log('testing login function...');
      console.log('Sending login request with:', { username, password });

      const response = await apiClient.post(`/login/`,{username, password})

        console.log('the data react got is : ', response.data);
        // console.log(response.status); // HTTP status code
        // console.log(response.headers);
      
      if (response.data.token){
        await AsyncStorage.setItem('@token', response.data.token);
        
        // verifying that the token is being stored
        const token = await AsyncStorage.getItem('@token');
        console.log('Stored token:', token);
        
        return response.data;

        
      }if (response.data && response.data.error) {
          console.log('Backend error:', response.data.error);
          throw new Error(response.data.error);
      }else{
        throw new Error('Wrong username or password');
      }
    }catch(error){
        console.log('Error at the login function in Api.js line 50 : ',error)
        throw error ;
      }
};



export const register = async (username, password, email) => {
  try {
    console.log('test api.register function...');

    const response = await apiClient.post(`/register/`, {
      username,
      password,
      email,
    });
    if (response.data.success){
      console.log('the data react got in api.register : ',response.data)
      return response.data;
    }else{
      throw new Error('Registration failed :( ');
    }
  } catch (error) {
    console.log('Error at the register function in Api.js', error.message);
    throw error;
  }
};


export const updateUsername = async (newUsername) => {
  try {
    //get the authent. token 
    const token = await AsyncStorage.getItem('@token');
    // Check if token exists 
    if (!token) {
      throw new Error('Api.js.updateUsername : Missing authentication token');
    }
    //send the token to the backend
    const response = await apiClient.post(`/update-username/`, 
      { username: newUsername },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log('api.js.update username : the response react got is : ', response.data);
    //in success case :
    return response.data;
  } catch (error) {
    console.error('Error at the updateUsername function in Api.js:', error);
    throw error;
  }
};



export const changePassword = async (oldPassword, newPassword) => {
  try {
    //get the authent. token
    const token = await AsyncStorage.getItem('@token');
    //sending it to the backend
    const response = await apiClient.post(`/update-password/`,
      { old_password: oldPassword, new_password: newPassword },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log('api.js.changepassword : the response react got : ' , response.data);
    //in success case :

    return response.data;
  } catch (error) {
    console.error('Error at the changePassword function in Api.js:', error);
    throw error;
  }
};

export const getProducts = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/products`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const getUserDetails = async () => {
  try {
    
    console.log('testing before geting the data');
    const token = await AsyncStorage.getItem('@token');
    console.log('testing after geting the data, token : ' , token );
    
    if(!token){
     throw new Error('getUserDetails didnt get the token');  
    
    }const response = await apiClient.get(`/userprofiles/`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('API response:', response.data);  // Log the response
    
    if(response.data && response.data.length > 0) {
      return response.data[0];  // Return the first profile
    
    } else {
      throw new Error('No profile data found');
    }
  
  } catch (error) {
    console.error('Error at the getUserDetails function in Api.js:', error);
    throw error;
  }
};


