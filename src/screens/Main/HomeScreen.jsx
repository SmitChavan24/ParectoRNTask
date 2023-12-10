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
import React from 'react'
import {useNavigation} from '@react-navigation/native';
import DeviceInfo from 'react-native-device-info';

const HomeScreen = () => {
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
      <View> </View>
      </ScrollView>
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({})