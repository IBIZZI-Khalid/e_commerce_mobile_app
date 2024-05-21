import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, FlatList } from 'react-native';
import { fetchProducts } from './Api';

const styles = StyleSheet.create({
  parrent_main: {
    backgroundColor: '#C4DFE6',
    flex: 1,
    padding: 10,
  },
  productItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  productImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  productTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  productPrice: {
    fontSize: 16,
    color: '#888',
  },
});

const Mainpage = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    console.log('Fetching products...');

    const fetchData = async () => {
      const data = await fetchProducts();
      console.log('test before setProduct function...');
      setProducts(data);
      console.log('data set done');
      console.log('done Fetching products:');
    };

    fetchData();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.productItem} key={item.id}>
      <Image
        source={{ uri: item.image_url }}
        style={styles.productImage}
      />
      <Text style={styles.productTitle}>{item.name}</Text>
      <Text style={styles.productPrice}>${item.price}</Text>
    </View>
  );

  return (
    <View style={styles.parrent_main}>
      <Text>Products:</Text>
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
};

export default Mainpage;
