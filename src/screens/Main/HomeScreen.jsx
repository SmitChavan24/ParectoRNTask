import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  Image,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import axios from 'axios';

const HomeScreen = () => {
  const [News, setNews] = useState([]);
  const [apiError, setApiError] = useState(false);
  const fallbackImage =
    'https://st2.depositphotos.com/2059749/8311/i/950/depositphotos_83118644-stock-photo-3d-paper-plane-out-of.jpg';

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      let response = await axios.get(
        'https://newsapi.org/v2/top-headlines?country=in&apiKey=952ae4da52194f58903bf45b00cd2040',
      );
      //   https://newsdata.io/api-key
      if (response?.data?.articles) {
        setNews(response?.data?.articles);
        //   console.log(response.data.articles);
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
        key={index}>
        <Image
          //   source={{
          //     uri: item?.item?.urlToImage || fallbackImage,
          //   }}
          src={item?.item?.urlToImage || fallbackImage}
          style={{
            width: '95%',
            height: 300,
            marginVertical: '1%',
            borderRadius: 3,
            borderWidth: 1.5,
            borderColor: '#d6d6c2',
          }}
          //   defaultSource={{uri: fallbackImage}}
          loadingIndicatorSource={{uri: item?.item?.urlToImage}}

          //   onError={e => {
          //     e.currentTarget.src = fallbackImage;
          //   }}
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
        <Text style={{color: 'black'}}>{console.log(item.item)}</Text>
      </Pressable>
    );
  };
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <View
        style={{
          width: '100%',
          backgroundColor: 'white',
          height: '7%',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text style={{fontSize: 32, fontWeight: 'bold', color: 'black'}}>
          Zatpat News
        </Text>
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
        data={News}
        keyExtractor={(id, index) => index.toString()}
        renderItem={RenderItem}
        style={{flex: 1, margin: '2%'}}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
