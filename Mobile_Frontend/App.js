// Example of Splash, Login and Sign Up in React Native
// https://aboutreact.com/react-native-login-and-signup/
import 'react-native-gesture-handler';

// Import React and Component
import React, {useState, useEffect, Component, useRef} from 'react';
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    Switch,
    StatusBar,
    RefreshControlComponent,
    Alert,
    navigation,
    AppRegistry,
    AppState, ToastAndroid,
} from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';
//import Icon from 'react-native-vector-icons/MaterialIcons';
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';
//import AsyncStorage from '@react-native-community/async-storage';
// Import Navigators from React Navigation
import {
  NavigationContainer,
  createNavigationContainerRef,
} from '@react-navigation/native';
//import {createStackNavigator} from '@react-navigation/stack';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
//import {createDrawerNavigator} from '@react-navigation/drawer';
import TabNavigationRoutes from './Screen/NavigationRoutes/TabNavigationRoutes';
//import * as DrawerNavigation from './Screen/NavigationRoutes/DrawerNavigationRoutes';

// Import Screens
import SplashScreen from './Screen/SplashScreen';
import LoginScreen from './Screen/LoginScreen';
import TermsOfUse from './Screen/Components/SettingsTab/TermsOfUse';
import VersionInfo from './Screen/Components/SettingsTab/VersionInfo';
import LookingPerson from './Screen/Components/MonitortingTab/LookingPerson';
import BackgroundTimer from 'react-native-background-timer'
import Geolocation, {clearWatch} from "react-native-geolocation-service";

// import messaging from '@react-native-firebase/messaging';
import {set} from '../Express_Backend/routes/user.login';
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

const Stack = createNativeStackNavigator();
//const Drawer = createDrawerNavigator();
const navigationRef = createNavigationContainerRef();
function navigate(name, params) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}
const Auth = () => {
  // Stack Navigator for Login and Sign up Screen
  return (
    <Stack.Navigator initialRouteName="LoginScreen">
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

// messaging().setBackgroundMessageHandler(async remoteMessage => {
//   console.log('Message handled in the background: ', remoteMessage);
// });

function HeadlessCheck({isHeadless}) {
  if (isHeadless) {
    // App has been launched in the background by iOS, ignore
    return null;
  }
  return <App />;
}

/* Switch Navigator for those screens which needs to be switched only once
  and we don't want to switch back once we switch from them to the next one */

const App = () => {
  const [state, setState] = useState(false);
  const [date, setDate] = useState('');
  const [alertType, setAlertType] = useState('');
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');
  const [bizId, setBizId] = useState('');
  const [alertTitle, setAlertTitle] = useState('');
  const [alertBody, setAlertBody] = useState('');
  const [watchId, setWatchId] = useState(0)

  // useEffect(() => {
  //   console.log(alertTitle);
  //   console.log(alertBody);
  //   console.log(date);
  //   console.log(alertType);
  //   console.log(userName);
  //   console.log(userId);
  //   console.log(bizId);
  // }, [[alertTitle, alertBody, date, alertType, userName, userId, bizId]]);


  // useEffect(() => {
  //   messaging().onNotificationOpenedApp(remoteMessage => {
  //     // console.log('Clicked Background Message');
  //     navigate('통합관리');
  //   });

  //   messaging().getInitialNotification(remoteMessage => {
  //     // console.log('getInitialNotification');
  //   });
  // });
  
  // useEffect(() => {
  //   messaging().onMessage(async remoteMessage => {
  //     //Alert.alert(JSON.stringify(remoteMessage));
  //     console.log(JSON.stringify(remoteMessage));
  //     setAlertTitle(alertTitle => {
  //       return remoteMessage.notification.title;
  //     });
  //     setAlertBody(alertBody => {
  //       return remoteMessage.notification.body;
  //     });
  //     setDate(date => {
  //       return remoteMessage.data.regDt;
  //     });
  //     setAlertType(alertType => {
  //       return remoteMessage.data.alertType;
  //     });
  //     setUserName(userName => {
  //       return remoteMessage.data.userNm;
  //     });
  //     setUserId(userId => {
  //       return remoteMessage.data.userId;
  //     });
  //     setBizId(bizId => {
  //       return remoteMessage.data.bizId;
  //     });
  //     //알림무시
  //     pushAlert();
  //   });
  // }, [alertTitle, alertBody, date, alertType, userName, userId, bizId]);

    // useEffect(() => {
    //     startTimer();
    // }, [])

    const startTimer = () => {
        BackgroundTimer.runBackgroundTimer(() => {
            console.log("Running backgroundTimer");
            const watchId = Geolocation.watchPosition(position => {
                console.log(position.coords.latitude + " " + position.coords.longitude);
            })
        }, 5000);
    }

  const pushAlert = async () => {
    try {
      setState(previous => {
        return true;
      });
    } catch (error) {
      console.log('alert error: ' + error);
    }
  };
  return (
    <NavigationContainer ref={navigationRef}>
      <StatusBar
        backgroundColor="transparent"
        translucent={true}
        barStyle={'dark-content'}
      />
      <AwesomeAlert
        show={state}
        showProgress={false}
        title={alertTitle}
        message={alertBody + '\n\n' + userName + '\n' + date}
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showCancelButton={true}
        showConfirmButton={true}
        cancelText="나중에 보기"
        confirmText="확인하기"
        contentContainerStyle={{
          paddingVertical: '5%',
          width: '60%',
        }}
        contentStyle={{paddingVertical: '5%'}}
        titleStyle={{
          fontWeight: '700',
          marginBottom: '5%',
          fontFamily: 'NotoSansKR-Medium',
        }}
        messageStyle={{
          fontFamily: 'NotoSansKR-Medium',
        }}
        confirmButtonTextStyle={{fontFamily: 'NotoSansKR-Medium'}}
        cancelButtonTextStyle={{fontFamily: 'NotoSansKR-Medium'}}
        confirmButtonColor="#787AFF"
        onCancelPressed={() => {
          setState(false);
        }}
        onConfirmPressed={() => {
          setState(false);
          if (alertType == '01' || alertType == '02') {
            navigate('통합관리', {
              screen: '근로자 알림',
            });
          } else if (alertType == '04') {
            navigate('통합관리', {
              screen: '환경 알림',
            });
          } else {
            navigate('통합관리');
          }
        }}
      />
      <Stack.Navigator initialRouteName="SplashScreen">
        {/* SplashScreen which will come once for 5 Seconds */}
        <Stack.Screen
          name="SplashScreen"
          component={SplashScreen}
          // Hiding header for Splash Screen
          options={{headerShown: false}}
        />
        {/* Auth Navigator which includer Login Signup will come once */}
        <Stack.Screen
          name="Auth"
          component={Auth}
          options={{headerShown: false}}
        />
        {/* Navigation Tab as a landing page */}

        <Stack.Screen
          name="TabNavigationRoutes"
          component={TabNavigationRoutes}
          // Hiding header for Navigation Tab as we will use our custom header
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="TermsOfUse"
          component={TermsOfUse}
          options={{
            title: '이용 약관',
            headerTitleStyle: {
              fontFamily: 'NotoSansKR-Medium',
              fontSize: RFPercentage(2.3),
            },
            headerTitleAlign: 'center',
          }}
        />
        <Stack.Screen
          name="VersionInfo"
          component={VersionInfo}
          options={{
            title: '버전 정보',
            headerTitleStyle: {
              fontFamily: 'NotoSansKR-Medium',
              fontSize: RFPercentage(2.3),
            },
            headerTitleAlign: 'center',
          }}
        />

        <Stack.Screen
          name="지도보기"
          component={LookingPerson}
          options={{
            title: '근로자 위치 확인',
            headerTitleStyle: {
              fontFamily: 'NotoSansKR-Medium',
              fontSize: RFPercentage(2.3),
            },
            headerTitleAlign: 'center',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

AppRegistry.registerComponent('app', () => HeadlessCheck);
export default App;
