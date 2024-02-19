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
import React, {useEffect, useState} from 'react';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import firestore from '@react-native-firebase/firestore';

const LoginScreen = ({route}) => {
  const tempNavigation = useNavigation();
  const isFocused = useIsFocused();
  const [login, setlogin] = useState({
    email: '',
    password: '',
  });
  const [errorfield, setError] = useState({
    email: false,
    password: false,
  });
  const [bools, setBools] = useState({
    uniqueIdBool: true,
  });
  const [isConnected, setIsConnected] = useState(null);
  const email = route?.params?.email;
  useEffect(() => {
    if (email) {
      existUser(email);
    }
  }, [email]);

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

  const fetchUserByUniqueId = async conditions => {
    if (isConnected && bools.uniqueIdBool) {
      let uniqueId = await DeviceInfo.getUniqueId();
      let query = firestore().collection('user');
      if (conditions?.email) {
        query = query.where('email', '==', conditions?.email);
      } else {
        query = query.where('platform.uniqueId', '==', uniqueId);
      }
      query
        .get()
        .then(querySnapshot => {
          if (!querySnapshot.empty) {
            const user = querySnapshot.docs[0].data();
            onVerified(user);
          } else {
            if (!conditions?.email) {
              setBools(prevState => ({
                ...prevState,
                uniqueIdBool: false,
              }));
            }
          }
        })
        .catch(error => {
          console.log('Error getting user:', error);
          return null;
        });
      if (isConnected && !conditions?.stop) {
        fetchUserByUniqueId({stop: true});
      }
    }
  };
  const onVerified = async user => {
    let newkeyemail = user.email + '.UserData';
    try {
      let inputDataString = JSON.stringify(user);
      await AsyncStorage.setItem(newkeyemail, inputDataString);
      await AsyncStorage.setItem('session', user.email);
      let asyncresult = await AsyncStorage.getItem(newkeyemail);
      if (asyncresult) {
        tempNavigation.navigate('home', {email: user.email});
      } else {
        console.log('first toast');
      }
    } catch (error) {}
  };

  const existUser = async email => {
    let asyncresult = await AsyncStorage.getItem(email);
    asyncresult = JSON.parse(asyncresult);
    setlogin({
      email: asyncresult.email,
      password: asyncresult.password,
    });
  };

  const validateInputs = async data => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let regex = emailRegex.test(login.email);
    if (!regex || login.password.trim().length < 6) {
      setError({email: true, password: true});
    } else {
      let asyncresult = await AsyncStorage.getItem(login.email);
      if (!asyncresult) {
        setError({email: true});
      } else {
        asyncresult = JSON.parse(asyncresult);
        if (asyncresult.password === login.password) {
          let homeasyncdata = asyncresult.email + '.UserData';
          let homeasync = await AsyncStorage.getItem(homeasyncdata);
          if (homeasync) {
            setlogin({});
            setError({});
            tempNavigation.navigate('home', {email: asyncresult.email});
          } else {
            setlogin({});
            setError({});
            tempNavigation.navigate('form', {email: asyncresult.email});
          }
        } else {
          setError({password: true});
        }
        return 0;
      }
      return 0;
    }
    return 0;
  };

  const onSubmitInputs = async data => {
    let validate;
    if (login.email && login.password) {
      fetchUserByUniqueId({email: login.email});
      validate = validateInputs(data);
    } else {
      setError({
        email: false,
        password: false,
      });
    }
  };
  const onChangeInputs = (name, value) => {
    setlogin(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <View style={{flex: 1}}>
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
                Welcome to Zatpat News
              </Heading>
              <Heading
                mt="1"
                _dark={{
                  color: 'warmGray.200',
                }}
                color="coolGray.600"
                fontWeight="medium"
                size="md">
                Log in to continue!
              </Heading>

              <VStack space={5} mt="5">
                <FormControl isInvalid={errorfield.email}>
                  <FormControl.Label _text={{fontSize: 'lg'}}>
                    Email ID
                  </FormControl.Label>
                  <Input
                    value={login.email}
                    size={'2xl'}
                    onChangeText={text => onChangeInputs('email', text)}
                  />
                  <FormControl.ErrorMessage
                    _text={{
                      fontSize: 'xs',
                    }}>
                    Invalid Username
                  </FormControl.ErrorMessage>
                </FormControl>
                <FormControl isInvalid={errorfield.password}>
                  <FormControl.Label _text={{fontSize: 'lg'}}>
                    Password
                  </FormControl.Label>
                  <Input
                    size={'2xl'}
                    type="password"
                    value={login.password}
                    onChangeText={text => onChangeInputs('password', text)}
                  />
                  <FormControl.HelperText
                    _text={{
                      fontSize: 'md',
                    }}>
                    password minimum length should be 6.
                  </FormControl.HelperText>
                  <FormControl.ErrorMessage
                    _text={{
                      fontSize: 'xs',
                    }}>
                    Invalid Password
                  </FormControl.ErrorMessage>
                </FormControl>

                <Button
                  disabled={
                    login.email && login?.password?.length > 5 ? false : true
                  }
                  mt="2"
                  size={'lg'}
                  style={{
                    backgroundColor:
                      login.email && login?.password?.length > 5
                        ? 'indigo'
                        : 'rgba(153, 153, 153, 0.05)',
                    borderWidth: 1,
                    borderColor: 'grey',
                  }}
                  onPress={onSubmitInputs}>
                  Sign in
                </Button>
                <HStack mt="6" justifyContent="center">
                  <Text
                    fontSize="lg"
                    color="coolGray.600"
                    _dark={{
                      color: 'warmGray.200',
                    }}>
                    I'm a new user.
                  </Text>
                  <Link
                    _text={{
                      color: 'indigo.500',
                      fontWeight: 'medium',
                      fontSize: 'lg',
                      marginLeft: '1',
                    }}
                    onPress={() => {
                      setError({});
                      tempNavigation.navigate('register');
                    }}>
                    Sign Up
                  </Link>
                </HStack>
              </VStack>
            </Box>
          </Center>
        </View>
      </ScrollView>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({});
