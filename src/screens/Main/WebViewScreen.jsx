import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import WebView from 'react-native-webview';

const WebViewScreen = props => {
  const url = props?.route?.params?.url;
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
  return (
    <View style={{flex: 1}}>
      <WebView
        source={{uri: url}}
        injectedJavaScript={injectedJavaScript}
        onShouldStartLoadWithRequest={event => {
          return !event.url.includes('ad');
        }}></WebView>
    </View>
  );
};

export default WebViewScreen;

const styles = StyleSheet.create({});
