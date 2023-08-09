import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';
import { LogBox } from 'react-native';
import {Searchbar} from 'react-native-paper';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';

import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import ServerIp from '../../../src/user';
const ip = ServerIp + 'api/user/select/site';
LogBox.ignoreLogs([
  'VirtualizedLists should never be nested inside plain ScrollViews with the same orientation because it can break windowing and other functionality - use another VirtualizedList-backed container instead.',
]);
export default function ListOfSitesDrawer({props, navigation}) {
  const [siteList, setSiteList] = useState([]);
  const [searchSites, setSearchSites] = useState('');
  const onChangeSearch = query => setSearchSites(query);
  const [floor, setFloor] = useState('6')

  const setFlooor = async (val) => {
    if (val == '')
      await AsyncStorage.setItem('floor', floor);
    else
      await AsyncStorage.setItem('floor', val);
  }

  const [data, setData] = useState([]);

  const getSiteList = async () => {
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
      axios
        .get(ip, {
          params: {
            BIZ_ID: params[0],
            BIZ_TYPE: params[1],
            token: params[2],
          },
        })
        .then(function (response) {
          setSiteList(response.data.data);
          setData(response.data.data);
        })
        .catch(error => {
          console.log(error);
        });
    }
  };

  const handleSearch = query => {
    const formattedQuery = query.toLowerCase();
    const filteredData = siteList.filter(v =>
      v.BIZ_NM.includes(formattedQuery),
    );
    setData(filteredData);
  };

  useEffect(() => {
    searchSites.length > 0 ? handleSearch(searchSites) : setData(siteList);
  }, [searchSites]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('state', () => {
      setSearchSites('');
      // getSiteList();
      setData([
       {Floor_Name : "지하1층",
      Floor_id : 0}
      ,{Floor_Name : "1층",
      Floor_id : 1}
      ,{Floor_Name : "2층",
      Floor_id : 2}
      ,{Floor_Name : "3층",
      Floor_id : 3}
      ,{Floor_Name : "4층",
      Floor_id : 4}
      ,{Floor_Name : "5층",
      Floor_id : 5}
      ,{Floor_Name : "6층",
      Floor_id : 6}
      ,{Floor_Name : "7층",
      Floor_id : 7}
      ,{Floor_Name : "8층",
      Floor_id : 8}
      ,{Floor_Name : "9층",
      Floor_id : 9}])
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.container}>
      {/* <DrawerItemList {...props} /> */}
      <View>
        <Text style={styles.ListofSites}>목록</Text>
      </View>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Searchbar
          placeholder="검색"
          onChangeText={onChangeSearch}
          value={searchSites}
          style={styles.Searchbar}
          inputStyle={{
            fontSize: RFPercentage(1.8),
            fontFamily: 'NotoSansKR-Regular',
            marginLeft: '-5%',
            marginTop: '0.3%',
          }}
        />
      </View>
      <View>
        <View>

        </View>
        <View>
          <FlatList
            data={data}
            keyExtractor={(item, index) => {
              return index.toString();
            }}
            renderItem={({item}) => (
              <View>
                <DrawerItem
                  label={item.Floor_Name}
                  labelStyle={{fontFamily: 'NotoSansKR-Regular'}}
                  onPress={() => {
                    setFlooor(JSON.stringify(item.Floor_id))
                    console.log(floor)
                    navigation.closeDrawer();
                  }}
                />
              </View>
            )}
            //  ListHeaderComponent={renderHeader}
          />
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
    marginBottom: '2%',
    fontFamily: 'NotoSansKR-Bold',
  },
  Searchbar: {
    marginTop: '5%',
    width: '90%',
    borderRadius: 10,
  },
});