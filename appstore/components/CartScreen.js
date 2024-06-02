import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { fetchCart, updateCart } from './Api';

const CartScreen = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();
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
        <Text style={styles.emptyCartText}>Your cart is empty.</Text>
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
        <TouchableOpacity
          style={styles.compareButton}
          onPress={async () => {
            const result = await handleSearch(item.name);
            if (result) {
              navigation.navigate('SearchResultScreen', { searchResult: result });
            } else {
              console.log('No search results found');
            }
          }}
        >
          <Text style={styles.buttonText}>View on Original Platform</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.removeButton} onPress={() => removeFromCart(item)}>
          <Text style={styles.buttonText}>Remove</Text>
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
    padding: 20,
    backgroundColor: '#f7f7f7',
  },
  emptyCartText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginTop: 20,
  },
  cartItem: {
    flexDirection: 'row',
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
  },
  cartItemImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 15,
  },
  cartItemInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  cartItemTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  cartItemPrice: {
    fontSize: 18,
    color: '#888',
    marginBottom: 10,
  },
  compareButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#008AA8',
    borderRadius: 5,
    alignItems: 'center',
  },
  removeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#ED3838',
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CartScreen;
