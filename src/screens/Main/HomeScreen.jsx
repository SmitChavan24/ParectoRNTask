import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Button,
  Text,
  Image,
  View,
  BackHandler,
  TextInput,
  TouchableOpacity,
  LogBox,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import axios from 'axios';
import {
  VStack,
  Avatar,
  Center,
  Modal,
  useClipboard,
  useToast,
} from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import firestore from '@react-native-firebase/firestore';
import AnimatedLoader from 'react-native-animated-loader';
import RNFS from 'react-native-fs';
import {launchImageLibrary} from 'react-native-image-picker';
import playstore from '../../assets/playstore.png';
import {useNavigation, useIsFocused} from '@react-navigation/native';

const mapData = [
  {id: 1, name: 'Sports', url: 'https://sports.ndtv.com/'},
  {
    id: 2,
    name: 'Technology',
    url: 'https://indianexpress.com/section/technology/',
  },
  {id: 2, name: 'Bollywood', url: 'https://www.bollywoodlife.com/'},
  {id: 4, name: 'Business', url: 'https://www.business-standard.com/'},
  {
    id: 5,
    name: 'Politics',
    url: 'https://www.livemint.com/politics/news',
  },
];
const Languages = [
  {id: 1, lang: 'English', url: 'https://www.nbcnews.com/us-news'},
  {id: 1, lang: 'Tamil', url: 'https://tamil.oneindia.com/'},
  {id: 1, lang: 'Telugu', url: 'https://www.eenadu.net/'},
  {id: 1, lang: 'Urdu', url: 'https://urdu.news18.com/'},
  {id: 1, lang: 'Marathi', url: 'https://marathi.abplive.com/'},
  {id: 1, lang: 'Gujrati', url: 'https://zeenews.india.com/gujarati/gujarat'},
  {id: 1, lang: 'Kannada', url: 'https://kannada.news18.com/'},
];
const HomeScreen = props => {
  const [News, setNews] = useState([]);
  const [apiError, setApiError] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [imageexists, setImageexists] = useState(false);
  const [bools, setbools] = useState({
    fetchMore: false,
    headlines: false,
    showheadlines: true,
  });
  const [showMore, setshowMore] = useState(false);
  const [profileData, setProfileData] = useState([]);
  const [moreNews, setMoreNews] = useState([]);
  const [isConnected, setIsConnected] = useState(null);
  const [exitApp, SetExitApp] = useState(false);
  const flatListRef = useRef(null);
  const {value, onCopy} = useClipboard();
  const isFocused = useIsFocused();
  const toast = useToast();

  const fallbackImage =
    'https://st2.depositphotos.com/2059749/8311/i/950/depositphotos_83118644-stock-photo-3d-paper-plane-out-of.jpg';

  useEffect(() => {
    fetchNews();
    fetchProfile();
    LogBox.ignoreAllLogs();
    LogBox.ignoreLogs(['EventEmitter.removeListener']);
    LogBox.ignoreLogs(['Require cycle: node_modules/']);
  }, []);
  const onClose = () => {
    BackHandler.exitApp();
  };

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

  const backAction = () => {
    if (exitApp == false) {
      SetExitApp(true);
      toast.show({
        title: 'Please Back Again To Exit',
        variant: 'top-accent',
        placement: 'bottom',
      });
    } else if (exitApp == true) {
      BackHandler.exitApp();
    }

    setTimeout(() => {
      SetExitApp(false);
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
  }, [exitApp, isFocused]);

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
        let newkeyemail = profileData?.email + '.UserData';
        setImage(newkeyemail, imagUri);
      }
    });
  };
  const setImage = async (email, image) => {
    let currentProfileData = {...profileData};
    currentProfileData.imageuri = image;
    let inputDataString = JSON.stringify(currentProfileData);
    await AsyncStorage.setItem(email, inputDataString);
    fetchProfile({fromimage: true});
  };

  const fetchProfile = async condition => {
    let newkeyemail = await AsyncStorage.getItem('session');
    let email = newkeyemail;
    if (newkeyemail) {
      newkeyemail = newkeyemail + '.UserData';
      let asyncresult = await AsyncStorage.getItem(newkeyemail);
      asyncresult = JSON.parse(asyncresult);
      let wholeData = {...asyncresult, email};
      setProfileData(wholeData);
    }
  };

  const scrollFlatListToStart = () => {
    flatListRef.current.scrollToIndex({index: 0, animated: true});
  };
  const openURL = async url => {
    props.navigation.navigate('webview', {url});
  };

  const openModal = () => {
    setModalVisible(!modalVisible);
  };
  const fetchNews = async () => {
    try {
      let response = await axios.get(
        'https://newsapi.org/v2/top-headlines?country=in&apiKey=952ae4da52194f58903bf45b00cd2040',
      );
      //   https://newsdata.io/api-key
      if (response?.data?.articles) {
        setNews(response?.data?.articles);
      }
    } catch (error) {
      console.log(error);
      setApiError({
        error: 'api error',
        message: `${error}`,
        bool: true,
        status_code: 500,
      });
    }
  };
  const FetchMoreNews = async () => {
    let currentDate = new Date();
    let oneDayBefore = new Date(currentDate);
    oneDayBefore.setDate(currentDate.getDate() - 1);

    let formattedOneDayBefore = oneDayBefore.toISOString().split('T')[0];

    try {
      let response = await axios.get(
        `https://newsapi.org/v2/everything?q=india&from=${formattedOneDayBefore}&sortBy=publishedAt&apiKey=952ae4da52194f58903bf45b00cd2040`,
      );
      if (response?.data?.articles) {
        setMoreNews(response?.data?.articles);
        setbools({headlines: true, fetchMore: false, showheadlines: false});
        scrollFlatListToStart();
      }
    } catch (error) {
      console.log(error);
      setApiError({
        error: 'api error',
        message: `${error}`,
        status_code: 500,
      });
    }
  };
  const onEndReached = () => {
    if (!bools.headlines) {
      setbools(prevState => ({
        ...prevState,
        fetchMore: true,
      }));
    }
  };
  const imageSource = profileData?.imageuri
    ? {uri: profileData?.imageuri}
    : playstore;

  const RenderItem = (item, index) => {
    return (
      <Pressable
        style={{
          width: '95%',
          alignSelf: 'center',
          shadowColor: 'black',
          elevation: 2,
          backgroundColor: 'white',
          margin: '2%',
          alignItems: 'center',
          borderRadius: 5,
        }}
        onPress={() => {
          openURL(item?.item?.url);
        }}
        key={index}>
        <Image
          src={item?.item?.urlToImage || fallbackImage}
          style={{
            width: '95%',
            height: 300,
            marginVertical: '1%',
            borderRadius: 3,
            borderWidth: 1.5,
            borderColor: '#d6d6c2',
          }}
          loadingIndicatorSource={{uri: item?.item?.urlToImage}}
        />
        <Text
          style={{
            color: 'black',
            width: '90%',
            fontSize: 17,
            letterSpacing: 0.3,
            fontWeight: '500',
          }}>
          {item?.item?.title}
        </Text>
        <Text
          style={{
            color: 'black',
            width: '90%',
            fontSize: 14,
            letterSpacing: 0.01,
            fontWeight: '300',
            marginBottom: '2%',
          }}>
          {item?.item?.description}
        </Text>
      </Pressable>
    );
  };
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <View
        style={{
          width: '100%',
          backgroundColor: 'white',
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            margin: '5%',
            marginBottom: '2%',
          }}>
          <TouchableOpacity
            style={{
              marginHorizontal: '3%',
            }}
            onPress={openModal}>
            <Avatar bg="amber.500" source={imageSource} size="md">
              NB
              <Avatar.Badge bg={isConnected ? 'green.500' : 'blueGray.800'} />
            </Avatar>
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 32,
              fontWeight: 'bold',
              color: 'black',
              marginLeft: '12%',
            }}>
            Zatpat News
          </Text>
        </View>
      </View>
      <View
        style={{
          backgroundColor: 'red',
          height: '0.7%',
          alignSelf: 'center',
          width: '90%',
          borderRadius: 3,
        }}></View>
      <FlatList
        ref={flatListRef}
        data={bools.showheadlines ? News : moreNews ? moreNews : News}
        keyExtractor={(id, index) => index.toString()}
        renderItem={RenderItem}
        style={{margin: '2%', marginBottom: '0%'}}
        onEndReached={onEndReached}
        onEndReachedThreshold={1}
      />

      {bools.fetchMore && (
        <TouchableOpacity
          style={{
            height: 40,
            backgroundColor: 'transparent',
            width: '20%',
            alignSelf: 'center',
            margin: '1.5%',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 15,
            borderWidth: 1,
            borderColor: 'grey',
          }}
          onPress={FetchMoreNews}>
          <Text style={{color: 'black', fontSize: 12, fontWeight: '500'}}>
            Show More
          </Text>
        </TouchableOpacity>
      )}
      {bools.headlines && (
        <TouchableOpacity
          style={{
            height: 40,
            backgroundColor: 'transparent',
            width: '20%',
            alignSelf: 'center',
            margin: '1.5%',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 15,
            borderWidth: 1,
            borderColor: 'grey',
          }}
          onPress={() => {
            setbools(prevState => ({
              ...prevState,
              fetchMore: false,
              showheadlines: true,
              headlines: false,
            })),
              scrollFlatListToStart();
          }}>
          <Text style={{color: 'black', fontSize: 12, fontWeight: '500'}}>
            Show Headlines
          </Text>
        </TouchableOpacity>
      )}
      {/* <Button
        title="press"
        onPress={() => props.navigation.navigate('login')}></Button> */}
      <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
        <View
          style={{
            height: '100%',
            width: '66%',
            backgroundColor: 'white',
            borderWidth: 1,
            borderColor: '#f5f5f0',
            borderRadius: 5,
            position: 'absolute',
            alignSelf: 'flex-start',
            zIndex: 999,
            justifyContent: 'space-between',
          }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text
              style={{
                alignSelf: 'center',
                marginTop: '25%',
                color: 'grey',
                fontSize: 18,
                fontWeight: '500',
              }}>
              {profileData.email}
            </Text>
            <Pressable
              style={{
                alignSelf: 'center',
                marginBottom: '10%',
                marginTop: '5%',
                backgroundColor: 'white',
              }}
              onPress={pickImage}>
              <Avatar
                bg="amber.500"
                source={imageSource}
                style={{shadowColor: 'black', elevation: 10}}
                size="xl">
                NB
                <Avatar.Badge bg={'blueGray.400'} rounded={'none'} />
              </Avatar>
            </Pressable>
            <VStack space={1} alignItems="center" marginTop={'1'}>
              <Pressable onPress={() => setshowMore(!showMore)}>
                <Center
                  w="56"
                  h="10"
                  bg="indigo.400"
                  rounded="xs"
                  shadow={3}
                  margin={'0.5'}>
                  <Text
                    fontSize="sm"
                    style={{color: 'black', fontSize: 17, fontWeight: '600'}}>
                    Languages
                  </Text>
                </Center>
              </Pressable>
            </VStack>

            {showMore &&
              Languages.map((item, index) => (
                <VStack space={1} alignItems="center" key={index}>
                  <Pressable
                    style={{marginTop: '1.2%'}}
                    onPress={() => openURL(item.url)}>
                    <Center
                      w="48"
                      h="10"
                      bg="indigo.500"
                      rounded="xs"
                      shadow={3}>
                      <Text fontSize="sm" style={{color: 'yellow'}}>
                        {item.lang}
                      </Text>
                    </Center>
                  </Pressable>
                </VStack>
              ))}
            {mapData.map((item, index) => (
              <VStack space={1} alignItems="center" marginTop={'1'} key={index}>
                <Pressable onPress={() => openURL(item.url)}>
                  <Center
                    w="56"
                    h="10"
                    bg="indigo.400"
                    rounded="xs"
                    shadow={3}
                    margin={'0.5'}>
                    <Text
                      fontSize="sm"
                      style={{color: 'black', fontSize: 17, fontWeight: '600'}}>
                      {item.name}
                    </Text>
                  </Center>
                </Pressable>
              </VStack>
            ))}
          </ScrollView>
          <View
            style={{
              width: '100%',
              backgroundColor: 'gray',
              justifyContent: 'center',
              alignItems: 'center',
              paddingBottom: '5%',
            }}>
            <Text style={{color: 'black', fontSize: 32}}>DONATE US</Text>

            <TouchableOpacity onPress={() => onCopy('8104287670@ybl')}>
              <TextInput
                style={{color: 'black', fontSize: 18}}
                value="UPI ID:- 8104287670@ybl"
                editable={false}></TextInput>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onCopy('8104287670')}>
              <Text style={{color: 'black', fontSize: 18}}>
                {'Mobile Number:- 8104287670'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <AnimatedLoader
        visible={apiError?.bool && isConnected}
        overlayColor="transparent"
        source={require('../../assets/somethingStrange.json')}
        animationStyle={styles.lottie}
        speed={0.3}>
        <Text style={{color: 'black', fontSize: 20, fontWeight: '600'}}>
          Terminate App and Open it Again
        </Text>
      </AnimatedLoader>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  lottie: {
    width: 250,
    height: 400,
  },
});

// <Pressable
// style={{
//   width: '100%',
//   height: '100%',
//   backgroundColor: 'rgba(128, 128, 128, 0.5)',
// }}
// // onPress={() => setModalVisible(!modalVisible)}
// >
// <TouchableOpacity
//   style={{alignSelf: 'flex-end', margin: '1%'}}
//   onPress={() => setModalVisible(!modalVisible)}>
//   <CloseIcon size="12" color="black" />
// </TouchableOpacity>
// <ScrollView
//   style={{
//     flex: 1,
//     borderRadius: 5,
//     alignSelf: 'center',
//     width: '90%',
//   }}>
//   <Image
//     //   source={{
//     //     uri: item?.item?.urlToImage || fallbackImage,
//     //   }}
//     src={modalData.urlToImage || fallbackImage}
//     style={{
//       width: '95%',
//       height: 300,
//       marginVertical: '1%',
//       borderRadius: 5,
//       borderWidth: 1.5,
//       borderColor: '#d6d6c2',
//     }}
//     loadingIndicatorSource={{uri: modalData.urlToImage}}
//   />
//   {/* {console.log(item)} */}
//   <Text
//     style={{
//       color: 'black',
//       width: '90%',
//       fontSize: 17,
//       letterSpacing: 0.3,
//       fontWeight: '500',
//     }}>
//     {modalData.title}
//   </Text>
//   <Text
//     style={{
//       color: 'black',
//       width: '90%',
//       fontSize: 14,
//       // letterSpacing: 0.01,
//       fontWeight: '300',
//     }}>
//     {modalData.description}
//   </Text>
//   <Text
//     style={{
//       color: 'black',
//       width: '90%',
//       fontSize: 15,
//       letterSpacing: 0.3,
//       fontWeight: '300',
//       marginTop: '5%',
//     }}>
//     {/* {console.log(modalData.content)} */}
//     {modalData.content}
//   </Text>
//   <TouchableOpacity onPress={() => openURL(modalData.url)}>
//     <Text style={{color: 'blue', textDecorationLine: 'underline'}}>
//       {modalData.url}
//     </Text>
//   </TouchableOpacity>
// </ScrollView>
// </Pressable>
