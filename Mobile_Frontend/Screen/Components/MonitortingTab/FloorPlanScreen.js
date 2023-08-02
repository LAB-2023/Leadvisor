import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Switch,
  Alert,
  TextInput,
  Image,
  SafeAreaView,
  BackHandler,
  ToastAndroid,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-community/async-storage';
import {decode as atob, encode as btoa} from 'base-64';
import LoadingScreen from '../LoadingScreen';
import ImageModal from 'react-native-image-modal';
//import base64 from 'react-native-base64'
//window.btoa = require('Base64').btoa;
//import base64 from 'base-64';
//import ImgToBase64 from 'react-native-image-base64';
const {width: SCREEN_WIDTH} = Dimensions.get('window');
const {height: SCREEN_HEIGHT} = Dimensions.get('window');
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';
import {floor} from 'react-native-reanimated';
import {jestResetJsReanimatedModule} from "react-native-reanimated/lib/types/lib";

export default function FloorPlanScreen({navigation}) {
  const screenWidth = Dimensions.get('window').width;

  const [floorPlanName, setFloorPlanName] = useState('');
  const [searchWorker, setSearchWorker] = useState('');
  const onChangeSearch = query => setSearchWorker(query);
  const [URL, setURL] = useState('');
  const [icon, setIcon] = useState(245);

  const [srcString, setSrcString] = useState('white');
  const [finalURL, setFinalURL] = useState('');

  const imagePath = {
    245: require("../../../Image/Floor/245.png"),
    246: require("../../../Image/Floor/246.png"),
    247: require("../../../Image/Floor/247.png"),
  };

  const getFloorPlanInfo = async () => {
    await AsyncStorage.getItem('FLOORPLAN_NAME', (err, result) => {
      setFloorPlanName(result);
      console.log('floorPlanName: ' + floorPlanName);
    });
    await AsyncStorage.getItem('IMG_ID', (err, result) => {
      let url =
          'http://demo.sbplatform.co.kr/admin/setting/map/image/' + result;
      setURL(url);
      setIcon(result);

      // let url =
      //   'http://demo.sbplatform.co.kr/admin/setting/map/image/' + result;
      // console.log('url: ' + url);
      // const oreq = new XMLHttpRequest();
      // oreq.open('GET', url, true);
      // oreq.responseType = 'arraybuffer';
      // let base64String;
      // oreq.onload = function (oEvent) {
      //   const arrayBuffer = oreq.response; // Note: not oReq.responseText
      //   if (arrayBuffer) {
      //     const byteArray = new Uint8Array(arrayBuffer);
      //     base64String = btoa(
      //       new Uint8Array(arrayBuffer).reduce(
      //         (data, byte) => data + String.fromCharCode(byte),
      //         '',
      //       ),
      //     );
      //     setSrcString('data:image/png;base64,' + base64String);
      //   }
      // };
      // oreq.send(null);
    });
  };

  useEffect(() => {
    getFloorPlanInfo();
    console.log('floorPlanName: ' + floorPlanName);
  }, [floorPlanName]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('state', () => {
      getFloorPlanInfo();
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
  return (
    <SafeAreaView style={styles.container}>
      <View>
        {/* <ImageModal
          swipeToDismiss={true}
          resizeMode="contain"
          imageBackgroundColor="white"
          overlayBackgroundColor="white"
          style={{
            width: SCREEN_WIDTH * 0.9,
            height: '95%',
            marginTop: '6.5%',
          }}
          source={{
            uri: URL,
          }}
        /> */}
        <Image source={imagePath[icon]}
               swipeToDismiss={true}
               resizeMode="contain"
               imageBackgroundColor="white"
               overlayBackgroundColor="white"
               style={{
                 width: SCREEN_WIDTH * 0.9,
                 height: '95%',
               }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    width: '90%',
    top: '5.5%',
    position: 'absolute',
    backgroundColor: '#F4F4F5',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 15,
    elevation: 2,
  },
  warnHeader: {
    width: '24.5%',
    height: '5%',
    top: '13.3%',
    left: '5%',
    position: 'absolute',
    backgroundColor: '#F4F4F5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    elevation: 2,
  },
  menuIcon: {
    marginLeft: '5%',
  },
  searchBar: {
    width: '70%',
    marginLeft: '5%',
  },
});
