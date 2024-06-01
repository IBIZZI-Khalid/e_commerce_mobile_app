import React from 'react';
import { Modal, View, Text, Button, StyleSheet, Image } from 'react-native';
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
              <Button
                title="Sign Up"
                onPress={() => navigation.navigate('Account')}
                style={styles.signUpButton}
              />
              <Button
                title="Log In"
                onPress={() => navigation.navigate('Accout')}
                style={styles.loginButton}
              />
            </View>
            <Button title="Close" onPress={onClose} style={styles.closeButton} />
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
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  signUpButton: {
    backgroundColor: '#4285F4', // Primary blue color
    color: '#fff', // White text color
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  loginButton: {
    backgroundColor: '#ccc', // Light gray color
    color: '#000', // Black text color
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  closeButton: {
    backgroundColor: '#f00', // Red color
    color: '#fff', // White text color
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
});

export default ModalComponent;
