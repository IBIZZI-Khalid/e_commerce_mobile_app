import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, FlatList, ActivityIndicator, ScrollView } from 'react-native';
import { fetchProducts } from './Api';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import Header from './Header';

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




const Mainpage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  let [fontsLoaded] = useFonts({ 'CustomFont': require('../assets/fonts/Ubuntu-Regular.ttf'), });
  
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

  const colors = ['rgba(0, 0, 0, 0.5)', 'rgba(0, 60, 180, 0.4)' ,'rgba(108, 0, 0, 0.7)','rgba(128, 99, 195, 0.4)', ];
  const renderItem = ({ item, index }) => (
    <View style={styles.productItem}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={[styles.overlay, { backgroundColor: colors[index % colors.length] }]} />
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

  if (!fontsLoaded) {
    return null;
  }

  return (<View style={styles.gradientContainer}>
    <LinearGradient 
      colors={['black', '#531889']} 
      style={styles.LinearGradient} 
      start={{ x: 0, y: 1 }} 
      end={{ x: 1, y: 0 }}
    >
      <View style={styles.top_div}>
        <Text style={styles.first_phrase}>Compare everything & anything</Text>
        <Text style={styles.suggests_phrase}>Whats it gonna be? A smartphone, watch, TV?</Text>
      </View>
      <View style={styles.waveContainer}>
        <Wave />
      </View>
    </LinearGradient>
    <FlatList
      data={products}
      renderItem={renderItem}
      keyExtractor={(item) => item._id}
      ListHeaderComponent={() => (
        <View>
          {/* Your non-list content */}
          <LinearGradient 
            colors={['black', '#531889']} 
            style={styles.LinearGradient} 
            start={{ x: 0, y: 1 }} 
            end={{ x: 1, y: 0 }}
          >
            <View style={styles.top_div}>
              <Text style={styles.first_phrase}>Compare everything & anything</Text>
              <Text style={styles.suggests_phrase}>Whats it gonna be? A smartphone, watch, TV?</Text>
            </View>
            <View style={styles.waveContainer}>
              <Wave />
            </View>
          </LinearGradient>
        </View>
      )}
      contentContainerStyle={styles.flatListContainer}
    />
  </View>
  
  );
};


export default Mainpage;

const styles = StyleSheet.create({
  gradientContainer: {
    flexDirection: 'column',
    flex: 1,
    top: 0,
    zIndex: 1,
    fontFamily: 'CustomFont',
  },

  ScrollViewcCntent: {
    flexDirection: 'column',
    flexGrow: 1,
  },

  LinearGradient: {
    flex: 1,
    height: 700,
  },

  top_div: {
    color: 'white',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    flexShrink: 1,
  },

  first_phrase: {
    color: 'white',
    fontFamily: 'CustomFont',
    fontSize: 35,
  },

  suggests_phrase: {
    fontFamily: 'CustomFont',
    color: 'white',
  },


  transparent_svg: {
    opacity: 0.2,
    position: 'absolute',
    width: '100%',
    height: 80,
  },

  upper_svg: {
    position: 'absolute',
    width: '100%',
    height: 80,
  },

  waveContainer: {
    backgroundColor: 'transparent',
    width: '100%',
    height: 80,
  },

  flatListContainer: {
    paddingBottom: 20,
    backgroundColor: 'white',
    display:'grid',

  },

  productItem: {
    backgroundColor: '#fff',
    marginVertical: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    position: 'relative',
  },

  productImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 8,
  },

  productTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    fontFamily: 'CustomFont',
    position: 'absolute',
    bottom: 30,
    left: 10,
    color: 'white',
  },

  productPrice: {
    fontSize: 16,
    color: 'white',
    fontFamily: 'CustomFont',
    position: 'absolute',
    bottom: 10,
    left: 10,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
