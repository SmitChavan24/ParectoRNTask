import {
  StyleSheet,
  View,
  StatusBar,
  ScrollView,
  Platform,
  Image,
  ActivityIndicator,
  Dimensions,
  Touchable,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {
  Popover,
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
  Pressable,
  Spacer,
  Flex,
  Badge,
} from 'native-base';
import React, {useRef, useState, useEffect} from 'react';
import paddingHelper from '../../utils/paddingHelper';
import globalColors from '../../utils/globalColors';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {
  PERMISSIONS,
  RESULTS,
  check,
  openSettings,
  request,
} from 'react-native-permissions';

import {useNavigation} from '@react-navigation/native';
const FormMain = ({route}) => {
  const email = route?.params?.email;
  const [isPopoverOpen, setPopoverOpen] = useState(false);
  const [data, setData] = useState({
    firstname: '',
    lastname: '',
    dob: '',
    gender: '',
    city: '',
    imageuri: '',
    checker: false,
    datePicker: false,
  });
  const [error, setError] = useState({
    firstname: false,
    lastname: false,
    dob: false,
    gender: false,
    city: false,
    imageuri: false,
    checker: false,
  });
  const dataemail = useRef(email);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageData, setImageData] = useState(null);
  const storageKey = '@myApp:imageData';
  const tempNavigation = useNavigation();
  
  useEffect(() => {
    requestCameraPermission();
  }, []);

  useEffect(() => {

    // getImageFromStorage();
  }, []);

  const requestCameraPermission = async () => {
    try {
      const permissionStatus = await check(
        // Platform.OS === 'ios'? PERMISSIONS.IOS.CAMERA:
        PERMISSIONS.ANDROID.CAMERA,
      );

      if (permissionStatus === RESULTS.GRANTED) {
        // Camera permission already granted
      } else if (permissionStatus === RESULTS.DENIED) {
        // Camera permission has not been granted
        const newStatus = await request(
          // Platform.OS === 'ios'? PERMISSIONS.IOS.CAMERA :
          PERMISSIONS.ANDROID.CAMERA,
        );
        handlePermissionResponse(newStatus);
      } else {
        handlePermissionResponse(permissionStatus);
      }
    } catch (error) {
      console.error('Error checking/requesting camera permission:', error);
    }
  };

  const handlePermissionResponse = status => {
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
        ],
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
        ],
      );
    }
  };

  const clickImage = async () => {
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
  };
  const pickImage = async () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    launchImageLibrary(options, response => {
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

  // const onSubmitForm = (data) => {
  // }
  const onSubmitForm = () => {
    let hasErrors = false;

    // Resetting errors
    setError({
      firstname: false,
      lastname: false,
      dob: false,
      gender: false,
      city: false,
      imageuri: false,
      checker: false,
    });

    // Validate First Name
    if (!data.firstname && data.firstname.length < 3) {
      setError(prevError => ({...prevError, firstname: true}));
      hasErrors = true;
    }

    // Validate Last Name
    if (!data.lastname && data.lastname.length < 3) {
      setError(prevError => ({...prevError, lastname: true}));
      hasErrors = true;
    }

    // Validate Date of Birth
    if (!data.dob) {
      setError(prevError => ({...prevError, dob: true}));
      hasErrors = true;
    }

    // Validate Gender
    if (!data.gender) {
      setError(prevError => ({...prevError, gender: true}));
      hasErrors = true;
    }

    // Validate City
    if (!data.city) {
      setError(prevError => ({...prevError, city: true}));
      hasErrors = true;
    }

    // Validate Image URI
    // if (!selectedImage) {
    //   setError(prevError => ({...prevError, imageuri: true}));
    //   hasErrors = true;
    // }

    // Validate Checkbox
    if (!data.checker) {
      setError(prevError => ({...prevError, checker: true}));
      hasErrors = true;
    }

    // If there are errors, do not proceed
    if (hasErrors) {
      return;
    }

    // Continue with the form submission logic
    setPopoverOpen(true)
    // You can save the data, navigate to the next screen, or perform other actions here
  };
  const onFormComplete = async() => { 
    
    let newkeyemail = dataemail.current+".UserData"
    console.log(newkeyemail)
    try {
      let inputDataString = JSON.stringify(data);
      await AsyncStorage.setItem(newkeyemail, inputDataString);

      let asyncresult = await AsyncStorage.getItem(newkeyemail);
      if (asyncresult) {
        tempNavigation.navigate("home",{ email: dataemail.current })
      } else {
        console.log('first toast');
      }
    } catch (error) {}
   }

  // date- picker functions
  const showDatePicker = () => {
    setData({...data, datePicker: true});
  };
  const hideDatePicker = () => {
    setData({...data, datePicker: false});
  };
  const handleConfirm = date => {
    let options = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    };
    const formattedDate = date.toLocaleString('en-US', options);

    setData({...data, dob: formattedDate, datePicker: false});
    // hideDatePicker();
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
                Fill up the form to continue!
              </Heading>
              <VStack space={5} mt="5">
                <FormControl isRequired isInvalid={error.firstname}>
                  <FormControl.Label
                    _text={{
                      bold: true,
                    }}>
                    First Name
                  </FormControl.Label>
                  <Input
                    placeholder=" first name"
                    onChangeText={value => setData({...data, firstname: value})}
                  />
                  <FormControl.HelperText
                    _text={{
                      fontSize: 'xs',
                    }}>
                    First Name should contain atleast 3 character.
                  </FormControl.HelperText>
                  <FormControl.ErrorMessage
                    _text={{
                      fontSize: 'xs',
                    }}>
                    Error First Name
                  </FormControl.ErrorMessage>
                </FormControl>
                <FormControl isRequired isInvalid={error.lastname}>
                  <FormControl.Label
                    _text={{
                      bold: true,
                    }}>
                    Last Name
                  </FormControl.Label>
                  <Input
                    placeholder="last name"
                    onChangeText={value => setData({...data, lastname: value})}
                  />
                  <FormControl.HelperText
                    _text={{
                      fontSize: 'xs',
                    }}>
                    Last Name should contain atleast 3 character.
                  </FormControl.HelperText>
                  <FormControl.ErrorMessage
                    _text={{
                      fontSize: 'xs',
                    }}>
                    Error Last Name
                  </FormControl.ErrorMessage>
                </FormControl>
                <FormControl maxW="300" isRequired isInvalid={error.dob}>
                  <FormControl.Label>Choose Date of Birth</FormControl.Label>
                  <TextInput
                    style={{
                      borderWidth: 2,
                      borderColor: 'rgba(153, 153, 153, 0.2)',
                      borderRadius: 5,
                      paddingLeft:12
                    }}
                    placeholder={'date'}
                    onPressIn={() => showDatePicker()}>
                    <Text>{data.dob}</Text>
                  </TextInput>
                  <FormControl.ErrorMessage>
                    Please make a selection!
                  </FormControl.ErrorMessage>
                </FormControl>

                <FormControl isInvalid={error.gender} isRequired>
                  <FormControl.Label
                    _text={{
                      bold: true,
                    }}>
                    Select Gender
                  </FormControl.Label>
                  <Radio.Group
                    name="genderGroup"
                    accessibilityLabel="select gender"
                    // defaultValue='male'
                    // onChange={value => setData({...data, gender: value})}
                    onChange={value =>
                      setData(prevData => ({...prevData, gender: value}))
                    }>
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
                        Other
                      </Radio>
                    </Stack>
                  </Radio.Group>
                  <FormControl.ErrorMessage>
                    You must select a gender.
                  </FormControl.ErrorMessage>
                </FormControl>
                <FormControl maxW="300" isRequired isInvalid={error.city}>
                  <FormControl.Label>Choose City</FormControl.Label>
                  <Select
                    minWidth="200"
                    accessibilityLabel="Choose City"
                    placeholder="Choose City"
                    _selectedItem={{
                      bg: 'teal.600',
                      endIcon: <CheckIcon size={5} />,
                    }}
                    onValueChange={value => setData({...data, city: value})}
                    mt="1">
                    <Select.Item label="Mumbai" value="mumbai" />
                    <Select.Item
                      label="Mumbai Suburban"
                      value="mumbai suburban"
                    />
                    <Select.Item label="Navi Mumbai" value="navi mumbai" />
                    <Select.Item label="Delhi" value="delhi" />
                    <Select.Item label="Bengaluru" value="bengaluru" />
                    <Select.Item label="Hyderabad" value="hyderabad" />
                    <Select.Item label="Ahmedabad" value="ahmedabad" />
                  </Select>
                  <FormControl.ErrorMessage>
                    Please make a selection!
                  </FormControl.ErrorMessage>
                </FormControl>

                <FormControl maxW="300" isRequired isInvalid={error.imageuri}>
                  <FormControl.Label>
                    Select your profile image
                  </FormControl.Label>
                  <View style={{flexDirection: 'row'}}>
                    <Pressable
                      onPress={pickImage}
                      rounded="8"
                      overflow="hidden"
                      borderWidth="1"
                      borderColor="coolGray.300"
                      maxW="40%"
                      shadow="3"
                      bg="coolGray.100"
                      p="1">
                      <Box>
                        <HStack alignItems="center">
                          <Badge
                            colorScheme="darkBlue"
                            _text={{
                              color: 'white',
                            }}
                            variant="solid"
                            rounded="4">
                            Pick Image From Gallery
                          </Badge>
                          <Spacer />
                        </HStack>
                      </Box>
                    </Pressable>
                    <Pressable
                      onPress={clickImage}
                      rounded="8"
                      overflow="hidden"
                      borderWidth="1"
                      borderColor="coolGray.300"
                      maxW="40%"
                      shadow="3"
                      bg="coolGray.100"
                      p="1">
                      <Box>
                        <HStack alignItems="center">
                          <Badge
                            colorScheme="darkBlue"
                            _text={{
                              color: 'white',
                            }}
                            variant="solid"
                            rounded="4">
                            Click Image From Camera
                          </Badge>
                          <Spacer />
                        </HStack>
                      </Box>
                    </Pressable>
                  </View>
                  <FormControl.ErrorMessage>
                    Please make a selection!
                  </FormControl.ErrorMessage>
                </FormControl>
              </VStack>
            </Box>
          </Center>
        </View>
        <DateTimePickerModal
          isVisible={data.datePicker}
          mode="date"
          maximumDate={new Date()}
          minimumDate={new Date(1700, 0, 1)}
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />
      </ScrollView>
      <FormControl maxW="300" isRequired isInvalid={error.checker}>
        {/* <FormControl.ErrorMessage marginLeft="20%">Please agree!</FormControl.ErrorMessage>
         */}
        <Checkbox
          isChecked={data.checker}
          colorScheme="green"
          marginX={8}
          marginY={2}
          borderWidth={2}
          onPress={her => setData({...data, checker: !data.checker})}>
          <Heading
            mt="1"
            _dark={{
              color: 'warmGray.200',
            }}
            color="coolGray.600"
            fontWeight="medium"
            size="xs">
            I agree that mentioned details are correct as per my knowledge
          </Heading>
        </Checkbox>
      </FormControl>
      <Popover
      isOpen={isPopoverOpen}
        trigger={triggerProps => {
          return (
            <Button {...triggerProps} colorScheme="indigo" mt="1" margin={5} onPress={onSubmitForm}>
              Submit
            </Button>
          );
        }}>
        <Popover.Content accessibilityLabel="Delete Customerd" w="56">
          <Popover.CloseButton />
          <Popover.Header>Confirmation Box</Popover.Header>
          <Popover.Body>
            Confirm it!  ,Do you really want to submit these detail.
          </Popover.Body>
          <Popover.Footer justifyContent="flex-end">
            <Button.Group space={2}>
              <Button colorScheme="success" onPress={onFormComplete}>Submit</Button>
            </Button.Group>
          </Popover.Footer>
        </Popover.Content>
      </Popover>
    </View>
  );
};

export default FormMain;
