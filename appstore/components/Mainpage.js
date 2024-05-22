import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, FlatList, ActivityIndicator } from 'react-native';
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const Mainpage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchProducts();
        setProducts(response.products_data);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.productItem}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <Text style={styles.productTitle}>{item.name}</Text>
      <Text style={styles.productPrice}>${item.price}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Error loading products: {error.message}</Text>
      </View>
    );
  }

  return (
    <View style={styles.parrent_main}>
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
};

export default Mainpage;
