import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';
import {Searchbar} from 'react-native-paper';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';

import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import ServerIp from '../../../src/user';
const ip = ServerIp + 'api/user/map/list';
export let currFloor = ''; //ㅇㅅ수정
export default function LisfOfFloorPlanDrawer({props, navigation}) {
  const [searchFloorPlans, setSearchFloorPlans] = useState('');
  const [componentNumber, setComponentNumber] = useState(0);
  const [mapList, setMapList] = useState([]);
  const [data, setData] = useState([]);
  const onChangeSearch = query => setSearchFloorPlans(query);

  const handleSearch = query => {
    const formattedQuery = query.toLowerCase();
    const filteredData = mapList.filter(v => v.MAP_NM.includes(formattedQuery));
    setData(filteredData);
  };

  const getMapList = async () => {
    const params = [];
    await AsyncStorage.getItem('SELECTED_BIZ_ID', (err, result) => {
      params.push(result);
    });
    await AsyncStorage.getItem('Table', (err, result) => {
      const UserInfo = JSON.parse(result);
      params.push(UserInfo.USE_YN);
    });
    await AsyncStorage.getItem('accesstoken', (err, result) => {
      params.push(result);
    });

    if (params[0] != '' && params[1] != '' && params[2] != '') {
      axios
        .get(ip, {
          params: {
            BIZ_ID: params[0],
            USE_YN: params[1],
            token: params[2],
          },
        })
        .then(function (response) {
          setMapList(response.data.data);
          setComponentNumber(response.data.data.length);
          setData(response.data.data);
        })
        .catch(error => {
          console.log(error);
        });
    }
  };

  useEffect(() => {
    navigation.navigate('InDoorNavigation');
  }, []);
  useEffect(() => {
    searchFloorPlans.length > 0
      ? handleSearch(searchFloorPlans)
      : setData(mapList);
  }, [searchFloorPlans]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('state', () => {
      setSearchFloorPlans('');
      getMapList();
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.container}>
      <View>
        <Text style={styles.ListofSites}>도면 목록</Text>
      </View>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Searchbar
          placeholder="도면 이름 검색"
          onChangeText={onChangeSearch}
          value={searchFloorPlans}
          style={styles.Searchbar}
          inputStyle={{
            fontSize: RFPercentage(1.8),
            marginLeft: '-5%',
            fontFamily: 'NotoSansKR-Regular',
            marginTop: '0.3%',
          }}
        />
      </View>
      <View>
        <View></View>
        <View>
          {/* {mapList.map((v, index) => {
            return (
              <DrawerItem
                key={index}
                label={v.MAP_NM}
                onPress={() => {
                  AsyncStorage.setItem('FLOORPLAN_NAME', v.MAP_NM);
                  AsyncStorage.setItem('IMG_ID', v.MAP_ID.toString());
                  console.log("Select " + v.MAP_ID);
                  navigation.navigate('FloorPlan');
                }}
              />
            );
          })} */}
          {/* <FlatList
            data={data}
            keyExtractor={(item, index) => {
              return index.toString();
            }}
            renderItem={({item}) => (
              <View>
                <DrawerItem
                  labelStyle={{fontFamily: 'NotoSansKR-Regular'}}
                  label={item.MAP_NM}
                  onPress={() => {
                    currFloor = item.MAP_ID.toString(); //윤서 수정
                    console.log("drawer파일"+item.MAP_ID.toString());
                    AsyncStorage.setItem('FLOORPLAN_NAME', item.MAP_NM);
                    AsyncStorage.setItem('IMG_ID', item.MAP_ID.toString());
                    //console.log("Select " + item.MAP_ID);
                    navigation.goBack();
                    //navigation.navigate('InDoorNavigation');
                  }}
                />
              </View>
            )}
          /> */}
        </View>
      </View>
    </DrawerContentScrollView>
  );
}

const styles = new StyleSheet.create({
  container: {
    flexGrow: 1,
    marginTop: '10%',
  },
  ListofSites: {
    color: 'black',
    fontSize: RFPercentage(2.0),
    fontFamily: 'NotoSansKR-Regular',
    fontWeight: '700',
    marginLeft: '6%',
  },
  manageAll: {
    color: '#727272',
    marginLeft: '7%',
    marginTop: '10%',
  },
  Searchbar: {
    marginTop: '5%',
    width: '90%',
    borderRadius: 10,
  },
});
