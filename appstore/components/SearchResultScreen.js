import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, Dimensions ,ScrollView} from 'react-native';
import { useFonts } from 'expo-font';
import { fetchCart, updateCart } from './Api';
import { BarChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const SearchResultScreen = ({ route }) => {
  const navigation = useNavigation();
  const { searchResult } = route.params;
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedProducts, setSelectedProducts] = useState({
    avito_products: searchResult?.avito_products?.[0] || null,
    jumia_products: searchResult?.jumia_products?.[0] || null,
    electroplanet_products: searchResult?.electroplanet_products?.[0] || null,
  });

  console.log('Received search result in SearchResultScreen:', searchResult);

  let [fontsLoaded] = useFonts({
    'CustomFont': require('../assets/fonts/Ubuntu-Regular.ttf'),
  });
  if (!fontsLoaded) {
    return null;
  }

  useEffect(() => {
    const loadCart = async () => {
      try {
        const cartData = await fetchCart();
        setCart(cartData.items || []);
      } catch (error) {
        console.error("Failed to fetch cart data", error);
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, []);

  if (!searchResult || Object.values(searchResult).every(arr => arr.length === 0)) {
    return (
      <View style={styles.container}>
        <Text>No search results found.</Text>
      </View>
    );
  }

  const addToCart = async (item) => {
    try {
      const itemExists = cart.some(cartItem => cartItem._id === item._id);
      if (itemExists) {
        console.warn('Item already exists in the cart');
        return;
      }
      const newCart = [...cart, item];
      setCart(newCart);
      const cartId = item._id;
      await updateCart(cartId, newCart);
    } catch (error) {
      console.error("Failed to update cart", error);
    }
  };

  const handleScroll = (collection, index) => {
    setSelectedProducts(prev => ({
      ...prev,
      [collection]: searchResult[collection][index]
    }));
  };

  const renderItem = ({ item, index, collection }) => (
    <TouchableOpacity onPress={() => handleScroll(collection, index)}>
      <View style={styles.productItem}>
        <Image source={{ uri: item.image }} style={styles.productImage} />
        <View style={styles.productInfo}>
          <Text style={styles.productTitle}>{item.name}</Text>
          <Text style={styles.productPrice}>{item.price} MAD</Text>
          <Text style={styles.productRating}>{item.rating}</Text>
          {Array.isArray(item.description) ? (
            item.description.map((desc, idx) => {
              const key = Object.keys(desc)[0];
              return (
                <Text key={idx} style={styles.productDescription}>
                  {key}: {desc[key]}
                </Text>
              );
            })
          ) : (
            <View>
              <Text style={styles.productDescriptiontitle}>Seller's Description :</Text>
              <Text style={styles.productDescription}>{item.description}</Text>
            </View>
          )}
          <TouchableOpacity style={styles.addButton} onPress={() => addToCart(item)}>
            <Text style={styles.addButtonText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderCollection = (collection) => (
    <View key={collection}>
      <Text style={styles.collectionTitle}>{collection}</Text>
      <FlatList
        data={searchResult[collection]}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => item._id + index}
        renderItem={({ item, index }) => renderItem({ item, index, collection })}
        pagingEnabled
        onScroll={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / screenWidth);
          handleScroll(collection, index);
        }}
      />
    </View>
  );

  const chartData = {
    labels: ['Avito', 'Jumia', 'Electroplanet'],
    datasets: [
      {
        data: [
          selectedProducts.avito_products ? parseFloat(selectedProducts.avito_products.price.replace(/\s/g, '').replace(',', '.')) : 0,
          selectedProducts.jumia_products ? parseFloat(selectedProducts.jumia_products.price.replace(/\s/g, '').replace(',', '.')) : 0,
          selectedProducts.electroplanet_products ? parseFloat(selectedProducts.electroplanet_products.price.replace(/\s/g, '').replace(',', '.')) : 0,
        ],
      },
    ],
  };

  return (
    <ScrollView style={styles.container}>
      {Object.keys(searchResult).map(collection => renderCollection(collection))}
      <BarChart
        data={chartData}
        width={screenWidth - 32}
        height={220}
        yAxisLabel="MAD "
        chartConfig={{
          backgroundColor: '#e26a00',
          backgroundGradientFrom: '#fb8c00',
          backgroundGradientTo: '#ffa726',
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        }}
        style={styles.chartStyle}
      />
      <TouchableOpacity style={styles.cartButton} onPress={() => navigation.navigate('CartScreen', { cart })}>
        <Text style={styles.cartButtonText}>Go to Cart</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  productItem: {
    flexDirection: 'row',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    paddingBottom: 16,
    width: screenWidth - 32,
  },
  productImage: {
    width: 100,
    height: 100,
    marginRight: 16,
  },
  productInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  productTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productPrice: {
    fontSize: 14,
    color: '#888',
  },
  productRating: {
    fontSize: 14,
    color: '#888',
  },
  productDescription: {
    fontSize: 14,
    color: '#888',
  },
  productDescriptiontitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  addButton: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#007BFF',
    borderRadius: 4,
  },
  addButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  collectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  chartStyle: {
    marginVertical: 8,
    borderRadius: 16,
  },
  cartButton: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#28a745',
    borderRadius: 4,
  },
  cartButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  noResultText: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
  },
});

export default SearchResultScreen;
