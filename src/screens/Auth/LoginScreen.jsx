import {
  StyleSheet,
  View,
  StatusBar,
  ScrollView,
  Platform,
  BackHandler,
} from 'react-native';
import {
  Box,
  Text,
  Heading,
  VStack,
  FormControl,
  Input,
  Link,
  Button,
  HStack,
  Center,
  useToast,
} from 'native-base';
import React, { useEffect, useState } from 'react';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import firestore from '@react-native-firebase/firestore';
import AnimatedLoader from 'react-native-animated-loader';

const LoginScreen = ({ route }) => {
  const tempNavigation = useNavigation();
  const isFocused = useIsFocused();
  const [isConnected, setIsConnected] = useState(null);


  const backAction = () => {
    BackHandler.exitApp();
  };

  useEffect(() => {
    if (isFocused) {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );
      return () => backHandler.remove();
    }
  }, [isFocused]);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected !== isConnected) {
        setIsConnected(state.isConnected);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [isConnected]);







  return (
    <View style={{ flex: 1 }}>
      <AnimatedLoader
        visible={!isConnected}
        overlayColor="grey"
        source={require('../../assets/network.json')}
        animationStyle={styles.lottie}
        speed={0.4}
      />
      <StatusBar backgroundColor="lightblue" barStyle="dark-content" />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[
          styles.scrollContainer,
          {
            paddingTop:
              Platform.OS === 'ios'
                ? DeviceInfo?.hasNotch()
                  ? '5%'
                  : '2%'
                : '0%',
          },
        ]}>
        <View>
          <Center w="100%">
            <Box safeArea p="1" py="40" w="90%" maxW="350">
              <Heading
                size="xl"
                fontWeight="600"
                color="coolGray.800"
                _dark={{
                  color: 'warmGray.50',
                }}>
                Welcome to User-Directory
              </Heading>
              <Heading
                mt="1"
                _dark={{
                  color: 'warmGray.200',
                }}
                color="coolGray.600"
                fontWeight="medium"
                size="md">
                Press to continue!
              </Heading>

              <Button

                mt="2"
                size={'lg'}
                style={{
                  marginTop: '15%',
                  backgroundColor: 'indigo',
                  borderWidth: 1,
                  borderColor: 'grey',
                }}
                onPress={() => tempNavigation.navigate('home')}>
                Open
              </Button>
            </Box>
          </Center>
        </View>
      </ScrollView>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  lottie: {
    width: 200,
    height: 200,
  },
});
