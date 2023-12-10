import {StyleSheet, View, StatusBar, ScrollView, Platform} from 'react-native';
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
} from 'native-base';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({route}) => {
  const tempNavigation = useNavigation();
  const [login, setlogin] = useState({
    email: '',
    password: '',
  });
  const [errorfield, setError] = useState({
    email: false,
    password: false,
  });
  const {email} = route.params;

  useEffect(() => {
    existUser(email);
  }, [email]);

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
    if (!regex) {
      setError({email: true});
    } else {
      let asyncresult = await AsyncStorage.getItem(login.email);
      if (!asyncresult || login.password.trim().length < 6) {
        setError({password: true});
      } else {
        asyncresult = JSON.parse(asyncresult);
        if (asyncresult.password === login.password) {
          tempNavigation.navigate('form');
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
            <Box safeArea p="1" py="40" w="90%" maxW="290">
              <Heading
                size="lg"
                fontWeight="600"
                color="coolGray.800"
                _dark={{
                  color: 'warmGray.50',
                }}>
                Welcome to Peracto Infotech
              </Heading>
              <Heading
                mt="1"
                _dark={{
                  color: 'warmGray.200',
                }}
                color="coolGray.600"
                fontWeight="medium"
                size="xs">
                Sign in to continue!
              </Heading>

              <VStack space={3} mt="5">
                <FormControl isInvalid={errorfield.email}>
                  <FormControl.Label>Email ID</FormControl.Label>
                  <Input
                    value={login.email}
                    onChangeText={text => onChangeInputs('email', text)}
                  />
                  <FormControl.ErrorMessage
                    _text={{
                      fontSize: 'xs',
                    }}>
                    email is not valid.
                  </FormControl.ErrorMessage>
                </FormControl>
                <FormControl isInvalid={errorfield.password}>
                  <FormControl.Label>Password</FormControl.Label>
                  <Input
                    type="password"
                    value={login.password}
                    onChangeText={text => onChangeInputs('password', text)}
                  />
                  <FormControl.ErrorMessage
                    _text={{
                      fontSize: 'xs',
                    }}>
                    password is not valid.
                  </FormControl.ErrorMessage>
                </FormControl>

                <Button
                  disabled={login.email && login.password ? false : true}
                  mt="2"
                  style={{
                    backgroundColor: login.email && login.password ? "indigo" :'rgba(153, 153, 153, 0.05)',
                    borderWidth: 1,
                    borderColor: 'grey',
                  }}
                  onPress={onSubmitInputs}>
                  Sign in
                </Button>
                <HStack mt="6" justifyContent="center">
                  <Text
                    fontSize="sm"
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
                      fontSize: 'sm',
                    }}
                    onPress={() => tempNavigation.navigate('register')}>
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
