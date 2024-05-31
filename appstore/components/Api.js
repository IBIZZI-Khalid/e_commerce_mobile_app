import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// const BASE_URL = 'http://127.0.0.1/'
// const BASE_URL = 'http://10.0.2.2:8000/'
// const BASE_URL = 'http://localhost:8000/';
// const BASE_URL = 'http://192.168.11.241:8000/';
// const BASE_URL = 'http://192.168.11.69:8000/'
// const BASE_URL = 'http://192.168.100.150:8000/'
const BASE_URL = 'http://192.168.0.100:8000/';

const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
  'Content-Type' : 'application/json',
  },
  // timeout :5000,
});


export const fetchProducts = async () => { 
    try{
      const response = await apiClient.get(`/mongo-products/`);
      return response.data;                       
    } catch(error){
      console.log('api.js : error fetching the products ', error.message);
      throw error; 
    };
  }

export const fetchcategories = async () => { 
    try{
      const response = await apiClient.get(`/categories/`);
      return response.data;                       
    } catch(error){
      console.log('api.js : error fetching the categories ', error.message);
      throw error; 
    };
  }


  export const fetchcategoryproducts = async (category) => { 
    try{
      const response = await apiClient.post(`/category_products/`,{ category });
      return response.data;                       
    } catch(error){
      console.log('api.js : error fetching the categories ', error.message);
      throw error; 
    };
  }

export const login = async (username, password) => {
  try {
    const response = await apiClient.post(`/login/`, { username, password });
    if (response) {
        if (response.data.access) {

          await AsyncStorage.setItem('@accessToken', response.data.access);
          await AsyncStorage.setItem('@refreshToken', response.data.refresh);

          // Verifying that the token is being stored
          const storedAccessToken = await AsyncStorage.getItem('@accessToken');
          const storedRefreshToken = await AsyncStorage.getItem('@refreshToken');

          console.log('(api.js.login) Stored access token:', storedAccessToken);
          console.log('(api.js.login) Stored refresh token:', storedRefreshToken);

          return response.data;

        } else {
          throw new Error('Wrong username or password');
        
        }
    }else{
      console.log('response =! 200')
    }
  } catch (error) {
    console.log('Error at the login function in Api.js:', error.message);
    throw error;
  }
};

export const register = async (username, password, email) => {
  try {
    console.log('test api.register function...');

    const response = await apiClient.post(`/register/`, { username, password, email });

    if (response.data.success) {
      console.log('the data react got in api.register :', response.data);
      return response.data;
    } else {
      throw new Error('Registration failed :(');
    }
  } catch (error) {
    console.log('Error at the register function in Api.js', error.message);
    throw error;
  }
};

export const updateUsername = async (newUsername) => {
  try {
    //get the authent. token 
    const token = await AsyncStorage.getItem('@accessToken');
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
    const token = await AsyncStorage.getItem('@accessToken');
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


export const getUserDetails = async () => {
  try {
    
    console.log('testing before geting the data');
    const token = await AsyncStorage.getItem('@accessToken');
    console.log('testing after geting the data, token : ' , token );
    
    if(!token){
     throw new Error('getUserDetails didnt get the token');  
    
    }const response = await apiClient.get(`/api/profile/`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('API response:', response.data);  // Log the response
    
    
      return response.data ;
  
  } catch (error) {
    console.error('Error at the getUserDetails function in Api.js:', error);
    throw error;
  }
};


export const searchProduct = async(searchQuery)=>{
  try {
    const response = await apiClient.post(`/search/` , {searchQuery});
    console.log('API response:', response.data);  
    return response.data;
  }catch(error){
    console.log('api.js: error searching for the product ', error.message );
    throw error;
  }
};


// apiClient.interceptors.request.use(async (config) => {
//   const token = await AsyncStorage.getItem('@accessToken');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

export const fetchCart = async () => {
  try {
    const response = await apiClient.get('/cart/');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateCart = async (cart) => {
  try {
    const response = await apiClient.put('/cart/', { items: cart });
    return response.data;
  } catch (error) {
    throw error;
  }
};