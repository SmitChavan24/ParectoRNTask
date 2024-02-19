import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import WebView from 'react-native-webview';
import AnimatedLoader from 'react-native-animated-loader';
import NetInfo from '@react-native-community/netinfo';

const injectedJavaScript = `
var adElements = document.querySelectorAll('.ad-class');
adElements.forEach(function(element) {
  element.style.display = 'none';
});

// Prevent loading of URLs containing 'ad' (example)
window.onload = function() {
  Array.from(document.querySelectorAll('a')).forEach(function(link) {
    if (link.href.includes('ad')) {
      link.href = 'javascript:void(0)';
      link.onclick = function() { return false; };
    }
  });
};
`;
const WebViewScreen = props => {
  const url = props?.route?.params?.url;
  const [isConnected, setIsConnected] = useState(null);

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

  const handleWebViewError = syntheticEvent => {
    const {nativeEvent} = syntheticEvent;
  };
  return (
    <View style={{flex: 1}}>
      <AnimatedLoader
        visible={!isConnected}
        overlayColor="black"
        source={require('../../assets/network.json')}
        animationStyle={styles.lottie}
        speed={0.4}
      />
      <WebView
        source={{uri: url}}
        injectedJavaScript={injectedJavaScript}
        onShouldStartLoadWithRequest={event => {
          return !event.url.includes('ad');
        }}
        onError={handleWebViewError}></WebView>
    </View>
  );
};

export default WebViewScreen;

const styles = StyleSheet.create({
  lottie: {
    width: 200,
    height: 200,
  },
});
