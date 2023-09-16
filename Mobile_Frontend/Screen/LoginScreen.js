import React, {useState, createRef, useEffect} from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  ScrollView,
  Image,
  Keyboard,
  TouchableOpacity,
  KeyboardAvoidingView,
  Alert,
  StatusBar,
  BackHandler,
  ToastAndroid,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import CryptoJS from 'react-native-crypto-js';
import ServerIp from '../src/user';
import {Checkbox} from 'react-native-paper';

StatusBar.setBackgroundColor('transparent');
StatusBar.setBarStyle('dark-content');

const LoginScreen = ({navigation}) => {
  const [organizationId, setOrganizationId] = useState('sbsystems');
  const [userName, setUserName] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errortext, setErrortext] = useState('');
  const [visible, setvisible] = useState(true);
  const [storeIdChecked, setStoreIdChecked] = useState(false);
  const [Loginchecked, setLoginChecked] = useState(false);
  const ip = ServerIp + 'api/user/login';
  const ip2 = ServerIp + 'api/user/info';
  const passwordInputRef = createRef();
  const usernameInputRef = createRef();

  // AsyncStorage.setItem('id', 'userId0', () => {
  //   //console.log("저장되었습니다!");
  // }); // 저장하는 법

  // // 유저 닉네임 불러오기
  // AsyncStorage.getItem('id', getId => {
  //   //console.log(getId);
  // }); // 이렇게 불러오면 userId0을 불러와서 사용할 수 있습니다.

  const getLoginStatus = async () => {
    const params = [];
    await AsyncStorage.getItem('storeIdStatus', (err, result) => {
      params.push(result);
    });
    if (params[0] == 'true') {
      await AsyncStorage.getItem('Table', (err, result) => {
        const UserInfo = JSON.parse(result);
        params.push(UserInfo.CUST_LOGIN_ID);
      });
      setStoreIdChecked(!storeIdChecked);
      setOrganizationId(params[1]);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getLoginStatus();
    });
    return unsubscribe;
  }, [navigation]);
  const [exitApp, setExitApp] = useState(0);
  const showToast = () => {
    ToastAndroid.show('한 번 더 누르시면 종료됩니다.', ToastAndroid.SHORT);
  };
  useEffect(() => {
    let timeout = setTimeout(() => {
      setExitApp(0);
    }, 2000);
    const backAction = () => {
      if (!navigation.isFocused()) {
        return false;
      }
      if (exitApp === 0) {
        setExitApp(exitApp + 1);
        showToast();
      } else if (exitApp === 1) {
        BackHandler.exitApp();
      }
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => {
      backHandler.remove();
      clearTimeout(timeout);
    };
  });

  //로그인 버튼 눌렀을때 --> 시작장애인용
  const handleSubmitPress = async () => {
   //navigate(true);
    console.log(ip);
    var dataToSend = {
      OrganizationID: 'faircode',
      userName: 'admin',
      userPassword: 'faircode#3', //userPassword
    };

    let secretKey = '1234';
    let encryptInfo = CryptoJS.AES.encrypt(
      JSON.stringify(dataToSend),
      secretKey,
    ).toString();

    axios
      .get(ip, {
        params: {
          encryptInfo: encryptInfo,
        },
      })
      .then(function (response) {
        console.log(response.data.data);
        if (
          response.data.status === 'success' &&
          response.data.refreshtoken != null &&
          response.data.token
        ) {
          putUserInfoToAsync(response.data);
          AsyncStorage.setItem('accesstoken', response.data.token, () => {
            console.log('accesstoken 저장 완료');
          });

          AsyncStorage.setItem(
            'refreshtoken',
            response.data.refreshtoken,
            () => {
              console.log('refreshtoken 저장 완료');
            },
          );

          if (Loginchecked == true) {
            AsyncStorage.setItem('autoLoginStatus', 'true');
          }
          if (storeIdChecked == true) {
            AsyncStorage.setItem('storeIdStatus', 'true');
          }
        }
        //로그인 실패시
        else {
          setErrortext('입력하신 정보를 다시 확인해주세요');
          console.log('Please check your input information');
        }
      })
      .catch(error => {
        console.error('error', error);
      });
  };

  const getUserInformation = async () => {
    const params = [];
    await AsyncStorage.getItem('Table', (err, result) => {
      const UserInfo = JSON.parse(result);
      params.push(UserInfo.BIZ_ID);
      params.push(UserInfo.BIZ_TYPE);
    });
    await AsyncStorage.getItem('accesstoken', (err, result) => {
      params.push(result);
    });

    if (params[0] != '' && params[1] != '' && params[2] != '') {
      console.log(params);
      axios
        .get(ServerIp + 'api/user/select/site', {
          params: {
            BIZ_ID: params[0],
            BIZ_TYPE: params[1],
            token: params[2],
          },
        })
        .then(function (response) {
          console.log(response.data.data);
          AsyncStorage.setItem('SELECTED_BIZ_ID', response.data.data[0].BIZ_ID);
          AsyncStorage.setItem('nameOfSites', response.data.data[0].BIZ_NM);
          if (
            response.data.data[0].LAT == null ||
            response.data.data[0].LNG == null
          ) {
            console.log('This user does not have dest info');
          } else {
            AsyncStorage.setItem(
              'SELECTED_LAT',
              response.data.data[0].LAT.toString(),
            );
            AsyncStorage.setItem(
              'SELECTED_LNG',
              response.data.data[0].LNG.toString(),
            );
          }

          navigate(true);
        })
        .catch(error => {
          console.log(error);
        });
    }
  };

  function putUserInfoToAsync(param) {
    const paramToString = JSON.stringify(param.data).replace(/[\[\]']+/g, '');
    //console.log(paramToString);
    AsyncStorage.setItem('Table', paramToString),
      () => {
        console.log('유저정보 저장 완료');
      };
    AsyncStorage.setItem('NotificationToggle', 'true'),
      () => {
        console.log('알림설정이 TRUE로 설정됨.');
      };

    AsyncStorage.getItem('Table', (err, result) => {
      const UserInfo = JSON.parse(result);
      console.log('BIZ_ID : ' + UserInfo.BIZ_ID);
      console.log('CUST_LOGIN_ID : ' + UserInfo.CUST_LOGIN_ID);
      console.log('UP_BIZ_ID : ' + UserInfo.UP_BIZ_ID);
      console.log('USE_YN : ' + UserInfo.USE_YN);
      console.log('BIZ_TYPE : ' + UserInfo.BIZ_TYPE);
    });

    AsyncStorage.setItem(
      'Select',
      JSON.stringify({key1: '65 ↑', key2: '건강 취약자', key3: '위험 작업자'}),
      () => {
        console.log('홈탭 저장 완료');
      },
    );

    AsyncStorage.getItem('Select', (err, result) => {
      const choice = JSON.parse(result);
      console.log('key1 : ' + choice.key1);
      console.log('key2 : ' + choice.key2);
      console.log('key3 : ' + choice.key3);
    });

    getUserInformation();
  }

  function navigate(param) {
    AsyncStorage.setItem('floor', '6')
    // navigation.replace('TabNavigationRoutes');
    navigation.replace('DrawerNavigationRoutes');
  }

  // 보행약자 클릭
  const handleSubmitPress2 = async () => {
    //navigate(true);
     console.log(ip);
     var dataToSend = {
       OrganizationID: 'faircode',
       userName: 'admin',
       userPassword: 'faircode#3', //userPassword
     };
 
     let secretKey = '1234';
     let encryptInfo = CryptoJS.AES.encrypt(
       JSON.stringify(dataToSend),
       secretKey,
     ).toString();
 
     axios
       .get(ip, {
         params: {
           encryptInfo: encryptInfo,
         },
       })
       .then(function (response) {
         console.log(response.data.data);
         if (
           response.data.status === 'success' &&
           response.data.refreshtoken != null &&
           response.data.token
         ) {
           putUserInfoToAsync2(response.data);
           AsyncStorage.setItem('accesstoken', response.data.token, () => {
             console.log('accesstoken 저장 완료');
           });
 
           AsyncStorage.setItem(
             'refreshtoken',
             response.data.refreshtoken,
             () => {
               console.log('refreshtoken 저장 완료');
             },
           );
 
           if (Loginchecked == true) {
             AsyncStorage.setItem('autoLoginStatus', 'true');
           }
           if (storeIdChecked == true) {
             AsyncStorage.setItem('storeIdStatus', 'true');
           }
         }
         //로그인 실패시
         else {
           setErrortext('입력하신 정보를 다시 확인해주세요');
           console.log('Please check your input information');
         }
       })
       .catch(error => {
         console.error('error', error);
       });
   };
 
   const getUserInformation2 = async () => {
     const params = [];
     await AsyncStorage.getItem('Table', (err, result) => {
       const UserInfo = JSON.parse(result);
       params.push(UserInfo.BIZ_ID);
       params.push(UserInfo.BIZ_TYPE);
     });
     await AsyncStorage.getItem('accesstoken', (err, result) => {
       params.push(result);
     });
 
     if (params[0] != '' && params[1] != '' && params[2] != '') {
       console.log(params);
       axios
         .get(ServerIp + 'api/user/select/site', {
           params: {
             BIZ_ID: params[0],
             BIZ_TYPE: params[1],
             token: params[2],
           },
         })
         .then(function (response) {
           console.log(response.data.data);
           AsyncStorage.setItem('SELECTED_BIZ_ID', response.data.data[0].BIZ_ID);
           AsyncStorage.setItem('nameOfSites', response.data.data[0].BIZ_NM);
           if (
             response.data.data[0].LAT == null ||
             response.data.data[0].LNG == null
           ) {
             console.log('This user does not have dest info');
           } else {
             AsyncStorage.setItem(
               'SELECTED_LAT',
               response.data.data[0].LAT.toString(),
             );
             AsyncStorage.setItem(
               'SELECTED_LNG',
               response.data.data[0].LNG.toString(),
             );
           }
 
           navigate2(true);
         })
         .catch(error => {
           console.log(error);
         });
     }
   };
 
   function putUserInfoToAsync2(param) {
     const paramToString = JSON.stringify(param.data).replace(/[\[\]']+/g, '');
     //console.log(paramToString);
     AsyncStorage.setItem('Table', paramToString),
       () => {
         console.log('유저정보 저장 완료');
       };
     AsyncStorage.setItem('NotificationToggle', 'true'),
       () => {
         console.log('알림설정이 TRUE로 설정됨.');
       };
 
     AsyncStorage.getItem('Table', (err, result) => {
       const UserInfo = JSON.parse(result);
       console.log('BIZ_ID : ' + UserInfo.BIZ_ID);
       console.log('CUST_LOGIN_ID : ' + UserInfo.CUST_LOGIN_ID);
       console.log('UP_BIZ_ID : ' + UserInfo.UP_BIZ_ID);
       console.log('USE_YN : ' + UserInfo.USE_YN);
       console.log('BIZ_TYPE : ' + UserInfo.BIZ_TYPE);
     });
 
     AsyncStorage.setItem(
       'Select',
       JSON.stringify({key1: '65 ↑', key2: '건강 취약자', key3: '위험 작업자'}),
       () => {
         console.log('홈탭 저장 완료');
       },
     );
 
     AsyncStorage.getItem('Select', (err, result) => {
       const choice = JSON.parse(result);
       console.log('key1 : ' + choice.key1);
       console.log('key2 : ' + choice.key2);
       console.log('key3 : ' + choice.key3);
     });
 
     getUserInformation2();
   }
 
   function navigate2(param) {
     AsyncStorage.setItem('floor', '6')
     navigation.replace('TabNavigationRoutes2');
   }



  // const stringToJSON = JSON.parse(paramToString)[0];
  // console.log('Stored in AsyncStorage[BIZ_ID]: ' + JSON.stringify(stringToJSON['BIZ_ID']));
  // AsyncStorage.setItem('BIZ_ID', stringToJSON['BIZ_ID']);

  // console.log('Stored in AsyncStorage[BIZ_NM]: ' + stringToJSON['BIZ_NM']);
  // AsyncStorage.setItem('BIZ_NM', stringToJSON['BIZ_NM']);

  // console.log(
  //   'Stored in AsyncStorage[BIZ_TYPE]: ' + stringToJSON['BIZ_TYPE'],
  // );
  // AsyncStorage.setItem(
  //   'BIZ_TYPE', stringToJSON['BIZ_TYPE']);

  // console.log(
  //   'Stored in AsyncStorage[CUST_LOGIN_ID]: ' +
  //     stringToJSON['CUST_LOGIN_ID'],
  // );
  // AsyncStorage.setItem(
  //   'CUST_LOGIN_ID',(stringToJSON['CUST_LOGIN_ID']));

  // console.log('Stored in AsyncStorage[REG_DT]: ' + stringToJSON['REG_DT']);
  // AsyncStorage.setItem('REG_DT', stringToJSON['REG_DT']);

  // console.log('Stored in AsyncStorage[REG_ID]: ' + stringToJSON['REG_ID']);
  // AsyncStorage.setItem('REG_ID', stringToJSON['REG_ID']);

  // console.log('Stored in AsyncStorage[UPD_DT]: ' + stringToJSON['UPD_DT']);
  // AsyncStorage.setItem('UPD_DT', stringToJSON['UPD_DT']);

  // console.log('Stored in AsyncStorage[UPD_ID]: ' + stringToJSON['UPD_ID']);
  // AsyncStorage.setItem('UPD_ID', stringToJSON['UPD_ID']);

  // if(stringToJSON['UP_BIZ_ID']==null) {
  //   AsyncStorage.setItem(
  //     'UP_BIZ_ID',
  //     AsyncStorage.getItem('BIZ_ID')
  //   );
  //   console.log(
  //     '!!!'
  //   );
  //   console.log(
  //     AsyncStorage.getItem('BIZ_ID')
  //   );
  // }
  // else {
  //   AsyncStorage.setItem(
  //     'UP_BIZ_ID',
  //     stringToJSON['UP_BIZ_ID'],
  //   );
  //   console.log(
  //     AsyncStorage.getItem('UP_BIZ_ID')
  //   );
  // }
  // // console.log(
  // //   'Stored in AsyncStorage[UP_BIZ_ID]: ' + stringToJSON['UP_BIZ_ID'],
  // // );
  // // AsyncStorage.setItem(
  // //   'UP_BIZ_ID',
  // //   stringToJSON['UP_BIZ_ID'],
  // // );

  // console.log('Stored in AsyncStorage[USE_YN]: ' + stringToJSON['USE_YN']);
  // AsyncStorage.setItem('USE_YN', stringToJSON['USE_YN']);
  //   setErrortext('');
  //   if (!organizationId) {
  //     setErrortext('Organization ID를 입력해주세요');
  //     return;
  //   }
  //   if (!userName) {
  //     setErrortext('User Name을 입력해주세요');
  //     return;
  //   }
  //   if (!userPassword) {
  //     setErrortext('Password를 입력해주세요');
  //     return;
  //   }
  //   setLoading(true);

  //   //보내줄 데이터 - 로그인 정보
  //   let dataToSend = {
  //     organizationId: 'faircode',
  //     userName: userName,
  //     userPassword: userPassword,
  //   };
  //   let formBody = [];

  //   // - 수정 필요
  //   for (let key in dataToSend) {
  //     console.log('key: ', key);
  //     let encodedKey = encodeURIComponent(key);
  //     let encodedValue = encodeURIComponent(dataToSend[key]);
  //     formBody.push(encodedKey + '=' + encodedValue);
  //   }
  //   formBody = formBody.join(' && ');
  //   console.log('FORMBODY', formBody);

  //   //axios를 사용해서 아래 서버에서 정보 가져옴
  //   console.log(ip);
  //   axios
  //     .get(ip, {
  //       params: {
  //         organizationId: organizationId,
  //         userName: userName,
  //         userPassword: userPassword,
  //       },
  //     })
  //     .then(function (response) {
  //       console.log(response.data.status);
  //       setLoading(false);

  //       //로그인 성공시 - 수정 필요
  //       if (response.data.status === 'success') {
  //         AsyncStorage.setItem('user_id', response.data.data.userEmail);
  //         if (checked == true)
  //           {
  //           AsyncStorage.setItem('status', "true");}
  //         // console.log(response.data.data.user_id);
  //         navigation.replace('TabNavigationRoutes');
  //       }
  //       //로그인 실패시
  //       else if (response.data.status === 'fail') {
  //         setErrortext('아이디나 비밀번호를 확인해주세요');
  //         console.log('Please check your email id or password');
  //       } else {
  //         setErrortext('아이디나 비밀번호를 확인해주세요');
  //         console.log('Please check your email id or password');
  //       }
  //     })
  //     .catch(error => {
  //       //Hide Loader
  //       setLoading(false);
  //       console.error('error', error);
  //     });
  const handleVisiblePress = () => {
    {
      if (visible == true) {
        setvisible(false);
      } else {
        setvisible(true);
      }
      console.log(visible);
    }
  };
  {
    errortext != '' ? (
      <Text style={styles.errorTextStyle}>{errortext}</Text>
    ) : null;
  }

  return (
    <View style={styles.mainBody}>
      {/* <Loader loading={loading} /> */}
      <ScrollView
        contentContainerStyle={{
          flex: 1,
        }}>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: '-9%',
          }}>
          <Image
            source={require('../Image/yourGuide/LeadvisorLogo.png')}
            style={{width: '60%', height: '55%', marginTop: '13%', resizeMode: 'contain'}}
          />
        </View>

        {/* <View style={styles.IdStyle}>
          <TextInput
            value={organizationId}
            onChangeText={organizationId => setOrganizationId(organizationId)}
            placeholder="Organization ID"
            //dummy@abc.com
            placeholderTextColor="darkgray"
            autoCapitalize="none"
            keyboardType="email-address"
            returnKeyType="next"
            onSubmitEditing={() =>
              usernameInputRef.current && usernameInputRef.current.focus()
            }
            underlineColorAndroid="#f000"
            blurOnSubmit={false}
            style={{color: 'black'}}
          />
        </View> */}

        {/* <View style={styles.usernameStyle}>
          <TextInput
            onChangeText={userName => setUserName(userName)}
            placeholder="Username"
            placeholderTextColor="darkgray"
            autoCapitalize="none"
            returnKeyType="next"
            ref={usernameInputRef}
            onSubmitEditing={() =>
              passwordInputRef.current && passwordInputRef.current.focus()
            }
            underlineColorAndroid="#f000"
            blurOnSubmit={false}
            style={{color: 'black'}}
          />
        </View> */}

        <TouchableOpacity
          style={styles.buttonStyle}
          activeOpacity={0.5}
          onPress={handleSubmitPress}>
          <Text style={styles.buttonTextStyle}>시각장애인</Text>
        </TouchableOpacity>

        {/* <View style={styles.passwordStyle}>
          <View style={{flex: 8}}>
            <TextInput
              onChangeText={userPassword => setUserPassword(userPassword)}
              placeholder="Password"
              placeholderTextColor="darkgray"
              keyboardType="default"
              ref={passwordInputRef}
              onSubmitEditing={handleSubmitPress}
              blurOnSubmit={false}
              secureTextEntry={visible}
              underlineColorAndroid="#f000"
              returnKeyType="done"
              style={{color: 'black'}}
            />
          </View>
          <View style={{flex: 1}}>
            <TouchableOpacity activeOpacity={0.5} onPress={handleVisiblePress}>
              <Image
                source={require('../Image/yourGuide/password_visible.png')}
                style={styles.passwordImgStyle}
              />
            </TouchableOpacity>
          </View>
        </View> */}

        <TouchableOpacity
          style={styles.buttonStyle}
          activeOpacity={0.5}
          onPress={handleSubmitPress2}>
          <Text style={styles.buttonTextStyle}>보행약자</Text>
        </TouchableOpacity>

        {/* {errortext != '' ? (
          <Text style={styles.errorTextStyle}>{errortext}</Text>
        ) : null}

        <View style={{flexDirection: 'row', marginLeft: '5%'}}>
          <View style={{flexDirection: 'row'}}>
            <Checkbox
              style={{alignSelf: 'center'}}
              status={storeIdChecked ? 'checked' : 'unchecked'}
              onPress={() => {
                setStoreIdChecked(!storeIdChecked);
              }}
              color={'#0eb5e9'}
              uncheckColor={'gray'}
            />
            <Text
              style={styles.check}
              onPress={() => {
                setStoreIdChecked(!storeIdChecked);
              }}>
              아이디 저장
            </Text>
          </View>

          <View style={{flexDirection: 'row'}}>
            <Checkbox
              style={{alignSelf: 'center'}}
              status={Loginchecked ? 'checked' : 'unchecked'}
              onPress={() => {
                setLoginChecked(!Loginchecked);
              }}
              color={'#0eb5e9'}
              uncheckColor={'gray'}
            />
            <Text
              style={styles.check}
              onPress={() => {
                setLoginChecked(!Loginchecked);
              }}>
              자동 로그인
            </Text>
            <Text style = {[styles.check, {color: '#0eb5e9', marginLeft:'34%', fontWeight: 'bold'}]} onPress = {()=>{
              navigation.navigate('RegisterScreen')
            }}>
              회원가입
            </Text>
          </View>
        </View> */}

        <TouchableOpacity
          style={styles.buttonStyle}
          activeOpacity={0.5}
          onPress={handleSubmitPress}>
          <Text style={styles.buttonTextStyle}>LOGIN</Text>
        </TouchableOpacity>
        <View style={{marginTop: '25%', alignItems: 'center'}}>
          {/* <Image
            source={require('../Image/FairCodeLogo.png')}
            style={    {
            //left: '35%',
            width: '50%',
            height: '25%',
            resizeMode: 'contain'}}
          /> */}
        </View>
      </ScrollView>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    backgroundColor: 'white',
    alignContent: 'center',
  },
  headerText: {
    color: 'white',
    paddingTop: '10%',
    textAlign: 'center',
    fontSize: RFPercentage(4.0),
    fontFamily: 'NotoSansKR-Regular',
    marginBottom: '4%',
  },
  companyText: {
    color: '#404040',
    textAlign: 'center',
    fontWeight: '700',
    fontFamily: 'NotoSansKR-Regular',
    fontSize: RFPercentage(2.0),
  },
  midText: {
    color: 'white',
    textAlign: 'center',
    fontFamily: 'NotoSansKR-Regular',
    fontSize: RFPercentage(2.0),
  },
  buttonStyle: {
    backgroundColor: '#0eb5e9',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    width: '86%',
    height: '7%',
    marginTop: '5%',
    borderRadius: 20,
  },
  buttonTextStyle: {
    color: 'white',
    fontSize: wp('4%'),
    fontFamily: 'NotoSansKR-Regular',
    fontWeight: '700',
  },
  IdStyle: {
    paddingHorizontal: '2%',
    marginBottom: '2%',
    marginTop: '-17%',
    width: '87%',
    height: '6.5%',
    alignSelf: 'center',
    borderRadius: 20,
    borderColor: '#0eb5e9',
    borderWidth: 1,
    backgroundColor: 'white',
  },
  usernameStyle: {
    width: '87%',
    paddingHorizontal: '2%',
    height: '6.5%',
    marginBottom: '3%',
    marginTop: '-22%',
    alignSelf: 'center',
    borderRadius: 20,
    borderColor: '#0eb5e9',
    borderWidth: 1,
    backgroundColor: 'white',
  },
  passwordStyle: {
    flexDirection: 'row',
    paddingHorizontal: '2%',
    marginBottom: '1%',
    width: '87%',
    height: '6.5%',
    alignSelf: 'center',
    borderRadius: 20,
    borderColor: '#0eb5e9',
    borderWidth: 1,
    backgroundColor: 'white',
  },
  passwordImgStyle: {
    alignSelf: 'flex-end',
    marginTop: '38%',
    marginRight: '10%',
    width: '50%',
    height: '50%',
  },
  check: {
    color: '#333333',
    textAlign: 'center',
    fontSize: RFPercentage(1.8),
    fontFamily: 'NotoSansKR-Regular',
    alignSelf: 'center',
  },
  search: {
    marginRight: '5%',
    color: 'black',
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: RFPercentage(2.0),
    fontFamily: 'NotoSansKR-Regular',
  },
  tailText: {
    marginTop: '10%',
    textAlign: 'center',
    fontSize: RFPercentage(2.0),
    fontFamily: 'NotoSansKR-Regular',
    color: 'white',
  },
  tailCheckText: {
    marginTop: '10%',
    fontSize: RFPercentage(2.0),
    fontFamily: 'NotoSansKR-Regular',
    color: '#A4A4A4',
  },
  errorTextStyle: {
    color: 'red',
    marginLeft: '8%',
    textAlign: 'left',
    fontSize: RFPercentage(1.8),
    fontFamily: 'NotoSansKR-Regular',
  },
});
