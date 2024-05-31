import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { fetchcategoryproducts } from './Api';
import { ScrollView } from 'react-native';
import UseSearchHandler from './Search.js';
import { useNavigation } from '@react-navigation/native';

const CategoryScreen = ({ route }) => {
  const { category } = route.params;
  const [data, setData] = useState([]);
  const {handleSearch } = UseSearchHandler();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation =useNavigation();

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
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {data.map((item) => (

              <TouchableOpacity
                key={item._id}
                onPress={async() =>  {
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
                    <View>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemPrice}>{item.price}</Text>
                    </View>
                    <Image source={{ uri: item.image }} style={styles.itemImage} />
                  </View>
              </TouchableOpacity>
            ))}
      </ScrollView>  
      {/* <FlatList
        data={data}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity>
          <View style={styles.itemContainer}>
            <View>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemPrice}>{item.price}</Text>
            </View>
            <Image source={{ uri: item.image }} style={styles.itemImage} />
          </View>
          </TouchableOpacity>
        )}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  itemContainer: {
    // backgroundColor:'black',
    justifyContent:'center',
    alignItems:'center',
    flexDirection:'column',
    padding:50,
    margin:50,
    flex:1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemPrice: {
    fontSize: 16,
    color: 'gray',
  },
  itemImage: {
    width: 320,
    height: 240,
    borderRadius: 24 ,
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
