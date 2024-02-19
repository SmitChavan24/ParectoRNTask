import {View, StatusBar, ScrollView, Platform, BackHandler} from 'react-native';
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
  AlertDialog,
} from 'native-base';
import React, {useRef, useState, useEffect} from 'react';
import paddingHelper from '../../utils/paddingHelper';
import globalColors from '../../utils/globalColors';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import DeviceInfo from 'react-native-device-info';
import {
  PERMISSIONS,
  RESULTS,
  check,
  openSettings,
  request,
} from 'react-native-permissions';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';
import firestore from '@react-native-firebase/firestore';
import uuid from 'react-native-uuid';

const FormMain = ({route}) => {
  const email = route?.params?.email;
  const [isPopoverOpen, setPopoverOpen] = useState(false);
  const [data, setData] = useState({
    firstname: '',
    lastname: '',
    dob: '',
    phone: '',
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
  const [checkbox, setCheckbox] = useState(false);
  const tempNavigation = useNavigation();
  const isFocused = useIsFocused();
  const [isOpen, setIsOpen] = useState(false);

  const onClose = () => {
    BackHandler.exitApp();
  };

  const cancelRef = useRef(null);

  useEffect(() => {
    requestCameraPermission();
  }, []);

  const backAction = () => {
    if (!isOpen) {
      setIsOpen(!isOpen);
    } else if (isOpen) {
      console.log('hii');
    }
    setTimeout(() => {
      setIsOpen(!isOpen);
    }, 1500);
    return true;
  };
  useEffect(() => {
    if (isFocused) {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );
      return () => backHandler.remove();
    }
  }, [isFocused]);

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

  const clickImage = async e => {
    try {
      const options = {
        mediaType: 'photo',
        maxWidth: 20,
        maxHeight: 50,
        quality: 1,
        includeBase64: true,
      };

      await launchCamera(options, response => {
        console.log(response);
        // if (response.didCancel) {
        //   console.log('User cancelled camera');
        // } else if (response.error) {
        //   console.log('Camera Error: ', response.error);
        // } else {
        //   let imagUri = response.uri || response.assets?.[0]?.uri;
        //   setData({...data,imageuri: imagUri});
        //   // console.log(imageUri);
        // }
      });
    } catch (error) {
      console.log(error, 'error');
    }
  };
  const pickImage = async e => {
    e.preventDefault();
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
        let imagUri = response.uri || response.assets?.[0]?.uri;
        setData({...data, imageuri: imagUri});
      }
    });
  };

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
    if (data?.firstname?.length < 3) {
      setError(prevError => ({...prevError, firstname: true}));
      hasErrors = true;
    }

    // Validate Last Name
    if (data?.lastname?.length < 3) {
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
    if (!data.imageuri) {
      setError(prevError => ({...prevError, imageuri: true}));
      hasErrors = true;
    }

    // Validate Checkbox
    if (!checkbox) {
      setError(prevError => ({...prevError, checker: true}));
      hasErrors = true;
    }

    // If there are errors, do not proceed
    if (hasErrors) {
      return;
    }

    // Continue with the form submission logic
    setPopoverOpen(true);
    // You can save the data, navigate to the next screen, or perform other actions here
  };
  console.log(data);
  const addUser = async () => {
    const userid = uuid.v4();
    let uniqueId = await DeviceInfo.getUniqueId();

    let details = {
      os: Platform.OS,
      brand: Platform.constants.Brand,
      model: Platform.constants.Model,
      version: Platform.constants.Release,
      manufacturer: Platform.constants.Manufacturer,
      uniqueId,
    };
    let insertdata = {
      ...data,
      email: dataemail.current,
      platform: {
        ...details,
      },
    };
    firestore()
      .collection('user')
      .doc(userid)
      .set(insertdata)
      .then(res => {
        console.log('Data successfully written:', res);
      })
      .catch(err => {
        console.log(err);
      });
    tempNavigation.navigate('home');
  };
  const onFormComplete = async () => {
    addUser();

    let newkeyemail = dataemail.current + '.UserData';
    console.log(newkeyemail);
    try {
      let inputDataString = JSON.stringify(data);
      await AsyncStorage.setItem(newkeyemail, inputDataString);
      await AsyncStorage.setItem('session', dataemail.current);
      let asyncresult = await AsyncStorage.getItem(newkeyemail);
      if (asyncresult) {
        setPopoverOpen(false);
        tempNavigation.navigate('home', {email: dataemail.current});
      } else {
        console.log('first toast');
      }
    } catch (error) {}
  };
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
  // onchange fn
  const onChangeInputs = (name, value) => {
    setData(prevData => ({
      ...prevData,
      [name]: value,
    }));
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
                size="xl"
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
                size="md">
                Fill up the form to continue!
              </Heading>
              <VStack space={5} mt="5">
                <FormControl isRequired isInvalid={error.firstname}>
                  <FormControl.Label
                    _text={{
                      bold: true,
                      fontSize: 'md',
                    }}>
                    First Name
                  </FormControl.Label>
                  <Input
                    placeholder=" first name"
                    onChangeText={value => onChangeInputs('firstname', value)}
                    size={'lg'}
                  />
                  <FormControl.HelperText
                    _text={{
                      fontSize: 'xs',
                      fontSize: 'md',
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
                      fontSize: 'md',
                    }}>
                    Last Name
                  </FormControl.Label>
                  <Input
                    placeholder="last name"
                    onChangeText={value => onChangeInputs('lastname', value)}
                    size={'lg'}
                  />
                  <FormControl.HelperText
                    _text={{
                      fontSize: 'xs',
                      fontSize: 'md',
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
                <FormControl isRequired isInvalid={error.phone}>
                  <FormControl.Label
                    _text={{
                      bold: true,
                      fontSize: 'md',
                    }}>
                    Mobile No
                  </FormControl.Label>
                  <Input
                    placeholder="mobile no"
                    onChangeText={value => onChangeInputs('phone', value)}
                    size={'lg'}
                    maxLength={10}
                    keyboardType="numeric"
                  />
                  <FormControl.HelperText
                    _text={{
                      fontSize: 'xs',
                      fontSize: 'md',
                    }}>
                    Mobile should contain atleast 10 number.
                  </FormControl.HelperText>
                  <FormControl.ErrorMessage
                    _text={{
                      fontSize: 'xs',
                    }}>
                    Error Mobile No
                  </FormControl.ErrorMessage>
                </FormControl>
                <FormControl maxW="300" isRequired isInvalid={error.dob}>
                  <FormControl.Label _text={{bold: true, fontSize: 'md'}}>
                    Choose Date of Birth
                  </FormControl.Label>
                  <Input
                    // style={{
                    //   borderWidth: 2,
                    //   borderColor: 'rgba(153, 153, 153, 0.2)',
                    //   borderRadius: 5,
                    //   paddingLeft: 12,
                    // }}
                    value={data.dob}
                    size={'lg'}
                    placeholder={'date'}
                    onPressIn={() => showDatePicker()}></Input>
                  <FormControl.ErrorMessage>
                    Please make a selection!
                  </FormControl.ErrorMessage>
                </FormControl>

                <FormControl isInvalid={error.gender} isRequired>
                  <FormControl.Label _text={{bold: true, fontSize: 'md'}}>
                    Select Gender
                  </FormControl.Label>
                  <Radio.Group
                    name="genderGroup"
                    accessibilityLabel="select gender"
                    // defaultValue='male'
                    // onChange={value => setData({...data, gender: value})}
                    onChange={value => onChangeInputs('gender', value)}>
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
                  <FormControl.Label _text={{bold: true, fontSize: 'md'}}>
                    Choose City
                  </FormControl.Label>
                  <Select
                    minWidth="200"
                    accessibilityLabel="Choose City"
                    placeholder="Choose City"
                    size={'lg'}
                    _selectedItem={{
                      bg: 'teal.600',
                      endIcon: <CheckIcon size={5} />,
                    }}
                    onValueChange={value => onChangeInputs('city', value)}
                    mt="1">
                    <Select.Item label="Mumbai" value="mumbai" />
                    <Select.Item label="Jaipur" value="jaipur" />
                    <Select.Item label="Lucknow" value="lucknow" />
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
                  <FormControl.Label _text={{bold: true, fontSize: 'md'}}>
                    Select your profile image
                  </FormControl.Label>
                  {/* <View style={{flexDirection: 'row'}}> */}
                  <Pressable
                    onPress={pickImage}
                    rounded="8"
                    overflow="hidden"
                    borderWidth="1"
                    borderColor="coolGray.300"
                    maxW="40%"
                    shadow="3"
                    bg="coolGray.100"
                    p="1"
                    m={'3'}>
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
                  {/* <Pressable
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
                  </Pressable> */}
                  {/* </View> */}
                  <FormControl.HelperText
                    _text={{
                      fontSize: 'xs',
                    }}>
                    {'Image Uri :-'}
                    {data.imageuri}
                  </FormControl.HelperText>
                  <FormControl.ErrorMessage>
                    Please make a selection!
                  </FormControl.ErrorMessage>
                </FormControl>
              </VStack>
            </Box>
          </Center>
        </View>
      </ScrollView>
      <FormControl maxW="500" isRequired isInvalid={error.checker}>
        {/* <FormControl.ErrorMessage marginLeft="20%">Please agree!</FormControl.ErrorMessage>
         */}
        <Checkbox
          isChecked={checkbox}
          colorScheme="green"
          marginX={8}
          marginY={2}
          borderWidth={2}
          onPress={her => setCheckbox(!checkbox)}>
          <Heading
            mt="1"
            _dark={{
              color: 'warmGray.200',
            }}
            color="coolGray.600"
            fontWeight="medium"
            size="xs"
            m={'1'}>
            I agree that mentioned details are correct as per my knowledge
          </Heading>
        </Checkbox>
      </FormControl>
      <DateTimePickerModal
        isVisible={data.datePicker}
        mode="date"
        maximumDate={new Date()}
        minimumDate={new Date(1700, 0, 1)}
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
      <Popover
        isOpen={isPopoverOpen}
        trigger={triggerProps => {
          return (
            <Button
              {...triggerProps}
              colorScheme="indigo"
              mt="1"
              size={'lg'}
              margin={7}
              onPress={onSubmitForm}>
              Submit
            </Button>
          );
        }}>
        <Popover.Content accessibilityLabel="Delete Customerd" w="56">
          <Popover.CloseButton onPress={() => setPopoverOpen(false)} />
          <Popover.Header>Confirmation Box</Popover.Header>
          <Popover.Body _text={{fontSize: 'md'}}>
            Confirm it! ,Do you really want to submit these detail.
          </Popover.Body>
          <Popover.Footer justifyContent="flex-end">
            <Button.Group space={2}>
              <Button
                colorScheme="success"
                width={'48'}
                size={'lg'}
                onPress={onFormComplete}>
                Confirm Submit
              </Button>
            </Button.Group>
          </Popover.Footer>
        </Popover.Content>
      </Popover>
      <AlertDialog
        leastDestructiveRef={cancelRef}
        isOpen={isOpen}
        onClose={onClose}>
        <AlertDialog.Content>
          {/* <AlertDialog.CloseButton /> */}
          <AlertDialog.Header>Exit Application ?</AlertDialog.Header>
          <AlertDialog.Body>
            You have to Fill the Form to Continue.
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <Button.Group space={1}>
              <Button
                variant="unstyled"
                colorScheme="coolGray"
                onPress={() => setIsOpen(false)}
                ref={cancelRef}>
                Continue
              </Button>
              <Button colorScheme="danger" onPress={onClose}>
                Exit App
              </Button>
            </Button.Group>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    </View>
  );
};

export default FormMain;
