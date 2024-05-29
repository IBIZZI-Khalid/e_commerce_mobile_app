import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const TestComponent = () => {
  return (
    <View className="flex-1 justify-center items-center bg-gray-100">
      <Text className="text-2xl font-bold text-blue-500">Hello, NativeWind!</Text>
      <TouchableOpacity className="bg-blue-500 p-4 rounded mt-4">
        <Text className="text-white">Press Me</Text>
      </TouchableOpacity>
    </View>
  );
};

export default TestComponent;
