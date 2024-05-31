import { useNavigation } from '@react-navigation/native';
import React, { useState ,useEffect } from 'react';
import { View, Text, Image, StyleSheet,TouchableOpacity, FlatList, ScrollView ,SectionList} from 'react-native';
import { useFonts } from 'expo-font';
import { fetchCart, updateCart } from './Api'; 

const SearchResultScreen = ({ route }) => {
  // Extract the searchResult from route.params
  const { searchResult } = route.params;
  const navigation = useNavigation();
  const[ cart , setCart ] =useState([]);
  const [loading, setLoading] = useState(true);

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
        setCart(cartData.items || [] );
      } catch (error) {
        console.error("Failed to fetch cart data", error);
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, []);
  // Handle case when there are no search results
  if (!searchResult || Object.keys(searchResult).length === 0) {
    return (
      <View style={styles.container}>
        <Text>No search results found.</Text>
      </View>
    );
  };
  //prepare the datasection
  const sections = Object.keys(searchResult).map(collection => ({
    title: collection,
    data: searchResult[collection] === 'No result found' ? [] : [searchResult[collection]]
  }));
  
  const addToCart = async (item) => {
      try {
        const newCart = [...cart, item];
        setCart(newCart);
        await updateCart(newCart);
      } catch (error) {
        console.error("Failed to update cart", error);
      }
    };
  

  // Function to render each item
  const renderItem = ({ item }) => (
    <View style={styles.productItem}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productTitle}>{item.name}</Text>
        <Text style={styles.productPrice}>{item.price} MAD</Text>
        <Text style={styles.productRating}>{item.rating}</Text>
        
        {/* Handle description rendering */}
        {Array.isArray(item.description) ? (
          item.description.map((desc, index) => {
            const key = Object.keys(desc)[0];
            return (
              <Text key={index} style={styles.productDescription}>
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
  );

  // Function to render each section header
  const renderSectionHeader = ({ section: { title } }) => (
    <View style={styles.collectionContainer}>
      <Text style={styles.collectionTitle}>{title}</Text>
    </View>
  );


  //the actual return 
  return (
    <View style={styles.container}>
      <SectionList
        sections={sections}
        keyExtractor={(item, index) => item._id + index}
        renderItem={({ item }) => renderItem({ item })}
        renderSectionHeader={renderSectionHeader}
        ListEmptyComponent={() => <Text style={styles.noResultText}>No result found!</Text>}
      />
      <TouchableOpacity style={styles.cartButton} onPress={() => navigation.navigate('CartScreen', { cart })}>
        <Text style={styles.cartButtonText}>Go to Cart</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#f5f5f5', // Light background color
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor:'#E5E4E2',
    fontFamily: 'CustomFont',

  },
  collectionContainer: {
    marginBottom: 24, // Space between collections
  },
  collectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: '#531889', // Decorative underline
    paddingBottom: 4,
  },
  productItem: {
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
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 16,
  },
  productInfo: {
    flex: 1,
  },
  productTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#531889',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    color: '#888',
    marginBottom: 4,
  },
  productRating: {
    fontSize: 14,
    color: '#888',
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 12,
    color: '#666',
  },
  productDescriptiontitle:{
    fontSize: 16,
    color: '#666',
  },
  addButton: {
    marginTop: 8,
    backgroundColor: '#531889',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  noResultText: {
    fontSize: 16,
    color: '#888',
    fontStyle: 'italic',
  },
  cartButton: {
    backgroundColor: '#531889',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 16,
  },
  cartButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
export default SearchResultScreen;
