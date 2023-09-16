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
// const Tab = createDrawerNavigator();

LogBox.ignoreLogs([
  'VirtualizedLists should never be nested inside plain ScrollViews with the same orientation because it can break windowing and other functionality - use another VirtualizedList-backed container instead.',
]);
const TabNavi = ({navigation}) => {

  return (
    <Tab.Navigator
      screenOptions={{
        initialRoutName:'실내',
        tabBarActiveTintColor: '#0eb5e9',
        tabBarStyle: {
          borderTopColor: '#E9E9E9',
          backgroundColor: '#FFFFFF',
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          position: 'absolute',
          height: '0%',
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

    
      {/* <Tab.Screen
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
      /> */}
    </Tab.Navigator>
  );
};

export default () => {
  return <TabNavi />;
};
