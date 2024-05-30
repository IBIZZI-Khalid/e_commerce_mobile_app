import React, { memo, useCallback, useEffect, useState } from 'react';
import { StyleSheet,
    View, Text, Image,
    FlatList, ActivityIndicator,
    TextInput,TouchableOpacity,
    ScrollView, 
    Platform} from 'react-native';
import { fetchProducts } from './Api';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { useFonts } from 'expo-font';
import UseSearchHandler from './Search.js';
import { useNavigation } from '@react-navigation/native';
import SearchResultScreen from './SearchResultScreen.js';
import { SafeAreaView } from 'react-native-safe-area-context'

const categories = ['Action', 'Family', 'Puzzle', 'Adventure', 'Racing', 'Education', 'Others'];
const featured = [
  {
      id: 1,
      title: 'Zooba',
      image: require('../assets/Rappi.jpeg'),
      downloads: '200k',
      stars: 4
  },
  {
      id: 2,
      title: 'Subway Surfer',
      image: require('../assets/Rappi.jpeg'),
      downloads: '5M',
      stars: 4
  },
  {
      id: 3,
      title: 'Free Fire',
      image: require('../assets/Rappi.jpeg'),
      downloads: '100M',
      stars: 3
  },
  
  {
      id: 4,
      title: "Alto's Adventure",
      image: require('../assets/Rappi.jpeg'),
      downloads: '20k',
      stars: 4
  },
]


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

// import { ArrowDownTrayIcon, HeartIcon } from 'react-native-heroicons/solid'
// import StarRating from 'react-native-star-rating';
// function GameCard({game}) {
//   const [isFavourite, setFavourite] = useState(false);
// return (
//   <View className="mr-4 relative">
//     <Image source={game.image} className="w-80 h-60 rounded-3xl"/>
//     <LinearGradient colors={['transparent', 'rgba(0, 0, 0, 0.6)']} 
//       className="absolute p-4 h-full w-full flex justify-between rounded-3xl">
//       {/* <View className="flex-row justify-end">
//           <TouchableOpacity
//               onPress={()=> setFavourite(!isFavourite)}
//               className="p-3 rounded-full"
//               style={{backgroundColor: 'rgba(255,255,255,0.3)'}}
//           >
//               <HeartIcon size="25" color={isFavourite? storeColors.redHeart: 'white'} />
//           </TouchableOpacity>
//       </View> */}
//       <View className="space-y-1">
//           {/* <StarRating
//               disabled={true}
//               starSize={15}
//               containerStyle={{width: 90}}
//               maxStars={5}
//               rating={game.stars}
//               emptyStar={require('../assets/image.png')}
//               fullStar={require('../assets/image.png')}
//           /> */}
//           <Text className="text-xl font-bold text-gray-300">
//               {game.title}
//           </Text>
//           <View className="flex-row items-center space-x-2">
//               {/* <ArrowDownTrayIcon size="18" color="lightgray" /> */}
//               <Text className="text-sm text-gray-300 font-semibold">
//                   {game.downloads} Downloads
//               </Text>
//           </View>
//       </View>
//     </LinearGradient>
//   </View>
// )
// }

function GameCard({ game }) {
  const [isFavourite, setFavourite] = useState(false);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Text key={i} style={{ color: i <= rating ? 'gold' : 'grey' }}>★</Text>
      );
    }
    return stars;
  };

  return (
    <View style={styles.parentviewcard}>
      <Image source={game.image} style={styles.Cardimg} />
      <LinearGradient colors={['transparent', 'rgba(0, 0, 0, 0.6)']} style={styles.Cardbackground}>
       
        
        <View style={styles.Cardrow}>
          <TouchableOpacity
            onPress={() => setFavourite(!isFavourite)}
            style={styles.hearticon}
          >
            <Text style={{ fontSize: 25, color: isFavourite ? 'red' : 'white' }}>
              {isFavourite ? '❤️' : '🤍'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ marginVertical: 8 }}>
          <View style={{ flexDirection: 'row' }}>
            {renderStars(game.stars)}
          </View>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'lightgray' }}>
            {game.title}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
            <Text style={{ fontSize: 18, color: 'lightgray' }}>⬇️</Text>
            <Text style={{ fontSize: 14, fontWeight: '600', color: 'lightgray', marginLeft: 8 }}>
              {game.downloads} Downloads
            </Text>
          </View>
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
  const { loading, error, searchResult, handleSearch } = UseSearchHandler();

  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  let [fontsLoaded] = useFonts({ 'CustomFont': require('../assets/fonts/Ubuntu-Regular.ttf'), });

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
  
  const navigation = useNavigation();
  const handleSearchButtonPress = useCallback(async () => {
    const result = await handleSearch(searchQuery);
    if(result){
    navigation.navigate('SearchResultScreen', { searchResult: result });
    console.log('Navigating to SearchResultScreen with data:', result);
    }else{
      console.log('No search results found');
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
    <View style={styles.gradientContainer}>
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        ListHeaderComponent={() => (
          <View>
            <LinearGradient 
              colors={['black', '#531889']} 
              style={styles.LinearGradient} 
              start={{ x: 0, y: 1 }} 
              end={{ x: 1, y: 0 }}
            >
              <View style={styles.top_div}>
                                                                                                                                                                   
                <Text style={styles.first_phrase}>Compare everything & anything</Text>
                <Text style={styles.suggests_phrase}>Whats it gonna be? A smartphone, watch, TV?</Text>
                
                {/* <KeyboardAvoidingView behavior={Platform.OS === "ios"? "padding" : "height"} style={styles.keyboardAvoidingView}> */}
                  <View>
                    <SearchBar 
                      searchQuery={searchQuery} 
                      setSearchQuery={setSearchQuery} 
                    />
                    <TouchableOpacity style={styles.searchbutton} onPress={handleSearchButtonPress}>
                      <Text style={styles.searchbuttontext}>Search</Text>
                    </TouchableOpacity>


                    {/* testing new things */}
                    <View className="pl-4">
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                          {
                            featured.map((item, index)=>{
                              return (
                                <GameCard key={index} game={item} />
                              )
                            })
                          }
                        </ScrollView>
                    </View>
                    


                  </View>

                {/* </KeyboardAvoidingView> */}
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

  LinearGradient: {
    flex: 1,
    height:850,
  },

  top_div: {
    color: 'white',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    paddingBottom:'50%',

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
  parentviewcard:{
    marginRight: 16, 
    position: 'relative' 
  },

  Cardimg:{ 
    width: 320,
    height: 240,
    borderRadius: 24 
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
    }
});