import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, FlatList, ActivityIndicator } from 'react-native';
import { fetchProducts } from './Api';
import { LinearGradient} from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';

const Wave = () => (
  <View>
    <View style={styles.transparent_svg}>
      <Svg height="100%" width="100%" viewBox="0 0 400 100" preserveAspectRatio='none'>
        <Path
          fill="white"
          d="M0 0 C50 0, 150 50, 200 50 S350 0, 400 10 L400 100 L0 100 Z"
        />
      </Svg>
    </View>
    <View style={styles.transparent_svg}>
      <Svg height="100%" width="100%" viewBox="0 0 400 100" preserveAspectRatio='none'>
        <Path
          fill="white"
          d="M0 100 Q200 -50, 400 100 Z"
        />
      </Svg>
    </View>
    <View style={styles.upper_svg}>
        <Svg height="100%" width="100%" viewBox="0 0 400 100" preserveAspectRatio='none'>
            <Path
              fill="white"
              d="M0 50 C50 110, 110 110, 200 50 S300 0, 400 90 L400 100 L0 100 Z"
            />
        </Svg>
    </View>
  </View>
);


const styles = StyleSheet.create({
  transparent_svg: {
    opacity:.2,
    zIndex:-1
  },

  waveContainer: {
    position: 'absolute',
    width: '100%',
    height: 100,
    bottom: 0,
  },
  top_div:{
    
    backgroundColor: 'white',
    flex:1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection :'column',


  },
  container :{
    maxHeight:700,
    paddingTop:20,
    flex: 1,
  },
  parrent_main: {
    // backgroundColor: '#AED9E0',
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
    <View style={styles.container}>
    <LinearGradient 
      colors={['black', '#AED9E0']} 
      style={styles.container} 
      start={{x: 1, y: 0}} 
      end={{x: 0, y: 1}}
    >

    <View style={styles.parrent_main}>
      <View style={styles.top_div}>
        <Text style={styles.first_phrase}>Compare everything & anything</Text>
        <Text style={styles.suggests_phrase}>Whats it gonna be ? a smartphone , watch , tv ?</Text>
      </View>
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
      />
    </View>
    </LinearGradient>
    <View style={styles.waveContainer}>
        <Wave />
      </View>
    </View>
  );
};

export default Mainpage;
