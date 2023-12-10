import {
  StyleSheet,
  View,
  StatusBar,
  ScrollView,
  Platform,
  Image,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
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
  Icon,
  Checkbox,
  Radio,
  Stack,
  Select,
  CheckIcon,
} from 'native-base';
import React, {useRef, useState, useEffect} from 'react';
import paddingHelper from '../../utils/paddingHelper';
import globalColors from '../../utils/globalColors';
import {launchImageLibrary,launchCamera} from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {
  PERMISSIONS,
  RESULTS,
  check,
  openSettings,
  request,
} from 'react-native-permissions';

const {width, height} = Dimensions.get('window');
import {useNavigation} from '@react-navigation/native';
const FormMain = () => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [formData, setData] = React.useState({});
  const [groupValue, setGroupValue] = React.useState([
    'male',
    'female',
    'other',
  ]);
  const [customInput, setCustomInput] = useState('');
  const [selectedValue, setSelectedValue] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageData, setImageData] = useState(null);
  const storageKey = '@myApp:imageData';
  const tempNavigation = useNavigation();
  

  const scrollViewRef = useRef(null);


  useEffect(() => {
    // requestCameraPermission();
  }, []);

  const requestCameraPermission = async () => {
    try {
      const permissionStatus = await check(
        Platform.OS === 'ios'
          ? PERMISSIONS.IOS.CAMERA
          : PERMISSIONS.ANDROID.CAMERA
      );
  
      if (permissionStatus === RESULTS.GRANTED) {
        // Camera permission already granted
        // Your code for using the camera goes here
      } else if (permissionStatus === RESULTS.DENIED) {
        // Camera permission has not been granted
        const newStatus = await request(
          Platform.OS === 'ios'
            ? PERMISSIONS.IOS.CAMERA
            : PERMISSIONS.ANDROID.CAMERA
        );
        handlePermissionResponse(newStatus);
      } else {
        // Permission denied or blocked
        handlePermissionResponse(permissionStatus);
      }
    } catch (error) {
      console.error('Error checking/requesting camera permission:', error);
    }
  };
  
  const handlePermissionResponse = (status) => {
    if (status === RESULTS.GRANTED) {
      // Permission granted, you can use the camera now
    } else if (status === RESULTS.DENIED) {
      Alert.alert(
        'Permission Denied',
        'You need to grant camera permission to use this feature.',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Open Settings',
            onPress: () => openSettings(),
          },
        ]
      );
    } else {
      // Permission denied or blocked
      Alert.alert(
        'Permission Blocked',
        'You have blocked camera permission. Please enable it in settings.',
        [
          {
            text: 'OK',
          },
        ]
      );
    }
  };
  

  const clickImage = async() => {
    const options = {
      mediaType: 'photo',
      maxHeight: 2000,
      maxWidth: 2000,
      saveToPhotos: false,
      includeBase64: true,
    };
  
    launchCamera(options, response => {
      if (response.didCancel) {
        console.log('User cancelled camera');
      } else if (response.error) {
        console.log('Camera Error: ', response.error);
      } else {
        let imageUri = response.uri || response.assets?.[0]?.uri;
        setSelectedImage(imageUri);
        console.log(imageUri);
      }
    });

  }
  const pickImage = async() => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('Image picker error: ', response.error);
      } else {
        let imageUri = response.uri || response.assets?.[0]?.uri;
        setSelectedImage(imageUri);
      }
    });
  };

  const saveImageToStorage = async image => {
    try {
      await AsyncStorage.setItem(storageKey, JSON.stringify(image));
    } catch (error) {
      console.error('Error saving image to AsyncStorage:', error);
    }
  };

  const getImageFromStorage = async () => {
    try {
      const storedImage = await AsyncStorage.getItem(storageKey);
      if (storedImage !== null) {
        setImageData(JSON.parse(storedImage));
      }
    } catch (error) {
      console.error('Error getting image from AsyncStorage:', error);
    }
  };

  useEffect(() => {
    getImageFromStorage();
  }, []);

  const handleSelectChange = value => {
    setSelectedValue(value);
  };

  const handleInputChange = text => {
    setSelectedValue(null);
    setCustomInput(text);
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = date => {
    console.warn('A date has been picked: ', date);
    hideDatePicker();
  };

  return (
    <View style={{flex: 1}}>
      <StatusBar backgroundColor="lightblue" barStyle="dark-content" />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[
          {
            flexGrow: 1,
            paddingTop: paddingHelper(),
          },
        ]}>
        <View>
          <Center w="80%">
            <Box safeArea p="1" w="100%" maxW="350" py="10%" marginLeft={5}>
              <Heading
                size="lg"
                color="coolGray.800"
                _dark={{
                  color: 'warmGray.50',
                }}
                fontWeight="semibold">
                Personal Details Form
              </Heading>
              <Heading
                mt="1"
                color="coolGray.600"
                _dark={{
                  color: 'warmGray.200',
                }}
                fontWeight="medium"
                size="xs">
                Fill up to continue!
              </Heading>
              <VStack space={5} mt="5">
                <FormControl isRequired>
                  <FormControl.Label
                    _text={{
                      bold: true,
                    }}>
                    First Name
                  </FormControl.Label>
                  <Input
                    placeholder="John"
                    onChangeText={value => setData({...formData, name: value})}
                  />
                  <FormControl.HelperText
                    _text={{
                      fontSize: 'xs',
                    }}>
                    Name should contain atleast 3 character.
                  </FormControl.HelperText>
                  <FormControl.ErrorMessage
                    _text={{
                      fontSize: 'xs',
                    }}>
                    Error Name
                  </FormControl.ErrorMessage>
                </FormControl>
                <FormControl isRequired>
                  <FormControl.Label
                    _text={{
                      bold: true,
                    }}>
                    Last Name
                  </FormControl.Label>
                  <Input
                    placeholder="John"
                    onChangeText={value => setData({...formData, name: value})}
                  />
                  <FormControl.HelperText
                    _text={{
                      fontSize: 'xs',
                    }}>
                    Name should contain atleast 3 character.
                  </FormControl.HelperText>
                  <FormControl.ErrorMessage
                    _text={{
                      fontSize: 'xs',
                    }}>
                    Error Name
                  </FormControl.ErrorMessage>
                </FormControl>
                {/* <Button title="Show Date Picker" onPress={showDatePicker} /> */}
                {/* 
                <DateTimePickerModal
                  isVisible={isDatePickerVisible}
                  mode="date"
                  onConfirm={handleConfirm}
                  onCancel={hideDatePicker}
                /> */}

                <FormControl isInvalid isRequired>
                  <FormControl.Label
                    _text={{
                      bold: true,
                    }}>
                    Select Gender
                  </FormControl.Label>
                  <Radio.Group
                    name="genderGroup"
                    accessibilityLabel="select gender"
                    defaultValue={groupValue}
                    onChange={value => {
                      setGroupValue(value || '');
                    }}>
                    <Stack
                      direction={{
                        base: 'row',
                        md: 'row',
                      }}
                      alignItems={{
                        base: 'flex-start',
                        md: 'center',
                      }}
                      space={4}
                      w="75%"
                      maxW="300px">
                      <Radio value="male" my="1">
                        Male
                      </Radio>
                      <Radio value="female" my="1">
                        Female
                      </Radio>
                      <Radio value="other" my="1">
                        other
                      </Radio>
                    </Stack>
                  </Radio.Group>
                  <FormControl.ErrorMessage>
                    You must select a gender.
                  </FormControl.ErrorMessage>
                </FormControl>
                {/* <FormControl maxW="300" isRequired isInvalid>
                  <FormControl.Label>Choose City</FormControl.Label>
                  <Select
                    minWidth="200"
                    accessibilityLabel="Choose Service"
                    placeholder="Choose Service"
                    _selectedItem={{
                      bg: 'teal.600',
                      endIcon: <CheckIcon size={5} />,
                    }}
                    mt="1">
                    <Select.Item label="UX Research" value="ux" />
                    <Select.Item label="Web Development" value="web" />
                    <Select.Item
                      label="Cross Platform Development"
                      value="cross"
                    />
                    <Select.Item label="UI Designing" value="ui" />
                    <Select.Item label="Backend Development" value="backend" />
                  </Select>
                  <FormControl.ErrorMessage>
                    Please make a selection!
                  </FormControl.ErrorMessage>
                </FormControl> */}
              </VStack>
            </Box>
          </Center>
        </View>
        <Button title="Pick Image From Gallery" onPress={pickImage} />
        <Button title="Click Image From Camera" onPress={clickImage} />
        <Button
          mt="1"
          margin={10}
          colorScheme="indigo"
          onPress={() => tempNavigation.navigate('home')}>
          Sign up
        </Button>
      </ScrollView>
    </View>
  );
};

export default FormMain;

const styles = StyleSheet.create({
  button: {
    width: '90%',
    height: (height * 6) / 100,
    backgroundColor: '#44226E',
    alignSelf: 'center',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'rgba(228, 228, 228, 0.9)',
    marginBottom: '10%',
    marginTop: '5%',
  },
  buttontext: {
    fontFamily: globalColors.fontSemiBold,
    fontSize: (width * 4) / 100,
    lineHeight: 20,
    letterSpacing: 0.3,
  },
  timeFlex: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  subText: {width: '47%', justifyContent: 'center', alignItems: 'center'},
});
