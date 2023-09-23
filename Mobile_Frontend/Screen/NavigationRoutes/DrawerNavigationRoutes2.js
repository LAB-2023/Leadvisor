//좌측 표

import React, {useEffect} from 'react';
import {Text, View, TextInput,Dimensions} from 'react-native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';
import OutDoorNavigation from '../TabScreens/OutDoorNavigation2';
import InDoorNavigation2 from '../TabScreens/InDoorNavigation2';
import FloorPlanScreen from '../Components/MonitortingTab/FloorPlanScreen';
import LisfOfFloorPlanDrawer from '../Components/DrawerScreens/ListOfFloorPlanDrawer';

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const {height: SCREEN_HEIGHT} = Dimensions.get('window');
const Drawer = createDrawerNavigator();

const TabNavi = ({navigation}) => {

  return (
    <Drawer.Navigator
    screenOptions={{
      drawerStyle: {
        width: '60%',
        borderTopRightRadius: 30,
      },
    }}
    drawerContent={props => <LisfOfFloorPlanDrawer {...props} />}
    >

      <Drawer.Screen
        name="보행약자"
        component={InDoorNavigation2}
        options={{
        }}
      />


    </Drawer.Navigator>

    
  );
};

export default () => {
  return <TabNavi />;
};


// export function HomeTab() {
//   return (
//     <Drawer.Navigator
//       screenOptions={{
//         drawerStyle: {
//           width: '60%',
//           borderTopRightRadius: 30,
//         },
//       }}
//       >
//       <Drawer.Screen
//         name=" "
//         component={TabHome}
//         options={{
//           drawerItemStyle: {height: 0},
//           // drawer 목록에서 안 보이게 하기
//           headerStyle: {
//             backgroundColor: 'white',
//           },
//           headerTintColor: '#363636',
//           headerTitleStyle: {
//             fontSize: RFPercentage(2.4),
//             fontFamily: 'NotoSansKR-Medium',
//           },
//         }}
//       />
//     </Drawer.Navigator>
//   );
// }

// export function MonitoringTab({navigation}) {
//   useEffect(() => {
//     const unsubscribe = navigation.addListener('focus', () => {
//       navigation.navigate('Monitoring');
//     });
//     return unsubscribe;
//   }, [navigation]);
//   return (
//     <Drawer.Navigator
//       screenOptions={{
//         drawerStyle: {
//           width: '60%',
//           borderTopRightRadius: 30,
//         },
//       }}>
//       <Drawer.Screen
//         name="Monitoring"
//         component={OutDoorNavigation}
//         options={{
//           headerShown: false,
//         }}
//       />
//     </Drawer.Navigator>
//   );
// }

// export function SendMessageTab({navigation}) {
//   useEffect(() => {
//     const unsubscribe = navigation.addListener('focus', () => {
//       navigation.navigate('FloorPlanScreen');
//     });
//     return unsubscribe;
//   }, [navigation]);

//   return (
//     <Drawer.Navigator
//     screenOptions={{
//       drawerStyle: {
//         width: '60%',
//         borderTopRightRadius: 30,
//       },
//     }}
//     drawerContent={props => <LisfOfFloorPlanDrawer {...props} />}
//     >
//       <Drawer.Screen
//         name="실내 내비게이션"
//         component={InDoorNavigation2}
//         options={{
//         }}
//       />
//     </Drawer.Navigator>
//   );
// }

// export default function DrawerNavigationRoutes() {
//   return <Text>DrawerNavigationRoutes</Text>;
// }
