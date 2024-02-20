import {StyleSheet, View, StatusBar, ScrollView, Platform} from 'react-native';
import {
  Box,
  Heading,
  VStack,
  FormControl,
  Input,
  Button,
  Center,
  NativeBaseProvider,
} from 'native-base';
import {useNavigation} from '@react-navigation/native';
import React, {useState, useRef} from 'react';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';

const RegisterScreen = () => {
  const tempNavigation = useNavigation();

  const [errorfield, setError] = useState({
    email: false,
    email_error_message: '',
    password: false,
    confirmpassword: false,
  });
  const [inputData, setinputData] = useState({
    email: '',
    password: '',
    confirmpassword: '',
  });

  const validateInputs = data => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let regex = emailRegex.test(inputData.email);
    if (!regex) {
      setError({email: true, email_error_message: 'email is not valid.'});
    } else {
      if (inputData.password.trim().length < 6) {
        setError({password: true});
      } else {
        if (inputData.confirmpassword !== inputData.password) {
          setError({confirmpassword: true});
        } else {
          setError({email: false, password: false, confirmpassword: false});
          return 1;
        }
        return 0;
      }
      return 0;
    }
    return 0;
  };

  const onSubmitInputs = async data => {
    let validate = validateInputs(data);
    // console.log(inputData, '<<<=data-error=>>>', errorfield);
    if (validate === 1) {
      try {
        let inputDataString = JSON.stringify(inputData);
        let asyncresult = await AsyncStorage.getItem(inputData.email);
        if (asyncresult) {
          // console.log('first toast', console.log(asyncresult));
          setError({
            email: true,
            email_error_message: 'email already used. Please try another',
          });
        } else {
          setError({
            email: false,
            email_error_message: '',
          });
          await AsyncStorage.setItem(inputData.email, inputDataString);
          tempNavigation.navigate('login', {email: inputData.email});
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  const onChangeInputs = (name, value) => {
    setinputData(prevData => ({
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
            <Box safeArea p="2" w="90%" maxW="350" py="20">
              <Heading
                size="xl"
                color="coolGray.800"
                _dark={{
                  color: 'warmGray.50',
                }}
                fontWeight="semibold">
                Welcome to Zatpat News
              </Heading>
              <Heading
                mt="1"
                color="coolGray.600"
                _dark={{
                  color: 'warmGray.200',
                }}
                fontWeight="medium"
                size="lg">
                Sign up to continue!
              </Heading>

              <VStack space={5} mt="10">
                <FormControl isRequired isInvalid={errorfield.email}>
                  <FormControl.Label _text={{fontSize: 'lg'}}>
                    Email
                  </FormControl.Label>
                  <Input
                    size={'2xl'}
                    onChangeText={text => onChangeInputs('email', text)}
                    value={inputData.email}
                  />
                  <FormControl.HelperText
                    _text={{
                      fontSize: 'md',
                    }}>
                    email should end with @, .com, .net, etc.
                  </FormControl.HelperText>
                  <FormControl.ErrorMessage
                    _text={{
                      fontSize: 'xs',
                    }}>
                    {errorfield.email_error_message}
                  </FormControl.ErrorMessage>
                </FormControl>
                <FormControl isRequired isInvalid={errorfield.password}>
                  <FormControl.Label _text={{fontSize: 'lg'}}>
                    Password
                  </FormControl.Label>
                  <Input
                    size={'2xl'}
                    type="password"
                    onChangeText={text => onChangeInputs('password', text)}
                    value={inputData.password}
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
                    length is smaller than expected.
                  </FormControl.ErrorMessage>
                </FormControl>

                <FormControl isRequired isInvalid={errorfield.confirmpassword}>
                  <FormControl.Label _text={{fontSize: 'lg'}}>
                    Confirm Password
                  </FormControl.Label>
                  <Input
                    size={'2xl'}
                    type="password"
                    onChangeText={text =>
                      onChangeInputs('confirmpassword', text)
                    }
                    value={inputData.confirmpassword}
                  />
                  <FormControl.HelperText
                    _text={{
                      fontSize: 'md',
                    }}>
                    please confirm your password.
                  </FormControl.HelperText>
                  <FormControl.ErrorMessage
                    _text={{
                      fontSize: 'xs',
                    }}>
                    password doesn't match
                  </FormControl.ErrorMessage>
                </FormControl>
                <Button
                  mt="2"
                  colorScheme="indigo"
                  size={'lg'}
                  onPress={onSubmitInputs}>
                  Sign up
                </Button>
              </VStack>
            </Box>
          </Center>
        </View>
      </ScrollView>
    </View>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({});
