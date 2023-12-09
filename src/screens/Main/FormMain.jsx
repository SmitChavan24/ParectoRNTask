import { StyleSheet, View,StatusBar,ScrollView } from 'react-native'
import React from 'react'
import DeviceInfo from 'react-native-device-info';

const FormMain = () => {
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


      </View>
      </ScrollView>
    </View>
  )
}

export default FormMain

const styles = StyleSheet.create({})