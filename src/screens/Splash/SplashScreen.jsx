import {StyleSheet, Text, View,Platform} from 'react-native';
import React, {useRef, useEffect} from 'react';
import LottieView from 'lottie-react-native';
import {useNavigation} from '@react-navigation/native';
import DeviceInfo from 'react-native-device-info';

const SplashScreen = () => {
    const tempNavigation = useNavigation();
    const lottieRef = useRef();
  useEffect(() => {
    lottieRef.current?.play();
    lottieRef.current?.play(30, 120);
  }, []);
  return (
    <View style={[{flex: 1, alignItems: 'center',backgroundColor:'black'},   {
        paddingTop:
          Platform.OS === 'ios'
            ? DeviceInfo?.hasNotch()
              ? '5%'
              : '2%'
            : '0%',
      },]}>
      <Text style={{fontSize:30,marginTop:'10%',fontWeight:'700',color:'white',textAlign:"center"}}>Parecto InfoTech</Text>
      <LottieView
        style={{height: "100%", width: "100%",backgroundColor:'black'}}
        source={require('../../assets/splash.json')}
        ref={lottieRef}
        autoPlay
        loop={false}
        speed={0.5}
        onAnimationFinish={()=>{
            tempNavigation.navigate("login")
        }}
      />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({});
