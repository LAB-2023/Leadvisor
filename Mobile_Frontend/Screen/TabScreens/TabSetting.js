import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Switch,
  Image,
  ToastAndroid,
  BackHandler,
} from 'react-native';
//import messaging from '@react-native-firebase/messaging';

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const {height: SCREEN_HEIGHT} = Dimensions.get('window');
const signature_green = '#02343F';
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';

export default function TabSetting({navigation}) {
  const [info, setInfo] = useState([]);
  const [custLoginID, setCustLoginID] = useState('-');
  const [regID, setRegID] = useState('-');
  //알림 toggle
  const [isEnabled, setIsEnabled] = useState(Boolean);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  // useEffect(() => {
  //   AsyncStorage.getItem('Table', (err, result) => {
  //     const UserInfo = JSON.parse(result);
  //     setCustLoginID(UserInfo.CUST_LOGIN_ID);
  //     setRegID(UserInfo.UPD_ID);
  //   });
  // }, []);

  // useEffect(() => {
  //   AsyncStorage.getItem('NotificationToggle', (err, result) => {
  //     if (result == 'true') setIsEnabled(true);
  //     else setIsEnabled(false);
  //   });
  // }, []);

  // useEffect(() => {
  //   if (!isEnabled) {
  //     AsyncStorage.setItem('NotificationToggle', 'false');
  //     turnOffNotification();
  //   } else {
  //     AsyncStorage.setItem('NotificationToggle', 'true');
  //     turnOnNotification();
  //   }
  // }, [isEnabled]);
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
  // const turnOffNotification = () => {
  //   AsyncStorage.getItem('Table', (err, result) => {
  //     if (result !== '') {
  //       const UserInfo = JSON.parse(result);
  //       const topic = UserInfo.BIZ_ID;
  //       return messaging()
  //         .unsubscribeFromTopic(topic)
  //         .then(() => {
  //           console.log('Topic unsubscribed: ' + topic);
  //         })
  //         .catch(() => {
  //           console.log('Topic did not unsubscribed.');
  //         });
  //     }
  //   });
  // };
  // const turnOnNotification = () => {
  //   AsyncStorage.getItem('Table', (err, result) => {
  //     if (result !== '') {
  //       const UserInfo = JSON.parse(result);
  //       const topic = UserInfo.BIZ_ID;

  //       return messaging()
  //         .subscribeToTopic(topic)
  //         .then(() => {
  //           console.log('Topic subscribed: ' + topic);
  //         })
  //         .catch(() => {
  //           console.log('Topic did not subscribed.');
  //         });
  //     }
  //   });
  // };
  const handleSubmitPress = async () => {
    // await turnOffNotification();
    AsyncStorage.clear();
    navigation.replace('Auth');
  };

  // AsyncStorage.setItem('user_id', null);
  // AsyncStorage.getItem('user_id', (err, result) => {
  //   Alert.alert(result); // User1 출력
  // });
  // navigation.replace('SplashScreen');

  return (
    <ScrollView style={{backgroundColor: 'white'}}>
      <View style={styles.userInfo}>
        <Text style={styles.textID}>{custLoginID}</Text>
        <Text style={styles.textType}>{regID}</Text>
      </View>
      <View style={styles.label} onPress={() => navigation.navigate('MyInfo')}>
        <Text style={styles.label_font}>알림 설정</Text>
        <View>
          <Switch
            trackColor={{false: '#767577', true: '#862C4E'}}
            thumbColor={isEnabled ? 'white' : '#f4f3f4'}
            onValueChange={toggleSwitch}
            value={isEnabled}
            style={[{marginRight: '20%'}, {marginTop: '13%'}]}
          />
        </View>
      </View>

      <View style={styles.margin}></View>

      <TouchableOpacity
        style={[styles.label, {borderBottomWidth: 2}, {borderColor: '#F6F6F6'}]}
        onPress={() => navigation.navigate('VersionInfo')}>
        <Text style={styles.label_font}>버전 정보</Text>
        <Image
          style={{margin: '5%'}}
          source={require('../../Image/arrow.png')}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.label, {borderBottomWidth: 2}, {borderColor: '#F6F6F6'}]}
        onPress={() => navigation.navigate('TermsOfUse')}>
        <Text style={styles.label_font}>이용 약관</Text>
        <Image
          style={{margin: '5%'}}
          source={require('../../Image/arrow.png')}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.label, {marginTop: '0.3%'}, {marginBottom: '10%'}]}
        onPress={handleSubmitPress}>
        <Text style={styles.label_font}>로그아웃</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  userInfo: {
    backgroundColor: 'white',
    marginBottom: 20,
    borderRadius: 20,
    width: SCREEN_WIDTH * 0.8,
    height: SCREEN_HEIGHT * 0.1,
    marginLeft: '10%',
    marginTop: '3%',
    elevation: 10,
    //height: '15%',
  },
  textID: {
    marginLeft: '5%',
    marginTop: '3%',
    fontWeight: '700',
    color: 'black',
    fontSize: RFPercentage(2.6),
    fontFamily: 'NotoSansKR-Regular',
  },
  textType: {
    marginTop: '2%',
    marginLeft: '5%',
    fontFamily: 'NotoSansKR-Regular',
  },
  header: {
    width: SCREEN_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  header_font: {
    color: signature_green,
    fontWeight: '700',
    margin: '5%',
  },
  margin: {
    width: SCREEN_WIDTH,
    height: '5%',
    backgroundColor: '#F2F2F2',
  },
  label: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    width: SCREEN_WIDTH,
  },
  label_font: {
    fontFamily: 'NotoSansKR-Regular',
    color: 'black',
    margin: '5%',
    textAlignVertical: 'center',
  },
  arrow: {
    color: 'black',
    marginRight: '5%',
    marginTop: '60%',
  },
  bottom: {
    backgroundColor: 'white',
    width: SCREEN_WIDTH,
    height: '30%',
  },
  line: {
    borderBottomColor: '#E5E6E8',
    borderBottomWidth: 1,
    marginBottom: '3%',
    marginTop: '-2%',
  },
});
