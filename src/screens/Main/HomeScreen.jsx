import {
  FlatList,
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
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import {
  VStack,
  Avatar,
  Center,
  Modal,
  Badge,
  Flex,
  Pressable,
  Spacer,
  useToast,
  HStack,
  Box,
  Spinner,
  Heading,
} from 'native-base';
import AnimatedLoader from 'react-native-animated-loader';
import NetInfo from '@react-native-community/netinfo';

import { useNavigation, useIsFocused } from '@react-navigation/native';


const HomeScreen = props => {
  const [data, setData] = useState([]);
  const [apiError, setApiError] = useState({});

  const [page, setPage] = useState(1);
  const [isConnected, setIsConnected] = useState(null);
  const [loading, SetLoading] = useState(false);
  const flatListRef = useRef(null);
  const tempNavigation = useNavigation();
  const isFocused = useIsFocused();
  const toast = useToast();



  useEffect(() => {
    LogBox.ignoreAllLogs();
    LogBox.ignoreLogs(['EventEmitter.removeListener']);
    LogBox.ignoreLogs(['Require cycle: node_modules/']);
  }, [])

  useEffect(() => {
    fetchUsers(page);
  }, [page]);

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


  const scrollFlatListToStart = () => {
    flatListRef.current.scrollToIndex({ index: 0, animated: true });
  };



  const fetchUsers = async () => {
    try {
      SetLoading(true)
      let response = await axios.get(
        'https://jsonplaceholder.typicode.com/users'
      );
      if (response.data) {
        console.log(response.data)
        setData(prevData => [...prevData, ...response.data])
      }
      SetLoading(false)
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
  const FetchMoreUsers = async () => {
    try {
      let response = await axios.get(
        'https://jsonplaceholder.typicode.com/users'
      );
      if (response) {
        setData([...data, response.data])
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
    if (!loading) {
      setPage(prevPage => prevPage + 1); // Increment page number when the end is reached
    }
    // scrollFlatListToStart()

  };


  const RenderItem = (data, index) => {
    const item = data.item
    return (
      <Box alignItems="center" mb={5}>
        <Pressable onPress={() => tempNavigation.navigate('profile', { data: item })} rounded="8" overflow="hidden" borderWidth="1" borderColor="coolGray.300" w="96" shadow="3" bg="coolGray.100" p="5">
          <Box>
            <HStack alignItems="center">
              <Badge colorScheme="darkBlue" _text={{
                color: "white"
              }} variant="solid" rounded="4">
                {item.id}
              </Badge>
              <Spacer />
              <Text fontSize={10} color="warmGray.800">
                {item.name}
              </Text>
            </HStack>
            <HStack alignItems="center" marginTop={2}>
              <Text color="warmGray.800" mt="5" fontWeight="medium" fontSize="xl" >
                Email Id
              </Text>
              <Spacer />
              <Text color="warmGray.800" mt="5" fontWeight="medium" fontSize="xl" >
                {item.email}
              </Text>
            </HStack>


            <Flex alignSelf={'flex-end'} mt={'2'}>
              <Text mt="2" fontSize={12} fontWeight="medium" color="darkBlue.600">
                Read More
              </Text>
            </Flex>
          </Box>
        </Pressable>
      </Box>

    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <Heading color="primary.500" fontSize='3xl' m={5} mb={0}>
        Users List
      </Heading>
      {data ? <FlatList
        ref={flatListRef}
        data={data}
        keyExtractor={(id, index) => index.toString()}
        renderItem={RenderItem}
        style={{ margin: '2%', marginBottom: '0%' }}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading ? <Spinner accessibilityLabel="Loading more" size={'lg'} /> : null} // Show spinner while loadin
      /> :
        <Box mt={100}>
          <HStack space={2} justifyContent="center">
            <Spinner accessibilityLabel="Loading posts" size={'lg'} />
            <Heading color="primary.500" fontSize='3xl'>
              Loading
            </Heading>
          </HStack>
        </Box>}
      <AnimatedLoader
        visible={!isConnected}
        overlayColor="transparent"
        source={require('../../assets/somethingStrange.json')}
        animationStyle={styles.lottie}
        speed={0.3}>
        <Text style={{ color: 'black', fontSize: 20, fontWeight: '600' }}>
          Check you Network Connection
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

