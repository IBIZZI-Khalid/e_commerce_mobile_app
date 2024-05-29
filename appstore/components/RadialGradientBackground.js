import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Defs, RadialGradient, Stop, Rect } from 'react-native-svg';

const RadialGradientBackground = () => (
  <View style={styles.container}>
    <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
      <Defs>
        <RadialGradient
          id="grad"
          cx="95%"
          cy="0%"
          rx="750"
          ry="1000"
          fx="95%"
          fy="0%"
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset="0%" stopColor="#531889" stopOpacity="1" />
          <Stop offset="70%" stopColor="#000" stopOpacity="1" />
        </RadialGradient>
      </Defs>
      <Rect
        x="0"
        y="0"
        width="100%"
        height="100%"
        fill="url(#grad)"
      />
    </Svg>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default RadialGradientBackground;
