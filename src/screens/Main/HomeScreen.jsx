import {StyleSheet, View, StatusBar, ScrollView, Platform,Dimensions} from 'react-native';
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
import paddingHelper from '../../utils/paddingHelper';
import globalColors from '../../utils/globalColors';

const {width, height} = Dimensions.get('window');

const HomeScreen = () => {
  const tempNavigation = useNavigation();
  return (
    <View style={{flex: 1}}>
    <StatusBar backgroundColor="lightblue" barStyle="dark-content" />
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={[
        {
          paddingTop:paddingHelper()
        },
      ]}>
        <View style={styles.detailsContainer}>
          <View style={styles.detailHeader}>
            <Text>{"TITILE"}</Text>
          </View>
          <View style={styles.table}>
            <View style={styles.flexrow}>
              <Text style={styles.labelText}>{'Aadhar Card Number'}</Text>
              <Text style={styles.valueText}>{'**** **** 4566'}</Text>
            </View>
            <View style={styles.flexrow}>
              <Text style={styles.labelText}>{'PAN Number'}</Text>
              <Text style={styles.valueText}>{'******250P'}</Text>
            </View>
            <View style={styles.flexrow}>
              <Text style={styles.labelText}>{'Date of Birth'}</Text>
              <Text style={styles.valueText}>{'10-12-1994'}</Text>
            </View>
            <View style={styles.flexrow}>
              <Text style={styles.labelText}>{'Email Id'}</Text>
              <Text style={styles.valueText}>{'sanjay.singh@gmail.com'}</Text>
            </View>
            <View style={styles.flexrow}>
              <Text style={styles.labelText}>{'Nominee Details'}</Text>
              <View style={styles.valueText}>
                <View style={styles.flexrow}>
                  <Text style={styles.nominee}>{'Ronak Singh'}</Text>
                  <Text style={styles.relation}>{'(Brother)'}</Text>
                </View>
                <Text style={styles.textphone}>{'7208203606'}</Text>
              </View>
            </View>
            <View style={styles.flexrow}>
              <View style={styles.labelText}>
                <Text style={styles.labelText}>{'Address'}</Text>
                <Text style={styles.asperadhar}>{'(As per Aadhar)'}</Text>
              </View>
              <Text style={styles.valueText}>
                {
                  'Godrej & Boyce, Gate No 2, Plant No. 6, LBS Marg,, Opposite Vikhroli Bus Depot, Vikhroli West, Mumbai, Maharashtra 400079'
                }
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
      <Button onPress={()=>tempNavigation.navigate('login')}>Logout</Button>
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  asperadhar: {
    color: '#755B97',
    fontSize: 8,
    fontFamily: globalColors.fontMedium,
  },
  textphone: {fontSize: 10, color: '#8E8E8E', lineHeight: 13},
  flexrow: {
    flexDirection: 'row',
  },
  super: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: paddingHelper(),
  },
  headerText: {
    fontFamily: globalColors?.fontBold,
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: 0.3,
    marginVertical: '2.8%',
    marginHorizontal: '6%',
    width: '100%',
  },
  bannerContainer: {
    borderRadius: 10,
    width: '88%',
    marginTop: '2%',
    borderColor: '#FFDDC4',
    alignSelf: 'center',
  },
  bannerTitle: {
    fontFamily: globalColors?.fontSemiBold,
    fontSize: 14,
    color: '#0E0E0E',
    lineHeight: 17,
    letterSpacing: 0.3,
  },
  bannerAmt: {
    fontFamily: globalColors?.fontBold,
    fontSize: 10,
    color: 'rgba(14, 14, 14, 0.70)',
    lineHeight: 12,
    letterSpacing: 0.3,
    marginTop: '2%',
  },
  detailsContainer: {
    width: '90%',
    alignSelf: 'center',
    borderRadius: (width * 2.5) / 100,
    borderWidth: 1,
    borderColor: 'black',
    justifyContent: 'center',
    marginTop: '5%',
    padding: 15,
    paddingBottom: (height * 3.5) / 100,
  },
  detailHeader: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    marginBottom: '3%',
  },
  labelText: {
    fontFamily: globalColors.fontMedium,
    fontSize: 12,
    color: '#7A7A7A',
    lineHeight: 24,
    width: '55%',
  },
  valueText: {
    fontFamily: globalColors.fontRegular,
    fontSize: 12,
    lineHeight: 24,
    color: '#0E0E0E',
    marginLeft: '10%',
    width: '70%',
  },
  button: {
    width: '90%',
    height: (height * 6) / 100,
    backgroundColor: '#44226E',
    alignSelf: 'center',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'rgba(228, 228, 228, 0.9)',
    margin: '5%',
  },
  buttontext: {
    fontFamily: globalColors.fontSemiBold,
    fontSize: (width * 4) / 100,
    lineHeight: 20,
    letterSpacing: 0.3,
  },
  infotick: {
    marginLeft: '4%',
    fontFamily: globalColors?.fontMedium,
    fontSize: 12,
    textAlignVertical: 'center',
    letterSpacing: 0.3,
    lineHeight: 18,
    marginBottom: '2%',
  },
  footer: {
    flexDirection: 'row',
    width: '95%',
    alignSelf: 'flex-start',
  },
  footermain: {
    width: (width * 85) / 100,
    alignSelf: 'center',
    marginTop: '5%',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  table: {
    flexDirection: 'column',
    marginRight: '25%',
  },
  image: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: '4%',
  },
  nominee: {
    fontFamily: globalColors.fontRegular,
    fontSize: 12,
    lineHeight: 24,
    color: '#0E0E0E',
  },
  relation: {
    fontFamily: globalColors.fontRegular,
    fontSize: 10,
    lineHeight: 24,
    color: '#8E8E8E',
    marginLeft: '2%',
  },
  plan: {
    fontFamily: globalColors?.fontBold,
    fontSize: 10,
    color: '#44226E',
    top: 2,
    letterSpacing: 0.3,
  },
  plans: {
    fontFamily: globalColors?.fontMedium,
    fontSize: 12,
    color: '#0E0E0E',
    letterSpacing: 0.3,
    marginRight: '2%',
  },
  cover: {
    fontFamily: globalColors?.fontBold,
    fontSize: 10,
    color: '#44226E',
    top: 2,
    letterSpacing: 0.3,
  },
  covers: {
    fontFamily: globalColors?.fontBold,
    fontSize: 10,
    color: '#44226E',
    top: 2,
    letterSpacing: 0.3,
  },
});