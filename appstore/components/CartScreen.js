import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { fetchCart, updateCart } from './Api';

const CartScreen = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isFocused = useIsFocused();

  useEffect(() => {
    const loadCart = async () => {
      try {
        const cartData = await fetchCart();
        setCart(cartData.items); // Ensure this line correctly sets the items
      } catch (error) {
        setError("Failed to fetch cart data");
        console.error("Failed to fetch cart data", error);
      } finally {
        setLoading(false);
      }
    };

    if (isFocused) {
      loadCart();
    }
  }, [isFocused]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>{error}</Text>
      </View>
    );
  }

  if (!cart || cart.length === 0) {
    return (
      <View style={styles.container}>
        <Text>Your cart is empty.</Text>
      </View>
    );
  }

  const removeFromCart = async (item) => {
    try {
      const newCart = cart.filter(cartItem => cartItem._id !== item._id);
      setCart(newCart);
      await updateCart(newCart);
    } catch (error) {
      console.error("Failed to update cart", error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.image }} style={styles.cartItemImage} />
      <View style={styles.cartItemInfo}>
        <Text style={styles.cartItemTitle}>{item.name}</Text>
        <Text style={styles.cartItemPrice}>{item.price} MAD</Text>
        <TouchableOpacity style={styles.ComparePress} 
        onPress={async() =>  {
          const result = await handleSearch(item.name);
          console.log('Search result from category screen:', result);
          if(result) {
            navigation.navigate('SearchResultScreen', { searchResult: result });
            console.log('Navigating to SearchResultScreen with data:', result);
          } else {
            console.log('No search results found');
          }
        }}>
          <Text style={styles.ButtonText}>Start Comparing !</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.removeButton} onPress={() => removeFromCart(item)}>
          <Text style={styles.ButtonText}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={cart}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  cartItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  cartItemImage: {
    width: 100,
    height: 100,
    marginRight: 16,
  },
  cartItemInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  cartItemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cartItemPrice: {
    fontSize: 16,
    color: 'gray',
  },
  removeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: 'rgba(237, 56, 56, 0.8)',
    borderRadius: 5,
  },
  ComparePress:{
    marginTop: 10,
    padding: 10,
    backgroundColor: 'rgba(0, 138, 168, 1)',
    borderRadius: 5,
  },
  ButtonText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default CartScreen;
