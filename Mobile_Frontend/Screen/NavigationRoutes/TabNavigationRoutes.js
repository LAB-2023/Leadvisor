import React, {useEffect} from 'react';
import {StatusBar} from 'react-native';
import 'react-native-gesture-handler';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';
//import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-community/async-storage';
import {LogBox} from 'react-native';
import * as DrawerNavigation from './DrawerNavigationRoutes';
import TabSetting from '../TabScreens/TabSetting';

const Tab = createBottomTabNavigator();
LogBox.ignoreLogs([
  'VirtualizedLists should never be nested inside plain ScrollViews with the same orientation because it can break windowing and other functionality - use another VirtualizedList-backed container instead.',
]);
const TabNavi = ({navigation}) => {
  // useEffect(() => {
  //   // const getFcmToken = async () => {
  //   //   const fcmToken = await messaging().getToken();
  //   //   await console.log('FCM-TOKEN: ' + fcmToken);
  //   // };
  //   // getFcmToken();

  //   AsyncStorage.getItem('Table', (err, result) => {
  //     if (result !== '') {
  //       const UserInfo = JSON.parse(result);
  //       console.log('BIZ_ID: ' + UserInfo.BIZ_ID);
  //       const topic = UserInfo.BIZ_ID;

  //       return messaging()
  //         .subscribeToTopic(topic)
  //         .then(() => {
  //           console.log('Topic set: ' + topic);
  //         })
  //         .catch(() => {
  //           console.log('Topic did not set.');
  //         });
  //     }
  //   });
  // }, []);

  return (
    <Tab.Navigator
      screenOptions={{
        initialRoutName:'지도',
        tabBarActiveTintColor: '#0eb5e9',
        tabBarStyle: {
          borderTopColor: '#E9E9E9',
          backgroundColor: '#FFFFFF',
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          position: 'absolute',
          height: '9.2%',
        },
        tabBarIconStyle: {
          marginTop: 10,
        },
        tabBarLabelStyle: {
          fontFamily: 'NotoSansKR-Regular',
          marginBottom: 15,
          fontSize: RFPercentage(1.6),
        },
      }}>
 <Tab.Screen
        name="실내"
        component={DrawerNavigation.SendMessageTab}
        options={{
          unmountOnBlur : true,
          tabBarLabel: '실내',
          tabBarIcon: ({color}) => <Icon name="map" color={color} size={25} />,
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="지도"
        component={DrawerNavigation.MonitoringTab}
        options={{
          unmountOnBlur : true,
          tabBarLabel: '지도',
          tabBarIcon: ({color}) => (
            <Icon name="location-pin" color={color} size={25} />
          ),
          headerShown: false,
        }}
      />

     

      <Tab.Screen
        name="설정"
        component={TabSetting}
        options={{
          tabBarLabel: '설정',
          tabBarIcon: ({color}) => (
            <Icon name="settings" color={color} size={25} />
          ),
          headerTitleStyle: {
            fontSize: RFPercentage(2.3),
            fontFamily: 'NotoSansKR-Medium',
          },
          headerTitleAlign: 'center',
        }}
      />
    </Tab.Navigator>
  );
};

export default () => {
  return <TabNavi />;
};
