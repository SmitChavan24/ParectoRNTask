import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  Image,
  Linking,
  Modal,
  View,
  Button,
  BackHandler,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import axios from 'axios';
import {CloseIcon, Avatar} from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import firestore from '@react-native-firebase/firestore';
import uuid from 'react-native-uuid';

const HomeScreen = props => {
  const [News, setNews] = useState([]);
  const [apiError, setApiError] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [bools, setbools] = useState({
    fetchMore: false,
    headlines: false,
    showheadlines: true,
  });
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState([]);
  const [moreNews, setMoreNews] = useState([]);
  const [isConnected, setIsConnected] = useState(null);
  const flatListRef = useRef(null);

  const fallbackImage =
    'https://st2.depositphotos.com/2059749/8311/i/950/depositphotos_83118644-stock-photo-3d-paper-plane-out-of.jpg';

  useEffect(() => {
    // fetchNews();
    fetchProfile();
  }, []);

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

  // const fetchAllUsers = async () => {
  //   try {
  //     const querySnapshot = await firestore().collection('user').get();
  //     const users = [];
  //     querySnapshot.forEach(doc => {
  //       users.push({id: doc.id, ...doc.data()});
  //     });
  //     console.log(users);
  //   } catch (error) {
  //     console.log('Error getting users:', error);
  //     return [];
  //   }
  // };

  const fetchProfile = async () => {
    let newkeyemail = await AsyncStorage.getItem('session');
    if (newkeyemail) {
      newkeyemail = newkeyemail + '.UserData';
      let asyncresult = await AsyncStorage.getItem(newkeyemail);
      asyncresult = JSON.parse(asyncresult);
      let wholeData = {...asyncresult, email: newkeyemail};
      setProfileData(wholeData);
    }
  };

  const scrollFlatListToStart = () => {
    flatListRef.current.scrollToIndex({index: 0, animated: true});
  };
  const openURL = async url => {
    props.navigation.navigate('webview', {url});
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
        // console.log(response.data.totalResults);
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
    console.log('ireached');
    if (!bools.headlines) {
      setbools(prevState => ({
        ...prevState,
        fetchMore: true,
      }));
    }
  };

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
          // alignItems: 'center',
          // justifyContent: 'center',
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            margin: '5%',
            marginBottom: '2%',
          }}>
          <Pressable
            style={{marginHorizontal: '3%'}}
            onPress={() => setModalVisible(true)}>
            <Avatar
              bg="amber.500"
              source={{
                uri: profileData?.imageuri,
              }}
              size="md">
              NB
              <Avatar.Badge bg={isConnected ? 'green.500' : 'blueGray.800'} />
            </Avatar>
          </Pressable>
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
          // onPress={FetchMoreNews}
        >
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
      <Button
        title="press"
        onPress={() => props.navigation.navigate('login')}></Button>
      <Modal visible={modalVisible} animationType="none" transparent>
        <Pressable
          style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            position: 'relative',
            zIndex: 999,
          }}
          onPress={() => setModalVisible(!modalVisible)}></Pressable>
        <View
          style={{
            height: '100%',
            width: '66%',
            backgroundColor: 'white',
            borderWidth: 1,
            borderColor: '#f5f5f0',
            borderRadius: 5,
            position: 'absolute',
            zIndex: 999,
          }}></View>
      </Modal>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});

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
