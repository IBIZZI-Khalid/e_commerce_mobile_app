import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import 'nativewind';

const ModalComponent = ({ visible, onClose }) => {
  const navigation = useNavigation();
  let [fontsLoaded] = useFonts({ 'CustomFont': require('../assets/fonts/Ubuntu-Regular.ttf') });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay} className="items-center justify-center flex-1">
        <View style={styles.centeredView} className="items-center justify-center flex-1 mt-6">
          <View style={styles.modalView} className="m-20 rounded-2xl p-9 items-center shadow-md h-4/5 w-4/5 justify-center">
            <Text style={styles.modalText} className="text-3xl font-bold text-center">
              Welcome to
            </Text>
            <Image source={require('../assets/blackLogo.png')} style={styles.logo} />
            <Text style={styles.modalText} className="mb-4 text-lg font-bold text-center">
              Sign Up or Log In For More Features!
            </Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={() => navigation.navigate('Account')}
                style={styles.signUpButton}
              >
                <Text style={styles.buttonText}>Manage account !</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  centeredView: {
    // ... (existing styles)
  },
  modalView: {
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    flexDirection: 'column',
    padding: 10,
  },
  modalText: {
    fontFamily: 'CustomFont',
  },
  logo: {
    width: 300,
    height: 200,
    resizeMode: 'contain',
  },
  buttonContainer: {
    // justifyContent: 'space-between',
    // backgroundColor: 'rgba(122, 17, 195, 0.66)', 
    // width: 200,
    // marginBottom: 10,
  },
  signUpButton: {
    backgroundColor: 'rgba(122, 17, 195, 0.66)', // Primary blue color
    borderRadius: 50,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  closeButton: {
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
  buttonText: {
    color: '#fff', // White text color
    textAlign: 'center',
  },
});

export default ModalComponent;
