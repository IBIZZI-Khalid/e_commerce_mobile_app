import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { fetchcategoryproducts } from './Api';
import UseSearchHandler from './Search.js';
import { useNavigation } from '@react-navigation/native';

const CategoryScreen = ({ route }) => {
  const { category } = route.params;
  const [data, setData] = useState([]);
  const {handleSearch } = UseSearchHandler();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchcategoryproductsdata = async () => {
      try {
        const response = await fetchcategoryproducts(category);
        setData(response.category_products);
      } catch (error) {
        setError('Error fetching products');
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchcategoryproductsdata();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{category} Products</Text>
      <FlatList
        data={data}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            key={item._id}
            onPress={async() => {
              const result = await handleSearch(item.name);
              console.log('Search result from category screen:', result);
              if(result) {
                navigation.navigate('SearchResultScreen', { searchResult: result });
                console.log('Navigating to SearchResultScreen with data:', result);
              } else {
                console.log('No search results found');
              }
            }}
          >
            <View style={styles.itemContainer}>
              <Image source={{ uri: item.image }} style={styles.itemImage} />
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>{item.price}</Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  listContent: {
    paddingBottom: 16,
  },
  itemContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    marginHorizontal: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
    color: '#333',
  },
  itemPrice: {
    fontSize: 16,
    color: '#888',
    marginTop: 4,
  },
  itemImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 18,
  },
});

export default CategoryScreen;
