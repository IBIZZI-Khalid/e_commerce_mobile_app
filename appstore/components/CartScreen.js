import React from 'react';
import { View, Text, Image, StyleSheet, FlatList } from 'react-native';

const CartScreen = ({ route }) => {
  const { cart } = route.params;

  // Function to render each item in the cart
  const renderItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.image }} style={styles.cartItemImage} />
      <View style={styles.cartItemInfo}>
        <Text style={styles.cartItemTitle}>{item.name}</Text>
        <Text style={styles.cartItemPrice}>{item.price}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={cart}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={() => <Text style={styles.emptyCartText}>Your cart is empty!</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5', // Light background color
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5, // For Android shadow
  },
  cartItemImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 16,
  },
  cartItemInfo: {
    flex: 1,
  },
  cartItemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#531889',
    marginBottom: 4,
  },
  cartItemPrice: {
    fontSize: 16,
    color: '#888',
  },
  emptyCartText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 32,
  },
});

export default CartScreen;
