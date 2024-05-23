import React , {useEffect} from "react";
import { View , Text , Image , StyleSheet , ActivityIndicator } from "react-native";
import * as SplashScreen from 'expo-splash-screen' ;

//do not hide it !
SplashScreen.preventAutoHideAsync();
const SplashScreenComponent =() => {
    useEffect(() => {
        const hideSplashScreen =async () =>{
            await new Promise(resolve => setTimeout(resolve, 2000));
            await SplashScreen.hideAsync();
          };
      
          hideSplashScreen();
        }, []);
      
        return (
          <View style={styles.container}>
            <Image source={require('../assets/image.png')} style={styles.logo} />
            <Text style={styles.text}>Welcome to MyApp</Text>
            <ActivityIndicator size="large" color="#ffffff" />
          </View>
        );
      };
      
      const styles = StyleSheet.create({
        container: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#4d3b75',
        },
        logo: {
          width: 100,
          height: 100,
          marginBottom: 20,
        },
        text: {
          fontSize: 24,
          color: '#ffffff',
          marginBottom: 20,
        },
      });
      
      export default SplashScreenComponent;