import {LogBox} from 'react-native';

if (__DEV__) {
  const ignoreWarns = [
    'EventEmitter.removeListener',
    'Setting a timer for a long period of time',
    'ViewPropTypes will be removed from React Native',
    'AsyncStorage has been extracted from react-native',
    "exported from 'deprecated-react-native-prop-types'.",
    'Non-serializable values were found in the navigation state.',
    'VirtualizedLists should never be nested inside plain ScrollViews',
    'Got a component with the name',
    'Warning: componentWillReceiveProps has been renamed, and is not recommended',
    'Sending `onAnimatedValueUpdate` with no listeners registered.',
    '(ADVICE) View',
    'of type BVLinearGradient has a shadow set but cannot calculate shadow efficiently.',
    '(ADVICE) View #1339 of type BVLinearGradient has a shadow set but cannot calculate shadow efficiently.',
    'In React 18, SSRProvider is not necessary and is a noop. You can remove it from your app.',
    'VirtualizedLists should never be nested',
    // 'Missing "NSCameraUsageDescription" property in "Info.plist'
  ];

  const warn = console.warn;
  console.warn = (...arg) => {
    for (const warning of ignoreWarns) {
      if (arg[0].startsWith(warning)) {
        return;
      }
    }
    warn(...arg);
  };
  LogBox.ignoreLogs(ignoreWarns);
}
