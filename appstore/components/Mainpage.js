import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text,Image } from 'react-native';
import {fetchProducts} from './Api';

const styles = StyleSheet.create({
  parrent_main : { 
    backgroundColor: '#C4DFE6',
  flex : 1 ,

  },
});

const Mainpage = () => {
  const [products, setProducts] = useState();

  useEffect(() => {
    console.log('Fetching products...');

    const fetchData = async () => {
      
        const data = await fetchProducts();
        console.log('test before setProduct function...');
        setProducts(data);
        console.log('data set done ');
        console.log('done Fetching products:');    
     
    };

    fetchData();
  }, []);

  return (
    <View style={styles.parrent_main}>
      {/* <Header /> */}
      <Text>Products:</Text>
      {/* <Image source={require('../assets/image.png')} /> */}
      {products?.map((element,index)=>(<Text key={index}>{element.price}</Text>))}  
      
      {/* ?.  simply means  if the variable is not null or undefined  then do this */}
      {/* <Image source={require("../assets/image.png")}/>  */}
    </View>
  );
};

export default Mainpage;



