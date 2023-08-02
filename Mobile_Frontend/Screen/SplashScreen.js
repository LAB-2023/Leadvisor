// Example of Splash, Login and Sign Up in React Native
// https://aboutreact.com/react-native-login-and-signup/

// Import React and Component
import React, {useState, useEffect} from 'react';
import {ActivityIndicator, View, StyleSheet, Image, Text} from 'react-native';
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';
import AsyncStorage from '@react-native-community/async-storage';
import {Alert} from 'react-native';
import axios from 'axios';
import ServerIp from '../src/user';
// import messaging from '@react-native-firebase/messaging';

const SplashScreen = ({navigation}) => {
  //State for ActivityIndicator animation
  const [animating, setAnimating] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setAnimating(false);
      //Check if user_id is set or not
      //If not then send for Authentication
      //else send to Home Screen
      AsyncStorage.getItem('autoLoginStatus', () => {})
        .then(function (value) {
          if (value == 'true') {
            AsyncStorage.getItem('refreshtoken', () => {})
              .then(function (refreshtoken) {
                console.log(value);
                console.log(refreshtoken);
                if (refreshtoken != null) {
                  AsyncStorage.getItem('Table', () => {})
                    .then(function (TABLE) {
                      const UserInfo = JSON.parse(TABLE);
                      console.log(value);
                      console.log(refreshtoken);
                      console.log('CUST_LOGIN_ID: ' + UserInfo.CUST_LOGIN_ID);
                      if (UserInfo.CUST_LOGIN_ID != null) {
                        console.log('test');
                        axios
                          .get(ServerIp + 'api/user/login/checktoken', {
                            params: {
                              CUST_LOGIN_ID: UserInfo.CUST_LOGIN_ID,
                              refreshtoken: refreshtoken,
                            },
                          })
                          .then(function (response) {
                            console.log(response.data.token);
                            console.log(response.data.refreshtoken);
                            console.log(AsyncStorage.getItem('accesstoken'));
                            console.log(AsyncStorage.getItem('refreshtoken'));
                            if (response.data.status == 'success') {
                              AsyncStorage.setItem(
                                'accesstoken',
                                response.data.token,
                                () => {
                                  console.log('accesstoken 저장 완료');
                                },
                              );
                              AsyncStorage.setItem(
                                'refreshtoken',
                                response.data.refreshtoken,
                                () => {
                                  console.log('refreshtoken 저장 완료');
                                },
                              );
                              navigation.replace('TabNavigationRoutes');
                            } else {
                              navigation.replace('Auth');
                            }
                          })
                          .catch(error => {
                            console.error('error', error);
                          });
                      } else {
                        navigation.replace('Auth');
                      }
                    })
                    .catch(error => {
                      console.error(error);
                    });
                } else {
                  navigation.replace('Auth');
                }
              })
              .catch(error => {
                //Hide Loader
                console.error(error);
              });
          } else {
            AsyncStorage.getItem('Table', (err, TABLE) => {}).then(function (
              TABLE,
            ) {
              if (TABLE !== null) {
                const UserInfo = JSON.parse(TABLE);
                // const topic = UserInfo.BIZ_ID;
                // messaging()
                //   .unsubscribeFromTopic(topic)
                //   .then(() => {
                //     console.log(
                //       'Topic unsubscribed because auto Login false: ' + topic,
                //     );
                //   })
                //   .catch(() => {
                //     console.log('Topic did not unsubscribed.');
                //   });
              }
            });
            navigation.replace('Auth');
          }
        })
        .catch(error => {
          //Hide Loader
          console.error(error);
        });
    }, 3000);
  }, []);

  return (
    <View style={styles.container}>
    <Image
      source={require('../Image/FairCodeLogo.png')}
      style={styles.imageLogo}
    />
  </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  imageLogo: {
    //marginTop: '40%',
    //left: '35%',
    width: '50%',
    height: '25%',
    resizeMode: 'contain',
  },
  imageCompany: {
    marginTop: '60%',
    width: '20%',
    height: '15%',
    //left: '27.5%',
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
