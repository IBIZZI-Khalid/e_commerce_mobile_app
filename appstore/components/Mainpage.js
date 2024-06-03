import React, { memo, useCallback, useEffect, useState } from 'react';
import { StyleSheet,
    View, Text, Image,
    FlatList, ActivityIndicator,
    TextInput,TouchableOpacity,
    ScrollView, 
    Platform} from 'react-native';
import { fetchProducts , fetchcategories ,fetch_trending_products} from './Api.js';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { useFonts } from 'expo-font';
import UseSearchHandler from './Search.js';
import { useNavigation } from '@react-navigation/native';
import ModalComponent from './Modal.js';
import Header from './Header.js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Wave = memo(() => (
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
));

function GameCard({ game }) {
  const [isFavourite, setFavourite] = useState(false);

  return (
    <View style={styles.parentviewcard}>
      <Image source={{uri: game.image}} style={styles.Cardimg} />
      <LinearGradient colors={['transparent', 'rgba(0, 0, 0, 0.7)']} style={styles.Cardbackground}>
       
        <View style={{ marginVertical: 8 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'rgba(255, 255, 255, 0.7)' }}>
            {game.name}
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
}


const SearchBar = ({ searchQuery, setSearchQuery }) => {
  return (
        <TextInput 
          style={styles.searchbar}
          placeholder="Search for a product"
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="grey"
        />
  );
};


const Mainpage = () => {
  const { handleSearch } = UseSearchHandler();
  const [products, setProducts] = useState([]);
  const [trendingproducts, setTrendingProducts] = useState([]);
  const [categories, setcategories] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(true);
 const[reversedtrendingproducts,setrevertrendingproducts]=useState([]);

  let [fontsLoaded] = useFonts({ 'CustomFont': require('../assets/fonts/Ubuntu-Regular.ttf'), });
  const navigation = useNavigation();
  
  useEffect(() => {
    const checkModalShown = async () => {
      try {
        const value = await AsyncStorage.getItem('modalShown');
        if (value === null) {
          setModalVisible(true);
          await AsyncStorage.setItem('modalShown', 'true');
        }
      } catch (error) {
        console.error('Error checking modal status:', error);
      }
    };
    checkModalShown();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchProducts();
        setProducts(response.products_data);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProductsError(error);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchData();
  }, []); // Empty dependency array means this runs once when the component mounts
  
  
  useEffect(() => {
    const fetchCategoriesData = async () => {
      try {
        const response = await fetchcategories();
        setcategories(response.categories_data);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProductsError(error);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchCategoriesData();
  }, []);


  useEffect(() => {
    const fetchtrendingData = async () => {
      try {
        const response = await fetch_trending_products();
        // log the response :
        console.log('mainpage response : ',response);

        setTrendingProducts(response.trending_products);
        setrevertrendingproducts([...response.trending_products].reverse());//the second row of trending data kaybdamn lekher dyal list 

      } catch (error) {
        console.error('Error fetching products:', error);
        setProductsError(error);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchtrendingData();
  }, []); 


  const handleCloseModal = () => {
    setModalVisible(false);
  };
  const handleSearchButtonPress = useCallback(async () => {
    try {
      const result = await handleSearch(searchQuery);
      console.log('Received search result:', result);
  
      // Ensure the result is properly resolved and passed
      if (result && Object.keys(result).length > 0) {
        navigation.navigate('SearchResultScreen', { searchResult: result });
        console.log('Navigating from mainpage to SearchResultScreen with data:', result);
      } else {
        console.log('No search results found');
      }
    } catch (error) {
      console.error('Error while searching:', error);
    }
  }, [handleSearch, searchQuery, navigation]);
  

  const renderItem = useCallback(({ item, index }) => {
    const colors = ['rgba(0, 0, 0, 0.5)', 'rgba(0, 60, 180, 0.4)', 'rgba(108, 0, 0, 0.7)', 'rgba(128, 99, 195, 0.4)'];
    return (
      <View style={styles.productItem}>
        <Image source={{ uri: item.image }} style={styles.productImage} />
        <View style={[styles.overlay, { backgroundColor: colors[index % colors.length] }]} />
        <Text style={styles.productTitle}>{item.name}</Text>
        <Text style={styles.productPrice}>${item.price}</Text>
      </View>
    );
  },[]);






  if (loadingProducts) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (productsError) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Error loading products: {productsError.message}</Text>
      </View>
    );
  }

  if (!fontsLoaded) {
    return null;
  }







  return (
    <ScrollView vertical showsVerticalScrollIndicato={false} >
    <View style={styles.gradientContainer}>
    
      <ModalComponent visible={modalVisible} onClose={handleCloseModal} />
      <LinearGradient
        colors={['black', '#531889']}
        style={styles.LinearGradient}
        start={{ x: 0, y: 0.3 }}
        end={{ x: 1, y: 0 }}
      >
        <Header />
        <View style={styles.top_div}>
        
          {/* attention to the big phrases */}
          <Text style={styles.first_phrase}>Compare everything & anything</Text>
          <Text style={styles.suggests_phrase}>Whats it gonna be? A smartphone, watch, TV?</Text>
         
         
          {/* searchpart */}
          <View style={styles.searchview}>
            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            <TouchableOpacity style={styles.searchbutton} onPress={handleSearchButtonPress}>
              <Text style={styles.searchbuttontext}>Search</Text>
            </TouchableOpacity>
          </View>
        
        </View>

        {/* waves coming !! */}
        <View style={styles.waveContainer}>
          <Wave />
        </View>
      
      </LinearGradient>

      {/* footer suggestions */}
      <View style={styles.footerContainer}>
        <Text style={styles.Categoriestext}>Suggestions By Category</Text>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollview}>
            {categories.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => navigation.navigate('CategoryScreen', { category: item.name})}
              >
                <GameCard game={item} />
              </TouchableOpacity>
            ))}
        </ScrollView>   
        

        <Text style={styles.Categoriestext}>Or Check The Trending Products</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {reversedtrendingproducts.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={async () => {
                  const result = await handleSearch(item.name);
                  if(result){
                    navigation.navigate('SearchResultScreen', { searchResult: result });
                    console.log('Navigating from mainpage to SearchResultScreen with data:', result);
                    }else{
                      console.log('No search results found');
                    }
                }}
                  
              >
                <GameCard game={item} />
              </TouchableOpacity>
            ))}
        </ScrollView>  
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {trendingproducts.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => navigation.navigate('CategoryScreen', { category: item.name})}
              >
                <GameCard game={item} />
              </TouchableOpacity>
            ))}
        </ScrollView>  
        

        
      </View>
    </View>
    </ScrollView>
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

  LinearGradient: {
    flex: 1,
    minHeight:850,
  },

  top_div: {
    // color: 'white',
    flex: 1,
    // minHeight :850,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    // paddingBottom:'50%',

    flexShrink: 1,
  },

  first_phrase: {
    color: 'white',
    fontFamily: 'CustomFont',
    fontSize: 30,
  },

  suggests_phrase: {
    fontFamily: 'CustomFont',
    color: 'white',
  }, 
  searchbar:{
    backgroundColor: 'white',
    width: 350,
    borderRadius:50,
    fontFamily:'CustomFont',
    fontSize: 15,
    marginTop:10,
    color:'black',
    padding:10,
    shadowColor : 'rgba(219, 170, 255, 1)',
    shadowOffset   :{
      width : 0 ,
      height : 10 , 
    },
    shadowOpacity : 0.3,
    shadowRadius : 3.5,
    elevation : 5 ,
  },
  searchview:{
    flexDirection:'column',
    padding:5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchbutton: {
    width: 200,
    borderRadius:50,
    fontSize: 15,
    marginTop:10,

    backgroundColor:'rgba(40, 13, 58, 0.76)',
    padding:10,
    shadowColor : 'rgba(219, 170, 255, 1)',
    shadowOffset   :{
      width : 0 ,
      height : 10 , 
    },
    shadowOpacity : 0.3,
    shadowRadius : 3.5,
    elevation : 5 ,
    alignItems: 'center',
    justifyContent: 'center',
   },

   searchbuttontext:{
    fontFamily:'CustomFont',
    color:'white',
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
  keyboardAvoidingView:{
    flex:1,
  },
  footerContainer:{ 
    // paddingBottom: 50,
    // marginBottom:50,
    backgroundColor:'white'
  },

  parentviewcard:{
    
    position: 'relative' ,
    margin:5,
   
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  Cardimg:{ 
    width: 320,
    height: 240,
    borderRadius: 24 ,

  },

    Cardbackground:{ 
      position: 'absolute', 
      padding: 16, 
      height: '100%', 
      width: '100%', 
      justifyContent: 'space-between', 
      borderRadius: 24 
    },

    Cardrow:{ 
      flexDirection: 'row', 
      justifyContent: 'flex-end'
    },
    
    hearticon:{ 
      padding: 12, 
      borderRadius: 50,
      backgroundColor: 'rgba(255,255,255,0.3)' 
    },
    Categoriestext:{
      fontSize: 18,
      fontWeight: 'bold',
      marginVertical: 10,
      fontFamily: 'CustomFont',
      fontFamily:'CustomFont',
      // position: 'absolute',
      // bottom: 30,
      left: 10,
    color: 'black',
      
    },
    scrollview:{
      margin:20
    }
});