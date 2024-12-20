import './src/utils/ignoreWarnings';
import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import {SafeAreaProvider} from 'react-native-safe-area-context';
import { NativeBaseProvider, Box } from 'native-base';
import LoginScreen from './src/screens/Auth/LoginScreen';
import HomeScreen from './src/screens/Main/HomeScreen';
import SplashScreen from './src/screens/Splash/SplashScreen';

import ProfileScreen from './src/screens/Main/ProfileScreen';


const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NativeBaseProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="splash">
          <Stack.Screen
            name="splash"
            component={SplashScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="login"
            component={LoginScreen}
            options={{
              headerShown: false,
            }}
          />


          <Stack.Screen
            name="profile"
            component={ProfileScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="home"
            component={HomeScreen}
            options={{
              headerShown: false,
            }}
          />

        </Stack.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  );
};

export default App;

const styles = StyleSheet.create({});
