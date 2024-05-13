import axios from 'axios';
// const BASE_URL = 'http://127.0.0.1/'
// const BASE_URL = 'http://10.0.2.2:8000/'
//const BASE_URL = 'http://localhost:8000/';
const BASE_URL = 'http://192.168.11.168:8000/';
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
};



export const login = async (username,password) =>{
  const response = await axios.post(`${BASE_URL}api/accounts/login/`
    ,{username, password})
    return response.data 
  
    .catch(error =>{
    setError(error.message);
    })
}




export const register = async (username, password, email) => {
  try {
    const response = await axios.post(`${BASE_URL}/register`, {
      username,
      password,
      email
    });
    return response.data;
  } catch (error) {
    console.error(error);
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

// const BASE_URL = 'http://192.168.11.112:8000/';

// const fetchProducts = async () => {
//   try {
//     const response = await fetch(`${BASE_URL}mongo-products/`);

//     if (response.status === 200) {
//       console.log("got the response from the BE");
//       const data = await response.json(); // Parse the JSON response
//       return data;
//     } else {
//       throw new Error("Received non-200 status code");
//     }
//   } catch (error) {
//     throw new Error(`api file => Error fetching products: ${error}`);
//   }
// };

// export default fetchProducts;



// // Function to add a new product to the backend
// export const addProduct = async (productData) => {
//   try {
//     const response = await axios.post(`${BASE_URL}/api/products/`, productData);
//     return response.data;
//   } catch (error) {
//     throw new Error(`Error adding product: ${error.message}`);
//   }
// };

// // Add more functions for other API endpoints as needed
