//하단 테이블 설정 버튼 클릭시

import React, {useState, useEffect} from 'react';

import {
  make_maze,
  Gpath,
  dispath,
  test,
  as
} from './InDoorNavigation2';


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


// const path_maze2 = Gpath;
const items =['item1', 'item2', 'item3'];
// console.log(dispath[0].message);
// console.log(dispath[1].message);
// console.log(dispath[2].message);
// console.log(dispath[3].message);

//import messaging from '@react-native-firebase/messaging';


const {width: SCREEN_WIDTH} = Dimensions.get('window');
const {height: SCREEN_HEIGHT} = Dimensions.get('window');
const signature_green = '#02343F';
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';



export default function TabSetting({navigation}) {

  // const {dis} = as;

  console.log("sdfsdffffffffffff                    " , dispath);

  const [info, setInfo] = useState([]);
  const [custLoginID, setCustLoginID] = useState('-');
  const [regID, setRegID] = useState('-');
  //알림 toggle
  const [isEnabled, setIsEnabled] = useState(Boolean);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
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

  // const handleSubmitPress = async () => {
  //   // await turnOffNotification();
  //   AsyncStorage.clear();
  //   navigation.replace('Auth');
  // };

  return (
    <ScrollView style={{backgroundColor: 'black'}}>
      <View style = {styles.userInfo2}>
        {dispath.map((dispath,index) => (
          <View key ={dispath.length}>
            <Text>{dispath.message}</Text>
            </View>
        ))}
      </View>

      <View style={styles.label} onPress={() => navigation.navigate('MyInfo')}>
        <Text style={styles.label_font}></Text>
        <View>
          <Switch
            trackColor={{false: '#767577', true: '#0eb5e9'}}
            thumbColor={isEnabled ? 'white' : '#f4f3f4'}
            onValueChange={toggleSwitch}
            value={isEnabled}
            style={[{marginRight: '20%'}, {marginTop: '13%'}]}
          />
        </View>
      </View>

      <View style={styles.margin}></View>

    
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
  userInfo2: {
    backgroundColor: 'white',
    marginBottom: 20,
    width: SCREEN_WIDTH * 0.8,
    height: SCREEN_HEIGHT * 0.3,
    marginLeft: '10%',
    marginTop: '3%',
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
