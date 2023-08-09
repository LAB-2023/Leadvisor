import React, {useState, useEffect, useRef} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
  PermissionsAndroid,
  BackHandler,
  ToastAndroid,
} from 'react-native';
import NaverMapView, {
  Marker,
  Polyline,
} from 'react-native-nmap';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useFocusEffect } from '@react-navigation/native';
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';
import Modal from 'react-native-modal';
import LoadingScreen from '../Components/LoadingScreen';
import qs from 'qs';
import axios from 'axios';
import Voice from "@react-native-voice/voice";
import Tts from 'react-native-tts';
import {TMAP_API_KEY_ID} from '@env';
import Geolocation, {clearWatch} from "react-native-geolocation-service";
import { getDistance } from 'geolib';
import { BarIndicator } from 'react-native-indicators';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import BackgroundTimer from 'react-native-background-timer'
import {NativeModules} from "react-native";

export default function OutDoorNavigation({navigation, route}) {
  const [pageLoading, setPageLoading] = useState(true); // pageLoader
  const [descs, setDescs] = useState([]);
  const [watchId, setWatchId] = useState(0);
  const [descIndex, setDescIndex] = useState([]);
  const [passedIndex, setPassedIndex] = useState(0);
  const [turningPointCoord, setTurningPointCoord] = useState([]);
  const [currentLat, setCurrentLat] = useState(37.00000);
  const [currentLng, setCurrentLng] = useState(127.00000);
  const [mapCenterCoord, setMapCenterCoord] = useState({});
  const [touchedCoord, setTouchedCoord] = useState({});
  const [gpsCoords, setGpsCoords] = useState([]);
  const [sourcePoint, setSourcePoint] = useState('현재위치');
  const [sourceModalVisible, setSourceModalVisible] = useState(false);
  const [destPoint, setDestPoint] = useState('도착지를 입력하세요.');
  const [destModalVisible, setDestModalVisible] = useState(false);
  const [recordedPlace, setRecordedPlace] = useState('-');
  const [sourceCoord, setSourceCoord] = useState({});
  const [destCoordState, setDestCoordState] = useState({});
  // const {ToastModule} = NativeModules;
  const {LocationModule} = NativeModules;


  //Voice Record
  const [isRecord, setIsRecord] = useState(false);
  const _onSpeechResults = (e) =>{
    let sResult = e.value[0];
    console.log(sResult);
    setRecordedPlace(sResult);
  }
  const _onSpeechStart = () => {
    setIsRecord(true);
  }
  const _onSpeechEnd = () => {
    setIsRecord(false);
    Voice.stop();
  }
  const _onRecordVoice = () => {
    console.log("TQQTQTQQTQTQ")
    Voice.start('ko-KR');
  };
  useEffect(() => {
    Voice.destroy().then(Voice.removeAllListeners);
    Voice.onSpeechResults = _onSpeechResults;
    Voice.onSpeechStart = _onSpeechStart;
    Voice.onSpeechEnd = _onSpeechEnd;
    setIsRecord(false);
  }, []);


  useEffect(()=>{
    if(sourceModalVisible){
      setSourcePoint(recordedPlace);
      sourceAutoCompleteRef.current?.setAddressText(recordedPlace);
      sourceAutoCompleteRef.current?.focus();
      console.log(sourceAutoCompleteRef);
      _onSpeechEnd();
    }
    else if(destModalVisible){
      setDestPoint(recordedPlace);
      destAutoCompleteRef.current?.setAddressText(recordedPlace);
      destAutoCompleteRef.current?.focus();
      console.log(destAutoCompleteRef);
      _onSpeechEnd();
    }
  },[recordedPlace])

  const ref = useRef(null);
  const sourceAutoCompleteRef = useRef();
  const destAutoCompleteRef = useRef();
  const [exitApp, setExitApp] = useState(0);
  const showToast = () => {
    ToastAndroid.show('한 번 더 누르시면 종료됩니다.', ToastAndroid.SHORT);
  };



  useEffect(() => {
    if (route.params !== undefined) {
      setTimeout(() => {
      }, 1000);
    }
  }, [route]);

  useEffect(() => {
    let timeout = setTimeout(() => {
      setExitApp(0);
    }, 2000);

    if(ref?.current) {
      ref.current.setLocationTrackingMode(2);
    }
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

  useFocusEffect(
      React.useCallback(() => {
        // Do something when the screen is focused
        requestPermissions();
        // ToastModule.show('이 메시지는 네이티브 모듈에서 생성됨', ToastModule.SHORT);
        LocationModule.startBackgroundLocation();
        return () => {
          // Do something when the screen is unfocused
          // Useful for cleanup functions
          Geolocation.clearWatch(watchId);
          BackgroundTimer.stopBackgroundTimer();
          LocationModule.stopBackgroundLocation();
        };
      }, []));


  const startTimer = () => {
    BackgroundTimer.runBackgroundTimer(() => {
      console.log("1분 이상 같은 자리에 머물러 알람이 전송됩니다.");
      ToastAndroid.show('1분 이상 움직임이 없어 알람이 전송됩니다.', ToastAndroid.SHORT);
    }, 1000 * 60);
  }

  async function requestPermissions() {
    if (Platform.OS === 'ios') {
      const auth = await Geolocation.requestAuthorization("whenInUse");
      if(auth === "granted") {
        console.log("out service is not supporting ios")
      }
    }

    if (Platform.OS === 'android') {
      await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      if ("granted" === PermissionsAndroid.RESULTS.GRANTED) {
        getCurrentPosition();
      }
    }
  }

  const get_tmap_route = async() => {

    const tmapBody = qs.stringify({
      appKey: TMAP_API_KEY_ID,
      endX: destCoordState.lng,
      endY: destCoordState.lat,
      startX: sourceCoord.lng,
      startY: sourceCoord.lat,
      startName: "source",
      endName: "dest",
      searchOption: 10
    });

    axios.post(
        'https://apis.openapi.sk.com/tmap/routes/pedestrian?version=1',
        tmapBody,
    ).then(function (response) {
      let gps = [];
      let gps_obj_element = {};
      let latitudes = [];
      let longitudes = [];


      let descList = [];
      let descIndexList = [];
      let turningPointLatitudes = [];
      let turningPointLongitudes = [];
      let turningPointCoords = [];
      let turningPointCoord_obj_element = {};
      // 경로들 전부 출력
      for(var i=0; i<response.data.features.length; i++) {
        let base = response.data.features[i].geometry.coordinates;
        base = JSON.stringify(base);
        if(base[1] === '[') {
          base = base.substring(1);
          base = base.substring(0, base.length - 1)
          var _split = base.split("\[");
          for(var k = 1; k< _split.length; k++) {
            var _splitDepth = _split[k].split(",");
            for(var j = 0; j<_splitDepth.length; j++) {
              if(_splitDepth[j] !== " " && _splitDepth[j].length > 0) {
                if(j === 0) {
                  let tempLng = parseFloat(_splitDepth[j]);
                  longitudes.push(tempLng);
                } else {
                  let tempLat = parseFloat(_splitDepth[j].substring(0, _splitDepth[j].length - 1))
                  latitudes.push(tempLat);
                }
              }
            }
          }
        } else if (base[0] === '['){
          descList.push(response.data.features[i].properties.description);
          descIndexList.push(i);
          var _split = base.split('\[');
          for(var s = 0; s < _split.length; s++) {
            var _splitDepth = _split[s].split(",");
            for(var l=0; l<_splitDepth.length; l++) {
              if(_splitDepth[l] !== " " && _splitDepth[l].length > 0) {
                if(l === 0) {
                  let tempLng = parseFloat(_splitDepth[l]);
                  longitudes.push(tempLng);
                  turningPointLongitudes.push(tempLng);
                } else {
                  let tempLat = parseFloat(_splitDepth[l].substring(0, _splitDepth[l].length - 1));
                  latitudes.push(tempLat);
                  turningPointLatitudes.push(tempLat);
                }
              }
            }
          }
        }
      }

      for(let v = 0; v < turningPointLatitudes.length; v++) {
        turningPointCoord_obj_element['latitude'] = turningPointLatitudes[v];
        turningPointCoord_obj_element['longitude'] = turningPointLongitudes[v];
        turningPointCoords.push(turningPointCoord_obj_element);
        turningPointCoord_obj_element = {};
      }
      setTurningPointCoord(turningPointCoords);
      setDescIndex(descIndexList);
      setDescs(descList);
      // 좌표값 직접 파싱 완료, 아래에서 JSON Object로 만들어줌
      for(let i = 0; i < latitudes.length; i++) {
        gps_obj_element['latitude'] = latitudes[i];
        gps_obj_element['longitude'] = longitudes[i]
        gps.push(gps_obj_element)
        gps_obj_element = {};
      }
      setGpsCoords(gps);
      setPageLoading(false);
    })
  }

  Tts.setDefaultLanguage('ko-KR');

  const speakText = (message) => {
    console.log(message);
    Tts.stop();
    Tts.getInitStatus().then(()=>{
      Tts.speak(message);
    },(err) => {
      if (err.code === 'no_engine'){
        Tts.requestInstallEngine();
      }
    })
  }

  const getCurrentPosition = () => {
    let mapCoordUpdateFlag= false;
    const watchId = Geolocation.watchPosition(
        (position) => {
          console.log("백그라운드 타이머 정지 후 새로 시작");
          // BackgroundTimer.stopBackgroundTimer();
          // ToastAndroid.show('타이머 초기화', ToastAndroid.SHORT);
          startTimer();
          setCurrentLat(position.coords.latitude);
          setCurrentLng(position.coords.longitude);
         if(!mapCoordUpdateFlag) {
           setSourceCoord({
             lat : position.coords.latitude,
             lng : position.coords.longitude
           });
           // setMapCenterCoord({
           //   lat : position.coords.latitude,
           //   lng : position.coords.longitude });
           mapCoordUpdateFlag = true;
         }
        },
        error => {
          console.error(error.code, error.message);
        },
        // {enableHighAccuracy: true, timeout: 15000, maximumAge: 1000},
        {
          accuracy: {
            android: 'high',
            ios: 'best',
          },
          distanceFilter: 3,
          interval: 5000,
          fastestInterval: 2000,
        }
    );
    setWatchId(watchId);
  }

  useEffect(() => {
    if(typeof turningPointCoord[passedIndex] !== "undefined") {
      routeHandler();
    }
  }, [currentLat])

  useEffect(() => {
    console.log("출발지점 좌표 : " + sourceCoord.lat + " " + sourceCoord.lng);
    setMapCenterCoord(sourceCoord);
    setPageLoading(false);
  }, [sourceCoord])

  // TODO 여기서 경로 안내 메시지 및 경로이탈을 안내해준다.
  const routeHandler = () => {
    let dist = getDistance(
        {latitude: currentLat, longitude: currentLng},
        {latitude: turningPointCoord[passedIndex].latitude, longitude: turningPointCoord[passedIndex].longitude}
    ).toFixed(0);
    /*
      TODO 다음 안내 경로 길이 반영한 경로이탈 범위 설정.
     */
    if(dist < 12) {
      console.log("안내 메시지 실행")
      speakText(descs[passedIndex]);
      setPassedIndex(passedIndex + 1);
    } else {
      console.log(dist);
      console.log("경로 이탈");
    }
  }


  const displayMarker = () => {
    if(Object.keys(touchedCoord).length !== 0 ) {
      return <Marker coordinate={touchedCoord}/>
    }
  }

  const drawPolyLine = () => {
    if(Object.keys(gpsCoords).length !== 0) {
      if(ref?.current) {
        ref.current.setLocationTrackingMode(2);
      }
      return  <Polyline
          coordinates={gpsCoords}
          strokeWidth={4}
          strokeColor={'green'}
          onClick={() => console.warn("경로 눌림")} />
    }
  }

  const drawTurningPointMarkers = () => {
    if(Object.keys(turningPointCoord).length !== 0) {
       return turningPointCoord.map((marker, index) => (
          <Marker
              key={index}
              coordinate={marker}/> ))
      }
  }

  const buildPath = () => {
    setPageLoading(true);
    Geolocation.clearWatch(watchId);
    getCurrentPosition();
    get_tmap_route();
  }

  {
    const P0 = {latitude: mapCenterCoord.lat === undefined ? currentLat : mapCenterCoord.lat,
      longitude: mapCenterCoord.lng === undefined ? currentLng : mapCenterCoord.lng};
    if (!pageLoading) {
      return (
        <SafeAreaView style={styles.container}>
          <NaverMapView
            ref={ref}
            style={{width: '100%', height: '93%'}}
            showsMyLocationButton={true}
            center={{...P0, zoom: 18}}>
            {drawPolyLine()}
            {displayMarker()}
            {drawTurningPointMarkers()}
          </NaverMapView>

          <Modal
              animationType="slide"
              transparent={true}
              visible={sourceModalVisible}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <View style = {{flexDirection:'row'}}>
                  <TouchableOpacity onPress = {()=>{
                    _onSpeechEnd();
                    setSourceModalVisible(false);
                  }}>
                    <Icon name = "arrow-back-ios" color = {'gray'} size={22} style={{marginTop:'40%'}}/>
                  </TouchableOpacity>
                  <GooglePlacesAutocomplete
                    ref = {sourceAutoCompleteRef}
                    autoFocus={false}
                    placeholder = '장소를 검색'
                    placeholderTextColor = "gray"
                    style = {styles.modalSearchBar}
                    fetchDetails
                    styles = {{}}
                    renderDescription={(row) => row.structured_formatting.main_text}
                    onPress={(data, details)=>{
                      console.log(details.geometry.location);
                      setSourceCoord(details.geometry.location);
                      setSourcePoint(data.structured_formatting.main_text);
                      sourceAutoCompleteRef.current?.setAddressText(data.structured_formatting.main_text);
                    }}
                    query={{
                      key: 'AIzaSyC_4cMnAdslNwLqMy6HYFEqKj99KaUsmoc',
                      language: 'ko',
                    }}
                  />
                  {
                    isRecord?(
                      <BarIndicator color = '#862C4E' size={22} count={3} style = {{marginTop:'6%', height: '5%', flex: 1}}/>
                    ):(
                      <Icon name = "mic" color = {'gray'} size={22} style={{marginTop:'4%'}} onPress={_onRecordVoice}/>
                    )
                  }
                </View>
              </View>
            </View>
          </Modal>
          <Modal
              animationType="slide"
              transparent={true}
              visible={destModalVisible}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <View style = {{flexDirection: 'row'}}>
                  <TouchableOpacity onPress = {()=>{
                    _onSpeechEnd();
                    setDestModalVisible(false);
                    }}>
                    <Icon name = "arrow-back-ios" color = {'gray'} size={22} style={{marginTop:'40%'}}/>
                  </TouchableOpacity>
                  <GooglePlacesAutocomplete
                    ref = {destAutoCompleteRef}
                    autoFocus={false}
                    placeholder = '장소를 검색'
                    placeholderTextColor = "gray"
                    style = {styles.modalSearchBar}
                    fetchDetails
                    styles = {{}}
                    renderDescription={(row) => row.structured_formatting.main_text}
                    onPress={(data, details)=>{
                      console.log(details.geometry.location);
                      setDestCoordState(details.geometry.location);
                      setDestPoint(data.structured_formatting.main_text);
                      destAutoCompleteRef.current?.setAddressText(data.structured_formatting.main_text);
                    }}
                    query={{
                      key: 'AIzaSyC_4cMnAdslNwLqMy6HYFEqKj99KaUsmoc',
                      language: 'ko',
                    }}
                  />
                  {
                    isRecord?(
                      <BarIndicator color = '#862C4E' size={22} count={3} style = {{marginTop:'6%', height: '5%', flex: 1}}/>
                    ):(
                      <Icon name = "mic" color = {'gray'} size={22} style={{marginTop:'4%'}} onPress={_onRecordVoice}/>
                    )
                  }
                </View>
              </View>
            </View>
          </Modal>

          <View style={styles.header}>
            <TouchableOpacity style = {styles.menuIcon}
              onPress = {()=>{
                setDestPoint(destPoint);
                setSourcePoint(sourcePoint);
              }}
            >
                <Icon name="swap-vert" color={'gray'} size={30}/>
            </TouchableOpacity>
            <View style = {{width:'75%', padding:'2.9%'}}>
              <TouchableOpacity style = {styles.searchBar} onPress = {()=>{
                setSourceModalVisible(true);
              }}>
                <Text>{sourcePoint}</Text>
              </TouchableOpacity>
              <TouchableOpacity style = {[styles.searchBar,{marginTop:'3%'}]} onPress = {()=>{
                setDestModalVisible(true);
              }}>
                <Text>{destPoint}</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.searchIcon} onPress={() => buildPath()}>
                <Icon name="search" color={'gray'} size={22}/>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      );
    } else {
      return LoadingScreen();
    }
  }
}

const styles = new StyleSheet.create({
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
    backgroundColor: 'white',
    alignItems:'center',
    flexDirection: 'row',
    borderRadius: 15,
    elevation: 2,
  },
  rowImage: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '3%',
    paddingHorizontal: '3%',
  },
  warnHeader: {
    width: '23%',
    height: '5%',
    top: '13.3%',
    left: '5%',
    position: 'absolute',
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    elevation: 2,
  },
  menuIcon: {
    marginLeft: '5%',
    marginBottom: '12%'
  },
  searchBar: {
    width: '100%',
    padding: '3%',
    backgroundColor: 'white',
    elevation: 1,
    borderRadius: 5,
  },
  modalSearchBar: {
    width: '90%',
    height: '75%',
    paddingHorizontal: '5%',
    borderRadius: 5,
  },
  searchIcon: {
    marginBottom: '11%',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: '4%',
    justifyContent: 'center',
    elevation: 5,
    borderTopRightRadius: 17,
    borderTopLeftRadius: 17,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: '3%',
    marginBottom: '2%',
  },
  SOSText: {
    fontFamily: 'NotoSansKR-Regular',
    fontSize: RFPercentage(3.2),
    color: 'red',
    fontWeight: '700',
  },
  nomalText: {
    fontFamily: 'NotoSansKR-Regular',
    fontSize: RFPercentage(3.2),
    color: 'black',
    fontWeight: '700',
  },
  workerInfo: {
    backgroundColor: '#F4F4F5',
    borderRadius: 20,
    paddingVertical: '2%',
    paddingHorizontal: '5%',
    marginRight: '2%',
    marginTop: '2%',
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: '12%'
  },
  modalView: {
    width: '100%',
    height: '70%',
    backgroundColor: "white",
    borderRadius: 20,
    padding: '4%',
    alignItems: "center",
    elevation: 3
  },
});
