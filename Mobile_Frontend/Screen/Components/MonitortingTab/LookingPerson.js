import React, {useState, useEffect, useRef} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  Alert,
  Linking,
  Dimensions,
} from 'react-native';
import NaverMapView, {Marker} from 'react-native-nmap';
import {AutocompleteDropdown} from 'react-native-autocomplete-dropdown';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Modal from 'react-native-modal';
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';
import AsyncStorage from '@react-native-community/async-storage';
import LoadingScreen from '../LoadingScreen.js';
import ServerIp from '../../../src/user.js';
import axios from 'axios';
import position from '../../../Image/Image_workerPosition.png';
import warnPosition from '../../../Image/Image_workerPosition_warn.png';
import {routes} from '../../../../Express_Backend/routes/worker.warning';

export default function LookingPerson({navigation, route}) {
  const [info, setInfo] = useState('');
  const [pageLoading, setPageLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };
  const ref = useRef(null);

  const getMapInfo = async () => {
    const params = [];
    await AsyncStorage.getItem('SELECTED_BIZ_ID', (err, result) => {
      params.push(result);
    });
    await AsyncStorage.getItem('LOOKING_WORKERID', (err, result) => {
      params.push(parseInt(result));
    });
    await AsyncStorage.getItem('accesstoken', (err, result) => {
      params.push(result);
    });

    if (params[0] != '' && params[1] != '') {
      axios
        .get(ServerIp + 'api/map/LookingWorker', {
          params: {
            BIZ_ID: params[0],
            USER_ID: params[1],
            token: params[2],
          },
        })
        .then(function (response) {
          setInfo(response.data.data);
          console.log('Fetched: ' + JSON.stringify(response.data.data));
          setPageLoading(false);
        })
        .catch(error => {
          console.log(error);
          setPageLoading(false);
        });
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setPageLoading(true);
      getMapInfo();
      setModalVisible(false);
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    console.log('INFO: ' + JSON.stringify(info));
    toggleModal();
  }, [info]);
  {
    if (!pageLoading && info != []) {
      const P0 = {
        latitude: Object.values(info)[0].LAT,
        longitude: Object.values(info)[0].LNG,
      };
      return (
        <SafeAreaView style={styles.container}>
          <NaverMapView
            ref={ref}
            style={{width: '100%', height: '100%'}}
            showsMyLocationButton={false}
            center={{...P0, zoom: 18}}>
            <View>
              {Object.values(info)[0].ALERT_TYPE == '02' ? (
                <Marker
                  image={require('../../../Image/monitoring_warning_01.png')}
                  coordinate={{
                    latitude: Object.values(info)[0].LAT,
                    longitude: Object.values(info)[0].LNG,
                  }}
                />
              ) : Object.values(info)[0].ALERT_TYPE == '01' ? (
                <Marker
                  image={require('../../../Image/monitoring_warning_02.png')}
                  coordinate={{
                    latitude: Object.values(info)[0].LAT,
                    longitude: Object.values(info)[0].LNG,
                  }}
                />
              ) : Object.values(info)[0].ALERT_TYPE == '07' ? (
                <Marker
                  image={require('../../../Image/monitoring_warning_03.png')}
                  coordinate={{
                    latitude: Object.values(info)[0].LAT,
                    longitude: Object.values(info)[0].LNG,
                  }}
                />
              ) : Object.values(info)[0].ALERT_TYPE == '09' ? (
                <Marker
                  image={require('../../../Image/monitoring_warning_04.png')}
                  coordinate={{
                    latitude: Object.values(info)[0].LAT,
                    longitude: Object.values(info)[0].LNG,
                  }}
                />
              ) : (
                <View></View>
              )}
              <Marker
                coordinate={{
                  latitude: Object.values(info)[0].LAT,
                  longitude: Object.values(info)[0].LNG,
                }}
                onClick={() => toggleModal()}
                image={
                  Object.values(info)[0].ALERT_TYPE == ''
                    ? require('../../../Image/Image_workerPosition.png')
                    : require('../../../Image/Image_workerPosition_warn.png')
                }
              />
            </View>
          </NaverMapView>

          <Modal
            isVisible={modalVisible}
            hideModalContentWhileAnimating={true}
            useNativeDriver={true}
            backdropColor={'transparent'}
            style={{
              flex: 1,
              justifyContent: 'flex-end',
              margin: 0,
            }}
            onBackdropPress={() => setModalVisible(false)}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                {Object.values(info)[0].ALERT_TYPE == '' ? (
                  <Text style={styles.nomalText}>일반사용자</Text>
                ) : (
                  <Text style={styles.SOSText}>
                    {Object.values(info)[0].ALERT_TYPE == '01'
                      ? '심박동이상'
                      : Object.values(info)[0].ALERT_TYPE == '02'
                      ? 'SOS호출'
                      : Object.values(info)[0].ALERT_TYPE == '03'
                      ? '경로이탈'
                      : Object.values(info)[0].ALERT_TYPE == '05'
                      ? '최소근무인원 미달'
                      : Object.values(info)[0].ALERT_TYPE == '06'
                      ? '미승인구역 출입'
                      : Object.values(info)[0].ALERT_TYPE == '07'
                      ? '위험구역 출입'
                      : Object.values(info)[0].ALERT_TYPE == '08'
                      ? '성별전용구역 침범'
                      : Object.values(info)[0].ALERT_TYPE == '09'
                      ? '안전모 턱끈 미착용'
                      : Object.values(info)[0].ALERT_TYPE == '10'
                      ? '낙상'
                      : '타입 미지정'}
                  </Text>
                )}
                <Icon
                  name="close"
                  color={'gray'}
                  size={20}
                  onPress={toggleModal}
                />
              </View>
              <View>
                <Text
                  style={{
                    color: 'black',
                    fontSize: RFPercentage(2.0),
                    fontWeight: '600',
                    fontFamily: 'NotoSansKR-Regular',
                  }}>
                  {Object.values(info)[0].USER_NM} (디바이스 번호 :{' '}
                  {Object.values(info)[0].DEVICE_NUM})
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    paddingVertical: '4%',
                    flexWrap: 'wrap',
                    marginTop: '-1%',
                  }}>
                  <TouchableOpacity style={styles.info}>
                    <Text style={{fontFamily: 'NotoSansKR-Regular'}}>
                      {Object.values(info)[0].AGE == ''
                        ? '나이불명'
                        : Object.values(info)[0].AGE}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.info}>
                    <Text style={{fontFamily: 'NotoSansKR-Regular'}}>
                      {Object.values(info)[0].GENDER_NM == '남'
                        ? '남성'
                        : '여성'}
                    </Text>
                  </TouchableOpacity>
                  {Object.values(info)[0].DISEASE_YN == 'Y' ? (
                    <TouchableOpacity style={styles.info}>
                      <Text style={{fontFamily: 'NotoSansKR-Regular'}}>
                        '건강취약자'
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <Text></Text>
                  )}
                  {Object.values(info)[0].RISK_WORKER_YN == 'Y' ? (
                    <TouchableOpacity style={styles.info}>
                      <Text style={{fontFamily: 'NotoSansKR-Regular'}}>
                        '위험작업자'
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <Text></Text>
                  )}
                </View>
              </View>
              <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                <TouchableOpacity
                  style={styles.rowImage}
                  onPress={() => {
                    const data = {
                      USER_ID: Object.values(info)[0].USER_ID,
                      USER_NM: Object.values(info)[0].USER_NM,
                      DEPT_ID: Object.values(info)[0].DEPT_ID,
                    };

                    navigation.navigate('SendMessage', {
                      screen: 'sendMessage',
                      params: data,
                    });
                  }}>
                  <Image
                    source={require('../../../Image/action_02.png')}
                    style={{width: 40, height: 40}}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.rowImage}
                  onPress={() => {
                    if (Object.values(info)[0].MOBILE == '') {
                      Alert.alert(
                        '전화번호 미확인',
                        '해당 사용자는 \n전화번호 정보가 존재하지 않습니다',
                      );
                    } else {
                      Linking.openURL(
                        'tel:' +
                          Object.values(info)[0].MOBILE.replace(/-/gi, ''),
                      );
                    }
                  }}>
                  <Image
                    source={require('../../../Image/action_01.png')}
                    style={{width: 40, height: 40}}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          {/* 검색 및 메뉴 */}
          {/* <View style={styles.header}>
            <TouchableOpacity
              style={styles.menuIcon}
              onPress={() => {
                navigation.openDrawer();
              }}>
              <Icon name="menu" color={'gray'} size={30} />
            </TouchableOpacity>
            <View style={styles.searchBar}>
              <AutocompleteDropdown
                controller={controller => {
                  searchRef.current = controller;
                }}
                emptyResultText={'검색되지 않는 이름입니다.'}
                textInputProps={{
                  placeholder: '작업자명',
                  fontSize: RFPercentage(1.0),
                  fontFamily: 'NotoSansKR-Regular',
                  style: {
                    fontSize: RFPercentage(2.0),
                    fontFamily: 'NotoSansKR-Regular',
                  },
                }}
                inputContainerStyle={{
                  fontFamily: 'NotoSansKR-Regular',
                  backgroundColor: 'white',
                }}
                suggestionsListContainerStyle={{
                  marginLeft: '5%',
                  borderBottomLeftRadius: 20,
                  borderBottomRightRadius: 20,
                }}
                suggestionsListTextStyle={{
                  fontFamily: 'NotoSansKR-Regular',
                  fontSize: RFPercentage(2.0),
                }}
                suggestionsListMaxHeight={Dimensions.get('window').height * 0.4}
                clearOnFocus={true}
                closeOnBlur={true}
                closeOnSubmit={true}
                onChangeText={title => setWorkerName(title)}
                onSelectItem={item => {
                  setWorkerName(item);
                }}
                dataSet={[...new Set(workerList)]}
              />
            </View>
            <TouchableOpacity
              style={styles.searchIcon}
              onPress={() => {
                if (workerName.id != null) {
                  ref.current.animateToCoordinate({
                    latitude: Number(workerName.LAT),
                    longitude: Number(workerName.LNG),
                  });
                  clickAction(workerName);
                }
              }}>
              <Icon name="search" color={'gray'} size={20} />
            </TouchableOpacity>
          </View> */}

          {/* 근로자 경고 */}
          {/* <TouchableOpacity style={styles.warnHeader}>
            <Image
              source={require('../../../Image/Image_workerPosition_warn.png')}
              resizeMode="contain"
              style={{width: '16%', height: '40%'}}
            />
            <Text
              style={{
                fontFamily: 'NotoSansKR-Regular',
                color: 'black',
                fontWeight: '300',
                fontSize: RFPercentage(1.6),
              }}>
              {'  '}근로자 경고
            </Text>
          </TouchableOpacity> */}
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
    flexDirection: 'row',
    alignItems: 'center',
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
  },
  searchBar: {
    width: '60%',
    marginLeft: '10%',
    backgroundColor: 'white',
  },
  searchIcon: {
    marginLeft: '4%',
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
  info: {
    backgroundColor: '#F4F4F5',
    borderRadius: 20,
    paddingVertical: '2%',
    paddingHorizontal: '5%',
    marginRight: '2%',
    marginTop: '2%',
  },
});
