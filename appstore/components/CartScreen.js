import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { fetchCart, updateCart } from './Api';

const CartScreen = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const route = useRoute();

  useEffect(() => {
    const loadCart = async () => {
      if (route.params?.cart) {
        setCart(route.params.cart);
      } else {
        try {
          const cartData = await fetchCart();
          setCart(cartData.items);
        } catch (error) {
          console.error("Failed to fetch cart data", error);
        }
      }
      setLoading(false);
    };

    loadCart();
  }, [route.params?.cart]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading cart...</Text>
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
        <TouchableOpacity style={styles.removeButton} onPress={() => removeFromCart(item)}>
          <Text style={styles.removeButtonText}>Remove</Text>
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
    backgroundColor: 'red',
    borderRadius: 5,
  },
  removeButtonText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default CartScreen;
