import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';

function MyTabBar({ state, descriptors, navigation }) {
  return (
    <View style={styles.container}>
      <BlurView intensity={50} style={styles.blurView} tint="light">
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <Pressable
              key={route.key}
              role="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.pressable}
            >
              {options.tabBarIcon && options.tabBarIcon({ focused: isFocused })}
            </Pressable>
          );
        })}
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 25,
    left: 20,
    right: 20,
    elevation: 0,
    borderRadius: 15,
    height: 90,
    overflow: 'hidden', // Ensure children don't overflow the rounded corners
    shadowColor: 'rgba(219, 170, 255, 1)',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.5,
    elevation: 5,
  },
  blurView: {
    flex: 1,
    flexDirection: 'row', // Ensure items are laid out in a row
    backgroundColor: 'rgba(255, 255, 255, 0.49)', // Semi-transparent blue background
    justifyContent: 'space-around', // Distribute the items evenly
    alignItems: 'center', // Center items vertically
  },
  pressable: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MyTabBar;
