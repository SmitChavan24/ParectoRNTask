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

const RegisterScreen = () => {
  const tempNavigation = useNavigation();

  const [errorfield, setError] = useState({
    email: false,
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
      setError({email: true});
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
    console.log(inputData, '<<<=data-error=>>>', errorfield);
    if (validate === 1) {
      try {
        let inputDataString = JSON.stringify(inputData);
        let asyncresult = await AsyncStorage.getItem(inputData.email);
        if (asyncresult) {
          console.log('first toast');
        } else {
          await AsyncStorage.setItem(inputData.email, inputDataString);
          tempNavigation.navigate("login",{ email: inputData.email })
        }
      } catch (error) {}
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
            <Box safeArea p="2" w="90%" maxW="290" py="20">
              <Heading
                size="lg"
                color="coolGray.800"
                _dark={{
                  color: 'warmGray.50',
                }}
                fontWeight="semibold">
                Welcome to Peracto Infotech
              </Heading>
              <Heading
                mt="1"
                color="coolGray.600"
                _dark={{
                  color: 'warmGray.200',
                }}
                fontWeight="medium"
                size="xs">
                Sign up to continue!
              </Heading>

              <VStack space={3} mt="5">
                <FormControl isRequired isInvalid={errorfield.email}>
                  <FormControl.Label>Email</FormControl.Label>
                  <Input
                    onChangeText={text => onChangeInputs('email', text)}
                    value={inputData.email}
                  />
                  <FormControl.HelperText
                    _text={{
                      fontSize: 'xs',
                    }}>
                    email should end with @, .com, .net, etc.
                  </FormControl.HelperText>
                  <FormControl.ErrorMessage
                    _text={{
                      fontSize: 'xs',
                    }}>
                    email is not valid.
                  </FormControl.ErrorMessage>
                </FormControl>
                <FormControl isRequired isInvalid={errorfield.password}>
                  <FormControl.Label>Password</FormControl.Label>
                  <Input
                    type="password"
                    onChangeText={text => onChangeInputs('password', text)}
                    value={inputData.password}
                  />
                  <FormControl.HelperText
                    _text={{
                      fontSize: 'xs',
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
                  <FormControl.Label>Confirm Password</FormControl.Label>
                  <Input
                    type="password"
                    onChangeText={text =>
                      onChangeInputs('confirmpassword', text)
                    }
                    value={inputData.confirmpassword}
                  />
                  <FormControl.HelperText
                    _text={{
                      fontSize: 'xs',
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
                <Button mt="2" colorScheme="indigo" onPress={onSubmitInputs}>
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
