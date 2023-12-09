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
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import DeviceInfo from 'react-native-device-info';

const LoginScreen = () => {
    const tempNavigation = useNavigation();

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
                <FormControl>
                  <FormControl.Label>Email ID</FormControl.Label>
                  <Input />
                </FormControl>
                <FormControl>
                  <FormControl.Label>Password</FormControl.Label>
                  <Input type="password" />
                </FormControl>
                <Button mt="2" colorScheme="indigo" onPress={()=>tempNavigation.navigate('form')}>
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
                    onPress={()=>tempNavigation.navigate('register')}>
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
