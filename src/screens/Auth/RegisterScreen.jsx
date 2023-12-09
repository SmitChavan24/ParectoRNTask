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
import React from 'react';
import DeviceInfo from 'react-native-device-info';

const RegisterScreen = () => {
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
            <Box safeArea p="2" w="90%" maxW="290" py="40">
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
                <FormControl>
                  <FormControl.Label>Email</FormControl.Label>
                  <Input />
                </FormControl>
                <FormControl>
                  <FormControl.Label>Password</FormControl.Label>
                  <Input type="password" />
                </FormControl>
                <FormControl>
                  <FormControl.Label>Confirm Password</FormControl.Label>
                  <Input type="password" />
                </FormControl>
                <Button mt="2" colorScheme="indigo" onPress={()=>tempNavigation.navigate('login')}>
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
