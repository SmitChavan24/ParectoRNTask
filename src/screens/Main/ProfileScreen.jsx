import {
  StyleSheet,
  View,
  StatusBar,
  ScrollView,
  Platform,
  Dimensions,
  BackHandler,
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
  Avatar,
  Container,
  AspectRatio,
  Image,
  Stack,
  Spacer,
} from 'native-base';
import React, { useEffect, useState, useRef } from 'react';
import paddingHelper from '../../utils/paddingHelper';
import globalColors from '../../utils/globalColors';


const { width, height } = Dimensions.get('window');

const ProfileScreen = ({ route }) => {
  const data = route?.params?.data;
  const randomId = Math.floor(Math.random() * 1000);


  return (
    <View style={{ flex: 1 }}>
      <StatusBar backgroundColor="lightblue" barStyle="dark-content" />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[
          {
            paddingTop: paddingHelper(),
          },
        ]}>
        <Box alignItems="center" mt={10}>
          <Box maxW={'full'} rounded="lg" overflow="hidden" mx={5} borderColor="coolGray.200" borderWidth="1" _dark={{
            borderColor: "coolGray.600",
            backgroundColor: "gray.700"
          }} _web={{
            shadow: 2,
            borderWidth: 0
          }} _light={{
            backgroundColor: "gray.50"
          }}>
            <Box>
              <AspectRatio w="100%" ratio={16 / 9}>
                <Image source={{
                  uri: `https://picsum.photos/id/${randomId}/300/200`
                }} alt="image" />
              </AspectRatio>
              <Center bg="violet.500" _dark={{
                bg: "violet.400"
              }} _text={{
                color: "warmGray.50",
                fontWeight: "700",
                fontSize: "xs"
              }} position="absolute" bottom="0" px="3" py="1.5">
                Profile
              </Center>
            </Box>
            <Stack p="4" space={3}>
              <Stack space={2}>
                <Heading size="md" ml="-1">
                  User Details
                </Heading>
                <Text fontSize="xs" _light={{
                  color: "violet.500"
                }} _dark={{
                  color: "violet.400"
                }} fontWeight="500" ml="-0.5" mt="-1">
                  {data.name}
                </Text>
              </Stack>
              <VStack>
                <HStack alignItems="center">
                  <Text color="coolGray.600" _dark={{
                    color: "warmGray.200"
                  }} fontWeight="400">
                    Username
                  </Text>
                  <Spacer />
                  <Text color="coolGray.600" _dark={{
                    color: "warmGray.200"
                  }} fontWeight="400">
                    {data.username}
                  </Text>
                </HStack>
                <HStack alignItems="center">
                  <Text color="coolGray.600" _dark={{
                    color: "warmGray.200"
                  }} fontWeight="400">
                    Email
                  </Text>
                  <Spacer />
                  <Text color="coolGray.600" _dark={{
                    color: "warmGray.200"
                  }} fontWeight="400">
                    {data.email}
                  </Text>
                </HStack>
                <HStack alignItems="center">
                  <Text color="coolGray.600" _dark={{
                    color: "warmGray.200"
                  }} fontWeight="400">
                    Phone
                  </Text>
                  <Spacer />
                  <Text color="coolGray.600" _dark={{
                    color: "warmGray.200"
                  }} fontWeight="400">
                    {data.phone}
                  </Text>
                </HStack>

                <Box maxW='container' rounded="lg" overflow="hidden" p={1} mt={1} borderColor="coolGray.200" borderWidth="1" _dark={{
                  borderColor: "coolGray.600",
                  backgroundColor: "gray.700"
                }} _web={{
                  shadow: 2,
                  borderWidth: 0
                }} _light={{
                  backgroundColor: "gray.50"
                }}>

                  <Heading size='xs' > Address</Heading>
                  <HStack alignItems="center">
                    <Text color="coolGray.600" _dark={{
                      color: "warmGray.200"
                    }} fontWeight="400">
                      Street
                    </Text>
                    <Spacer />
                    <Text color="coolGray.600" _dark={{
                      color: "warmGray.200"
                    }} fontWeight="400">
                      {data.address.street}
                    </Text>
                  </HStack>

                  <HStack alignItems="center">
                    <Text color="coolGray.600" _dark={{
                      color: "warmGray.200"
                    }} fontWeight="400">
                      Suite
                    </Text>
                    <Spacer />
                    <Text color="coolGray.600" _dark={{
                      color: "warmGray.200"
                    }} fontWeight="400">
                      {data.address.suite}
                    </Text>
                  </HStack>
                  <HStack alignItems="center">
                    <Text color="coolGray.600" _dark={{
                      color: "warmGray.200"
                    }} fontWeight="400">
                      City
                    </Text>
                    <Spacer />
                    <Text color="coolGray.600" _dark={{
                      color: "warmGray.200"
                    }} fontWeight="400">
                      {data.address.city}
                    </Text>
                  </HStack>
                  <HStack alignItems="center">
                    <Text color="coolGray.600" _dark={{
                      color: "warmGray.200"
                    }} fontWeight="400">
                      Zipcode
                    </Text>
                    <Spacer />
                    <Text color="coolGray.600" _dark={{
                      color: "warmGray.200"
                    }} fontWeight="400">
                      {data.address.zipcode}
                    </Text>
                  </HStack>
                  <HStack alignItems="center">
                    <Text color="coolGray.600" _dark={{
                      color: "warmGray.200"
                    }} fontWeight="400">
                      Latitude
                    </Text>
                    <Spacer />
                    <Text color="coolGray.600" _dark={{
                      color: "warmGray.200"
                    }} fontWeight="400">
                      {data.address.geo.lat}
                    </Text>
                  </HStack>
                  <HStack alignItems="center">
                    <Text color="coolGray.600" _dark={{
                      color: "warmGray.200"
                    }} fontWeight="400">
                      Longitude
                    </Text>
                    <Spacer />
                    <Text color="coolGray.600" _dark={{
                      color: "warmGray.200"
                    }} fontWeight="400">
                      {data.address.geo.lng}
                    </Text>
                  </HStack>
                </Box>

                <Box maxW='container' rounded="lg" overflow="hidden" p={1} mt={1} borderColor="coolGray.200" borderWidth="1" _dark={{
                  borderColor: "coolGray.600",
                  backgroundColor: "gray.700"
                }} _web={{
                  shadow: 2,
                  borderWidth: 0
                }} _light={{
                  backgroundColor: "gray.50"
                }}>

                  <Heading size='xs' > Company</Heading>
                  <HStack alignItems="center">
                    <Text color="coolGray.600" _dark={{
                      color: "warmGray.200"
                    }} fontWeight="400">
                      Company Name
                    </Text>
                    <Spacer />
                    <Text color="coolGray.600" _dark={{
                      color: "warmGray.200"
                    }} fontWeight="400">
                      {data.company.name}
                    </Text>
                  </HStack>

                  <HStack >
                    <Text color="coolGray.600" _dark={{
                      color: "warmGray.200"
                    }} fontWeight="400">
                      Description
                    </Text>
                    <Spacer />
                    <VStack>
                      <Text color="coolGray.600" _dark={{
                        color: "warmGray.200"
                      }} fontWeight="400">
                        {data.company.catchPhrase}

                      </Text>
                      <Text color="coolGray.600" _dark={{
                        color: "warmGray.200"
                      }} fontWeight="400"
                        alignSelf={'flex-end'}>
                        {data.company.bs}

                      </Text>
                    </VStack>
                  </HStack>
                </Box>
              </VStack>
              <HStack alignItems="center" space={2}>
                <Text color="coolGray.600" _dark={{
                  color: "warmGray.200"
                }} fontWeight="400">
                  Website
                </Text>
                {/* <Spacer /> */}
                <Link color="coolGray.600" _dark={{
                  color: "warmGray.200"
                }} fontWeight="400" >
                  {data.website}
                </Link>

              </HStack>
            </Stack>
          </Box>
        </Box>
      </ScrollView>
    </View >
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  asperadhar: {
    color: '#755B97',
    fontSize: 8,
    fontFamily: globalColors.fontMedium,
  },
  textphone: { fontSize: 10, color: '#8E8E8E', lineHeight: 13 },
  flexrow: {
    flexDirection: 'row',
  },
  super: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: paddingHelper(),
  },
  headerText: {
    fontFamily: globalColors?.fontBold,
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: 0.3,
    marginVertical: '2.8%',
    marginHorizontal: '6%',
    width: '100%',
  },
  bannerContainer: {
    borderRadius: 10,
    width: '88%',
    marginTop: '2%',
    borderColor: '#FFDDC4',
    alignSelf: 'center',
  },
  bannerTitle: {
    fontFamily: globalColors?.fontSemiBold,
    fontSize: 14,
    color: '#0E0E0E',
    lineHeight: 17,
    letterSpacing: 0.3,
  },
  bannerAmt: {
    fontFamily: globalColors?.fontBold,
    fontSize: 10,
    color: 'rgba(14, 14, 14, 0.70)',
    lineHeight: 12,
    letterSpacing: 0.3,
    marginTop: '2%',
  },
  detailsContainer: {
    width: '90%',
    alignSelf: 'center',
    borderRadius: (width * 2.5) / 100,
    borderWidth: 1,
    borderColor: 'black',
    justifyContent: 'center',
    marginTop: '5%',
    padding: 15,
    paddingBottom: (height * 3.5) / 100,
  },
  detailHeader: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    marginBottom: '3%',
  },
  labelText: {
    fontFamily: globalColors.fontMedium,
    fontSize: 12,
    color: '#7A7A7A',
    lineHeight: 24,
    width: '55%',
  },
  valueText: {
    fontFamily: globalColors.fontRegular,
    fontSize: 12,
    lineHeight: 24,
    color: '#0E0E0E',
    marginLeft: '10%',
    width: '70%',
  },
  button: {
    width: '90%',
    height: (height * 6) / 100,
    backgroundColor: '#44226E',
    alignSelf: 'center',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'rgba(228, 228, 228, 0.9)',
    margin: '5%',
  },
  buttontext: {
    fontFamily: globalColors.fontSemiBold,
    fontSize: (width * 4) / 100,
    lineHeight: 20,
    letterSpacing: 0.3,
  },
  infotick: {
    marginLeft: '4%',
    fontFamily: globalColors?.fontMedium,
    fontSize: 12,
    textAlignVertical: 'center',
    letterSpacing: 0.3,
    lineHeight: 18,
    marginBottom: '2%',
  },
  footer: {
    flexDirection: 'row',
    width: '95%',
    alignSelf: 'flex-start',
  },
  footermain: {
    width: (width * 85) / 100,
    alignSelf: 'center',
    marginTop: '5%',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  table: {
    flexDirection: 'column',
    marginRight: '25%',
  },
  image: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: '4%',
  },
  nominee: {
    fontFamily: globalColors.fontRegular,
    fontSize: 12,
    lineHeight: 24,
    color: '#0E0E0E',
  },
  relation: {
    fontFamily: globalColors.fontRegular,
    fontSize: 10,
    lineHeight: 24,
    color: '#8E8E8E',
    marginLeft: '2%',
  },
  plan: {
    fontFamily: globalColors?.fontBold,
    fontSize: 10,
    color: '#44226E',
    top: 2,
    letterSpacing: 0.3,
  },
  plans: {
    fontFamily: globalColors?.fontMedium,
    fontSize: 12,
    color: '#0E0E0E',
    letterSpacing: 0.3,
    marginRight: '2%',
  },
  cover: {
    fontFamily: globalColors?.fontBold,
    fontSize: 10,
    color: '#44226E',
    top: 2,
    letterSpacing: 0.3,
  },
  covers: {
    fontFamily: globalColors?.fontBold,
    fontSize: 10,
    color: '#44226E',
    top: 2,
    letterSpacing: 0.3,
  },
});
