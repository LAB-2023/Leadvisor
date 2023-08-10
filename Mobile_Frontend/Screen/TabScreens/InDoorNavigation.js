import React, {useState, useEffect, Component} from 'react';
//fb
import database from '@react-native-firebase/database';
//import {make_maze, Gpath} from './a-star';
//ㅎㅇ 수정
import {
  make_maze,
  Gpath,
  dispath,
  check_corner,
  path_cafeToilet,
} from './a-star';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Switch,
  StatusBar,
  Touchable,
  Image,
  BackHandler,
  ToastAndroid,
  ImageBackground,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';
import ServerIp from '../../src/user';
import axios from 'axios';
import Modal from 'react-native-modal';
import {NavigationContainer, useFocusEffect} from '@react-navigation/native';
import LoadingScreen from '../Components/LoadingScreen';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Svg, Line, Circle, Text as text} from 'react-native-svg';
import Voice from '@react-native-voice/voice';
import ImageMapper from 'react-native-image-mapper';
import {BarIndicator} from 'react-native-indicators';
import Tts from 'react-native-tts';
import {Picker} from '@react-native-picker/picker';
import {Button} from 'react-native';

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const {height: SCREEN_HEIGHT} = Dimensions.get('window');
const skyblue = '#02343F';
const reserveIp = ServerIp + 'api/user/messagetab/reserve';
//ㅈㄱ변수
var tagFloorID = 245;

var column = 90;
var row = 80;
var column2 = 80;
var row2 = 90;

let cur_x, cur_y;
const maze1 = Array.from(new Array(row2), () => new Array(column2).fill(0));
for (var i = 0; i < row2; i++) {
  for (var j = 0; j < column2; j++) maze1[i][j] = 1;
}
//공학관
for (var i = 20; i < 81; i++) for (var j = 27; j < 28; j++) maze1[i][j] = 0;
for (var i = 79; i < 81; i++) for (var j = 27; j < 61; j++) maze1[i][j] = 0;

const maze2 = Array.from(new Array(row), () => new Array(column).fill(0));
for (var i = 0; i < row; i++) {
  for (var j = 0; j < column; j++) maze2[i][j] = 1;
}
//2층
for (var i = 19; i < 20; i++) for (var j = 5; j < 34; j++) maze2[i][j] = 0;
for (var i = 19; i < 33; i++) for (var j = 5; j < 6; j++) maze2[i][j] = 0;
for (var i = 19; i < 33; i++) for (var j = 33; j < 34; j++) maze2[i][j] = 0;
for (var i = 32; i < 33; i++) for (var j = 5; j < 51; j++) maze2[i][j] = 0;
for (var i = 32; i < 41; i++) for (var j = 50; j < 51; j++) maze2[i][j] = 0;
for (var i = 40; i < 41; i++) for (var j = 50; j < 59; j++) maze2[i][j] = 0;
for (var i = 36; i < 41; i++) for (var j = 58; j < 59; j++) maze2[i][j] = 0;
for (var i = 36; i < 37; i++) for (var j = 58; j < 68; j++) maze2[i][j] = 0;

const maze3 = Array.from(new Array(row), () => new Array(column).fill(0));
for (var i = 0; i < row; i++) {
  for (var j = 0; j < column; j++) maze3[i][j] = 1;
}
//3층 장애물
for (var i = 18; i < 19; i++) for (var j = 0; j < 41; j++) maze3[i][j] = 0;
for (var i = 18; i < 33; i++) for (var j = 41; j < 42; j++) maze3[i][j] = 0;
for (var i = 33; i < 34; i++) for (var j = 41; j < 52; j++) maze3[i][j] = 0;
for (var i = 33; i < 40; i++) for (var j = 52; j < 53; j++) maze3[i][j] = 0;
for (var i = 39; i < 40; i++) for (var j = 52; j < 61; j++) maze3[i][j] = 0;
for (var i = 39; i < 63; i++) for (var j = 61; j < 62; j++) maze3[i][j] = 0;

const maze4 = Array.from(new Array(row), () => new Array(column).fill(0));
for (var i = 0; i < row; i++) {
  for (var j = 0; j < column; j++) maze4[i][j] = 1;
}
//4층 장애물
for (var i = 22; i < 33; i++) for (var j = 83; j < 84; j++) maze4[i][j] = 0;
for (var i = 32; i < 33; i++) for (var j = 57; j < 84; j++) maze4[i][j] = 0;
for (var i = 32; i < 79; i++) for (var j = 57; j < 58; j++) maze4[i][j] = 0; //직선 코스
for (var i = 63; i < 64; i++) for (var j = 57; j < 65; j++) maze4[i][j] = 0; //우측
for (var i = 65; i < 66; i++) for (var j = 48; j < 58; j++) maze4[i][j] = 0; //좌측

//ListOfFloorPlanDrawer에서 층수를 받아옴 ㅇㅅ
import {currFloor} from '../Components/DrawerScreens/ListOfFloorPlanDrawer';

export default function InDoorNavigation({navigation}) {
  const [setX, setSetX] = useState(40);
  const [setY, setSetY] = useState(80);
  const [floorId, setFloorId] = useState('');
  const [responseTagId, setResponseTagId] = useState(343);
  const [selectedTagId, setSelectedTagId] = useState();
  const path_maze2 = Gpath;
  const [floorPlanName, setFloorPlanName] = useState('');
  const [floor, setFloor] = useState('');
  const [pageLoading, setPageLoading] = useState(true); // pageLoader
  const [selectedAreaId, setSelectedAreaId] = useState([]);
  const [image, setImage] = useState(require('../../Image/Floor/1Floor.png'));
  const [indoorCurrentAxis, setIndoorCurrentAxis] = useState({});
  const [indoorSourcePoint, setIndoorSourcePoint] = useState('현재위치');
  const [indoorSourceSequence, setIndoorSourceSequence] = useState({});
  const [indoorSourcePointAxis, setIndoorSourcePointAxis] = useState({});
  const [indoorSourceModalVisible, setIndoorSourceModalVisible] =
    useState(false);
  const [indoorDestPoint, setIndoorDestPoint] = useState('도착지');
  const [indoorDestSequence, setIndoorDestSequence] = useState({});
  const [indoorDestPointAxis, setIndoorDestPointAxis] = useState({});
  const [indoorDestModalVisible, setIndoorDestModalVisible] = useState(false);
  const [indoorRecordedPlace, setIndoorRecordedPlace] = useState('-');
  const [isSearchIconPress, setIsSearchIconPress] = useState(false);
  const [position, setPosition] = useState(0);
  const [wrongFlag, setWrongFlag] = useState(true);
  const [isDirectNavigation, setIsDirectNavigation] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [startPoint, setStartPoint] = useState({
    x1: SCREEN_WIDTH * 0.55,
    y1: SCREEN_HEIGHT * 0.2,
  });
  const [endPoint, setEndPoint] = useState({
    x: SCREEN_WIDTH * 0.681396484375,
    y: SCREEN_HEIGHT * 0.5613117548771677,
  });
  const [wrongPath, setWrongPath] = useState({
    x1: SCREEN_WIDTH * 0.28887938570093225,
    y1: SCREEN_HEIGHT * 0.25,
  });

  const [DoSourceNavigation, setDoSourceNavigation] = useState(true); // 소미
  const [DoDestNavigation, setDoDestNavigation] = useState(true); // 소미
  const [isJump, setIsJump] = useState(false); // 소미
  const [floorChanged, setfloorChanged] = useState(0); // 소미
  const [index, setIndex] = useState(0);

  const [showPath, setShowPath] = useState(false); //수정 ㅁㅅ
  const [destFloor, setDestFloor] = useState();
  const [checkRightStart, setCheckRightStart] = useState(0);

  //1층
  //UWB x
  const x_calibration = number => {
    return parseInt(81 - number * 2.5);
  };

  //UWB y
  const y_calibration = number => {
    return parseInt(number * 3.4 + 27);
  };




  //18 38
  const y_check = (y, x) => {
    if (maze1[y][x] == 0) {
      return x;
    } else if (maze1[y][x] == 1) {
      let x1 = x;
      let y1 = y;
      for (let i = 0; i < 6; i++) {
        if (x >= 80) break;
        for (let j = -6; j < 6; j++) {
          if (0 <= y1 - 3 && y1 + 4 < 90) {
            if (maze1[y1 + j][x] == 0) {
              return x;
            }
          }
        }
        x++;
      }
      x = x1;
      for (let i = 0; i < 6; i++) {
        if (x == -1) break;
        for (let j = -6; j < 6; j++) {
          if (0 <= y1 - 3 && y1 + 4 < 90) {
            if (maze1[y1 + j][x] == 0) {
              return x;
            }
          }
        }
        x--;
      }

      for (let i = 0; i < 6; i++) {
        if (y >= 80) break;
        for (let j = -6; j < 6; j++) {
          if (0 <= x1 - 6 && x1 + 5 < 80) {
            if (maze1[y][x1 + j] == 0) {
              return x1 + j;
            }
          }
        }
        y++;
      }

      y = y1;
      for (let i = 0; i < 6; i++) {
        if (y == -1) break;
        for (let j = -6; j < 6; j++) {
          if (0 <= x1 - 6 && x1 + 5 < 80) {
            if (maze1[y][x1 + j] == 0) {
              return x1 + j;
            }
          }
        }
        y--;
        return x1;
      }
    }
  };
  //18 38
  const x_check = (y, x) => {
    if (maze1[y][x] == 0) {
      return y;
    }

    if (maze1[y][x] == 1) {
      let x1 = x;
      let y1 = y;
      for (let i = 0; i < 6; i++) {
        if (x >= 80) break;
        for (let j = -6; j < 6; j++) {
          if (0 <= y1 - 3 && y1 + 4 < 90) {
            if (maze1[y1 + j][x] == 0) {
              return y1 + j;
            }
          }
        }
      }
      x = x1;
      for (let i = 0; i < 6; i++) {
        if (x <= -1) break;
        for (let j = -6; j < 6; j++) {
          if (0 <= y1 - 3 && y1 + 4 < 90) {
            if (maze1[y1 + j][x] == 0) {
              return y1 + j;
            }
          }
        }
      }

      for (let i = 0; i < 6; i++) {
        if (y >= 90) break;
        for (let j = -6; j < 6; j++) {
          if (0 <= x1 - 6 && x1 + 5 < 80) {
            if (maze1[y][x1 + j] == 0) {
              return y1;
            }
          }
        }
      }
      y = y1;
      for (let i = 0; i < 6; i++) {
        if (y == -1) break;
        for (let j = -6; j < 6; j++) {
          if (0 <= x1 - 6 && x1 + 5 < 98) {
            if (maze1[y][x1 + j] == 0) {
              return y1;
            }
          }
        }
      }
      return y1;
    }
  };


  const [lineIndex, setLineIndex] = useState(0);

  //map그리기
  const numRows = 7;
  const numColumns = 9;
  const initialValue = 0;
  // const maze = Array.from({length: numRows}, () =>
  //   Array(numColumns).fill(initialValue),
  // );
  const path_maze = [
    [0.55, 0.6],
    [0.6, 0.6],
  ];

  const [path, setPath] = useState([
    {
      x1: 0.5,
      y1: 0.6,
      x2: 0.6,
      y2: 0.6,
    },
  ]);

  const handlePress = e => {
    // console.log('x : ' + e.nativeEvent.pageX / SCREEN_WIDTH);
    // console.log('y : ' + e.nativeEvent.pageY / SCREEN_HEIGHT);
  };

  //speakText
  Tts.setDefaultLanguage('ko-KR');

  const speakText = message => {
    console.log(message);
    Tts.stop();
    Tts.getInitStatus().then(
      () => {
        Tts.speak(message);
      },
      err => {
        if (err.code === 'no_engine') {
          Tts.requestInstallEngine();
        }
      },
    );
  };

  const movePosition = () => {
    if (position < path.length) {
      setPosition(position + 1);
      setStartPoint({
        x1: SCREEN_WIDTH * path[position].x1,
        y1: SCREEN_HEIGHT * 0.6 * path[position].y1,
      });
      speakText(path[position].message);
    } else if (wrongFlag) {
      ToastAndroid.show('목적지에 도착했습니다.', ToastAndroid.SHORT);
      speakText('목적지에 도착했습니다.');
    }
  };

  const wrongPosition = () => {
    setWrongFlag(false);
    setStartPoint(wrongPath);
    speakText('잘못된 경로입니다.');
    ToastAndroid.show('잘못된 경로입니다.', ToastAndroid.SHORT);
  };

  const testLoc = [
    {x: 55.08, y: 1},
    {x: 74.08, y: 20},
    {x: 90.58, y: 20},
    {x: 90.58, y: 34},
    {x: 105.58, y: 34},
    {x: 105.58, y: 66.5},
  ];

  const testPress = () => {
    setIndoorCurrentAxis({x: testLoc[lineIndex].x, y: testLoc[lineIndex].y});
    console.log('Press!!');
    console.log(indoorCurrentAxis);
    console.log(lineIndex);
  };

 
  let y_current3;
  let x_current3;
  let y_current2;
  let x_current2;
  let y_current;
  let x_current;
  let current_x, current_y;
  //장소 정보
  const placeList = {
        245: [
      {
        sequence: 11,
        location: '425호',
        x: 27,
        y: 26,
        floor: 1,
      },
      {
        sequence: 12,
        location: '424호',
        x: 27,
        y: 33,
        floor: 1,
      },
      {
        sequence: 13,
        location: '423호',
        x: 26,
        y: 39,
        floor: 1,
      },
      {
        sequence: 14,
        location: '422호',
        x: 27,
        y: 48,
        floor: 1,
      },
      {
        sequence: 15,
        location: '421호',
        x: 27,
        y: 55,
        floor: 1,
      },
      {
        sequence: 16,
        location: '420호',
        x: 27,
        y: 63,
        floor: 1,
      },
      {
        sequence: 17,
        location: '419호',
        x: 27,
        y: 71,
        floor: 1,
      },
      {
        sequence: 18,
        location: '418호',
        x: 27,
        y: 80,
        floor: 1,
      },
      {
        sequence: 19,
        location: '엘베',
        x: 40,
        y: 79,
        floor: 1,
      }
    ],
    246: [
      {
        sequence: 21,
        location: '이비인후과',
        x: 7,
        y: 19,
        floor: 2,
      },
    ],

    247: [
      {
        sequence: 39,
        location: '재활의학과',
        x: 60,
        y: 39,
        floor: 3,
      },
    ],
    252: [
      {
        sequence: 45,
        location: '카페',
        x: 64, //수정
        y: 63,
      },
    ],
    253: [
      {
        sequence: 51,
        location: '입구',
        x: 6,
        y: 18,
      },
    ],
  };

  const imagePath = {
    245: require('../../Image/Floor/aiMap.png'),
    246: require('../../Image/Floor/246.png'),
    247: require('../../Image/Floor/247.png'),
    252: require('../../Image/Floor/252.png'),
    253: require('../../Image/Floor/253.png'),
  };

  const floorName = {
    245: 'AI 공학관',
    246: '2층',
    247: '3층',
    252: '개신문화관 지하',
    253: '개신문화관 1층',
  };

  const [icon, setIcon] = useState('245');

  const getFloorPlanInfo = async () => {
    await AsyncStorage.getItem('IMG_ID', (err, result) => {
      let url =
        'http://demo.sbplatform.co.kr/admin/setting/map/image/' + result;
      //setURL(url);
      if (result == null) {
        result = '245';
      }
      setIcon(result);
    });
  };

  const setFloorInfo = async () => {
    console.log(AsyncStorage.getItem('floor'));
    await AsyncStorage.getItem('floor', (err, result) => {
      setFloor(result);
      // console.log(result);
      setPageLoading(false);
    });
  };

  const mapperAreaClickHandler = async (item, idx, event) => {
    console.log('click');
    const currentSelectedAreaId = selectedAreaId;
    if (Array.isArray(currentSelectedAreaId)) {
      const indexInState = currentSelectedAreaId.indexOf(item.id);
      if (indexInState !== -1) {
        console.log('Removing id', item.id);
        setSelectedAreaId([
          ...currentSelectedAreaId.slice(0, indexInState),
          ...currentSelectedAreaId.slice(indexInState + 1),
        ]);
      } else {
        alert(`Clicked Item Id: ${item.id}`);
        console.log('Setting Id', item.id);
        setSelectedAreaId([...currentSelectedAreaId, item.id]);
      }
    } else {
      if (item.id === currentSelectedAreaId) {
        setSelectedAreaId(null);
      } else {
        setSelectedAreaId(item.id);
      }
    }
  };

  const fetchData = async () => {
    try {
      const url = 'http://210.95.145.226:7000/indoorPos/selectPosInfo';
      const headers = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      };
      const data = {
        tagId: responseTagId,
      };

      const response = await axios.post(url, data, {headers});

      setResponseTagId(response.data.tagId);
      return response;
      // return {
      //   data: {
      //     bizId: 'B00025',
      //     endDt: null,
      //     indoorSeq: '126738',
      //     mapId: '245',
      //     mappingId: '2',
      //     message: 'ok',
      //     posX: '70',
      //     posY: '20',
      //     posZ: '1.00',
      //     regDt: '2023-06-16 21:04:28',
      //     result: '200',
      //     startDt: null,
      //     tagId: '342',
      //     userId: '399',
      //   },
      // };
      //console.log(response.data);
    } catch (error) {
      //console.error(error);
    }
  };

  const getCurrentLocation = () => {
    fetchData().then(response => {
      AsyncStorage.setItem('IMG_ID', response.data.mapId);
      // 현재 위치 좌표 저장
      setIndoorCurrentAxis({
        x: parseFloat(response.data.posX),
        y: parseFloat(response.data.posY),
      });
      // 출발지를 현재 위치로 저장
      handleStartToMyLocation({
        x: parseFloat(response.data.posX),
        y: parseFloat(response.data.posY),
      });
      getFloorPlanInfo();
    });
  };
  //interval마다 계속 돌기 ㅈㄱ

  // useFocusEffect(
  //   React.useCallback(() => {
  //     console.log('스크린 들어옴');
  //     const interval = setInterval(() => {
  //       fetchData().then(response => {
  //         tagFloorID = response.data.mapId;
  //         // setIcon(response.data.mapId);
  //         // setIcon(response.data.mapId);
  //         // setTagFloorID(response.data.mapId); //수정
  //         // 현재 위치 좌표 저장
  //         if (
  //           response.data.posX != indoorCurrentAxis.x ||
  //           response.data.posY != indoorCurrentAxis.y
  //         ) {
  //           setIndoorCurrentAxis({
  //             x: parseFloat(response.data.posX),
  //             y: parseFloat(response.data.posY),
  //           });
  //           // console.log('x:', indoorCurrentAxis.x);
  //           // console.log('y:', indoorCurrentAxis.y);
  //         }
  //       });
  //     }, 1000);
  //     return () => {
  //       // Do something when the screen is unfocused
  //       // Useful for cleanup functions
  //       console.log('스크린 나감');
  //       clearInterval(interval);
  //     };
  //   }, []),
  // );

  //fb
  // componentDidMount(){
  //   //const reference = database().ref('/Tag');
  // }

  useEffect(()=>{
    const reference = database().ref('/data');
    const interval = setInterval(() => {
      reference.on('value', snapshot => {
        const data = snapshot.val();
        // console.log('User data: ', data);
  
        if (data) {
          const { mapId, posX, posY, tagId } = data;
    
          // 이제 각각의 값을 사용하거나 처리할 수 있습니다.
          // console.log('mapid:', mapId);
          // console.log('x:', posX);
          // console.log('y:', posY);
          // console.log('tagid:', tagId);
  
          setIndoorCurrentAxis({
            x: parseFloat(posX),
            y: parseFloat(posY),
          });
  
        }
        
      });
    }, 1000);
    return () => clearInterval(interval);
  })


  //수정3
  useEffect(() => {
    if (indoorCurrentAxis.x != null && indoorCurrentAxis.y != null) {
      //수정2
      if (tagFloorID == '245') {
        // console.log('245 루프 들어옴' + tagFloorID);
        // (cur_x = x_check(y_calibration(indoorCurrentAxis.y), x_calibration(indoorCurrentAxis.x))),
        // (cur_y = y_check(y_calibration(indoorCurrentAxis.y), x_calibration(indoorCurrentAxis.x)));
        (cur_x = y_calibration(indoorCurrentAxis.y)),
        (cur_y = x_calibration(indoorCurrentAxis.x));
        // console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
        // console.log('245 그랩' + x_calibration(indoorCurrentAxis.x) + ' ' + y_calibration(indoorCurrentAxis.y));
        // console.log('245 루프 나감' + tagFloorID);
      }
    }
  }, [indoorCurrentAxis]);

  useEffect(() => {
    if (dispath !== undefined && lineIndex < dispath.length) {
      if (indoorCurrentAxis.x != null && indoorCurrentAxis.y != null) {
        // let currentX = indoorCurrentAxis.x * 0.0055 * SCREEN_WIDTH + 0.8;
        // let currentY = indoorCurrentAxis.y * 0.01 * SCREEN_HEIGHT * 0.4 + 65;
        let currentX, currentY;
        if (icon == '252') {
          currentY = x_check(
            y_calibration(indoorCurrentAxis.y),
            x_calibration(indoorCurrentAxis.x),
          );
          currentX = y_check(
            y_calibration(indoorCurrentAxis.y),
            x_calibration(indoorCurrentAxis.x),
          );
        } else {
          currentY = 0;
          currentX = 0;
        }
        let dispathX = dispath[lineIndex].x;
        let dispathY = dispath[lineIndex].y;
        const distance = Math.sqrt(
          Math.pow(dispathX - cur_x, 2) + Math.pow(dispathY - cur_y, 2),
        );

        console.log('두 점 사이의 거리:', distance);

        if (isSearchIconPress && lineIndex == 0 && distance > 2.5 && checkRightStart == 0 ) {
          speakText(
            '현 위치가 출발지가 아닙니다. 지도를 참조하여 출발지로 이동해 주시기 바랍니다.',
          );
          setCheckRightStart(1);
        } else {
          if (isSearchIconPress && distance <= 2.5) {
            speakText(dispath[lineIndex].message);
            if (dispath[lineIndex].message == '목적지 입니다.') {
              setShowPath(false);
              if (isJump == true) {
                alert('엘리베이터를 이용해주세요.');
              } else {
                setIsJump(false);
              }
              setLineIndex(0);
              return;
            }
            setLineIndex(lineIndex + 1);
          }
        }
      }
    }
  }, [indoorCurrentAxis]);

  useEffect(() => {
    console.log('useEffectIcon', icon);
    setIndoorSourcePoint('현재위치');
    setIndoorSourceSequence({});
    setIndoorSourcePointAxis({});
    setIndoorDestPoint('도착지');
    setIndoorDestSequence({});
    setIndoorDestPointAxis({});
    setIndoorRecordedPlace('-');
    setShowPath(false); //수정 ㅁㅅ
  }, [icon]);

  // useEffect(() => {
  //   // 현재 위치 불러오기
  //   getCurrentLocation();
  // }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('state', () => {
      getFloorPlanInfo();
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setFloorInfo();
      setIsSearchIconPress(false);
    });
    return unsubscribe;
  }, [navigation]);

  //Voice Record
  const [isIndoorRecord, setIsIndoorRecord] = useState(false);
  const onSpeechResults = e => {
    let sResult = e.value[0];
    console.log(sResult);
    console.log(indoorRecordedPlace);
    setIndoorRecordedPlace(sResult);
    console.log(indoorRecordedPlace);
  };
  const onSpeechStart = () => {
    setIsIndoorRecord(true);
  };
  const onSpeechEnd = () => {
    setIsIndoorRecord(false);
    setShowPath(true);
    Voice.stop();
    verifyLocation;
  };
  const onRecordVoice = () => {
    setIsIndoorRecord(true);
    Voice.start('ko-KR');
  };

  useEffect(() => {
    Voice.destroy().then(Voice.removeAllListeners);
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechEnd = onSpeechEnd;
    setIsIndoorRecord(false);
  }, []);

  useEffect(() => {
    if (indoorSourceModalVisible) {
      setIndoorSourcePoint(indoorRecordedPlace);
      if (verifyLocation(indoorRecordedPlace)) {
        handleStartLocationPress(getLocationInfo(indoorRecordedPlace));
      } else {
        setDoSourceNavigation(false);
      }
      onSpeechEnd();
    }
  }, [indoorRecordedPlace]);

  useEffect(() => {
    if (indoorDestModalVisible) {
      setIndoorDestPoint(indoorRecordedPlace);
      if (verifyLocation(indoorRecordedPlace)) {
        handleDestLocationPress(getLocationInfo(indoorRecordedPlace));
      } else {
        setDoDestNavigation(false);
      }
      onSpeechEnd();
    }
  }, [indoorRecordedPlace]);

  useEffect(() => {
    if (isDirectNavigation) {
      if (verifyLocation(indoorRecordedPlace)) {
        handleDestLocationPress(getLocationInfo(indoorRecordedPlace));
      } else {
        setDoDestNavigation(false);
      }
    }
  }, [indoorRecordedPlace]);

  useEffect(() => {
    if (indoorDestModalVisible) {
      setIsSearchIconPress(false);
    }
  }, [indoorDestModalVisible]);

  useEffect(() => {
    if (indoorSourceModalVisible) {
      setIsSearchIconPress(false);
    }
  }, [indoorSourceModalVisible]);

  const [exitApp, setExitApp] = useState(0);
  const showToast = () => {
    // ToastAndroid.show('한 번 더 누르시면 종료됩니다.', ToastAndroid.SHORT);
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

  useEffect(() => {
    if (isDirectNavigation) {
      setIsDirectNavigation(false);
      if (verifyLocation(indoorDestPoint)) {
        verifyLocation;
        make_maze(
          indoorSourcePointAxis.x,
          indoorSourcePointAxis.y,
          indoorDestPointAxis.x,
          indoorDestPointAxis.y,
          icon,
        );

        const transformedData = Gpath.map((item, index) => {
          if (index === Gpath.length - 1) {
            return {
              x1: Gpath[index].x / 100,
              y1: Gpath[index].y / 100,
              x2: null,
              y2: null,
            };
          }
          return {
            x1: Gpath[index].x / 100,
            y1: Gpath[index].y / 100,
            x2: Gpath[index + 1].x / 100,
            y2: Gpath[index + 1].y / 100,
          };
        });
        setIsSearchIconPress(true);
      } else {
        alert('잘못된 경로입니다.');
      }
    }
  }, [indoorDestPointAxis]);

  //수정3
  let source_x, source_y;
  // 현재 위치를 출발지로 설정하는 코드
  const handleStartToMyLocation = place => {
    // console.log('현재 위치를 출발지로 설정', place);
    setIndoorSourcePoint('내 위치');
    setIndoorSourceSequence(0);

    source_x = cur_y;
    source_y = cur_x;
    setIndoorSourcePointAxis({x: source_x, y: source_y});
    setIndoorCurrentAxis({x: place.x, y: place.y});
  };

  //출발지 클릭
  const handleStartLocationPress = place => {
    setCheckRightStart(0);
    console.log(place);
    setIndoorSourcePoint(place.location);
    setIndoorSourceSequence(place.sequence);
    setIndoorSourcePointAxis({x: place.x, y: place.y});
    current_x = place.x;
    current_y = place.y;
    setCurrentLocation(current_x, current_y);
  };

  //도착지 클릭
  const handleDestLocationPress = place => {
    setCheckRightStart(0);
    console.log(place);
    if (indoorSourcePoint == '현재위치') {
      handleStartToMyLocation(indoorCurrentAxis);
    }

    setIndoorDestPoint(place.location);
    setFloorId(place.floor);
    if (findFloor(place.location) != icon) {
      //층간이동 여부 확인
      setIsJump(true);
      setfloorChanged(findFloor(place.location));

      // 출발지 1층
      if (icon == '245' && findFloor(place.location) == 247) {
        //현재 층이 1층, 도착지가 3층
        const middlePoint = getLocationInfo('1층중앙엘리베이터');
        //setIndoorDestPoint(middlePoint.location);
        setIndoorDestSequence(middlePoint.sequence);
        setIndoorDestPointAxis({x: middlePoint.x, y: middlePoint.y});
        alert('목적지가 3층입니다. 엘리베이터로 안내합니다.');
      } else if (icon == '245' && findFloor(place.location) == 246) {
        //현재 층이 1층, 도착지가 2층
        const middlePoint = getLocationInfo('1층중앙엘리베이터');
        //setIndoorDestPoint(middlePoint.location);
        setIndoorDestSequence(middlePoint.sequence);
        setIndoorDestPointAxis({x: middlePoint.x, y: middlePoint.y});
        alert('목적지가 2층입니다. 엘리베이터로 안내합니다.');
      }

      //출발지 2층
      else if (icon == '246' && findFloor(place.location) == 245) {
        //현재 층이 2층, 도착지가 1층
        const middlePoint = getLocationInfo('2층중앙엘리베이터');
        //setIndoorDestPoint(middlePoint.location);
        setIndoorDestSequence(middlePoint.sequence);
        setIndoorDestPointAxis({x: middlePoint.x, y: middlePoint.y});
        alert('목적지가 1층입니다. 엘리베이터로 안내합니다.');
      } else if (icon == '246' && findFloor(place.location) == 247) {
        //현재 층이 2층, 도착지가 3층
        const middlePoint = getLocationInfo('2층중앙엘리베이터');
        //setIndoorDestPoint(middlePoint.location);
        setIndoorDestSequence(middlePoint.sequence);
        setIndoorDestPointAxis({x: middlePoint.x, y: middlePoint.y});
        alert('목적지가 3층입니다. 엘리베이터로 안내합니다.');
      }

      // 출발지 3층
      else if (icon == '247' && findFloor(place.location) == 245) {
        //현재 층이 3층, 도착지가 1층
        const middlePoint = getLocationInfo('3층엘리베이터');
        //setIndoorDestPoint(middlePoint.location);
        setIndoorDestSequence(middlePoint.sequence);
        setIndoorDestPointAxis({x: middlePoint.x, y: middlePoint.y});
        alert('목적지가 1층입니다. 엘리베이터로 안내합니다.');
      } else if (icon == '247' && findFloor(place.location) == 246) {
        //현재 층이 3층, 도착지가 2층
        const middlePoint = getLocationInfo('3층엘리베이터');
        //setIndoorDestPoint(middlePoint.location);
        setIndoorDestSequence(middlePoint.sequence);
        setIndoorDestPointAxis({x: middlePoint.x, y: middlePoint.y});
        alert('목적지가 2층입니다. 엘리베이터로 안내합니다.');
      }
    } else {
      setIndoorDestSequence(place.sequence);
      setIndoorDestPointAxis({x: place.x, y: place.y});
    }

    //x, y 좌표 저장해줘야댐
  };

  const directNavigationHandler = () => {
    setIsIndoorRecord(true);
    Voice.start('ko-KR');
    // 현재위치를 받아오는데 오류가 나서 출발지를 서관엘리베이터로 강제함.
    // TODO 실제로는 아래의 코드를 활용해야함.
    // getCurrentLocation()
    handleStartToMyLocation(indoorCurrentAxis);
    setIsDirectNavigation(true);
  };

  const verifyLocation = locationName => {
    if (locationName === '현재위치') {
      return true;
    }
    const locations = Object.values(placeList).flat();
    if (locations) {
      const filteredPlaces = locations.filter(place => {
        const placeLocation = place.location.replace(/\s/g, '').toLowerCase();
        const inputLocation = locationName.replace(/\s/g, '').toLowerCase();
        return placeLocation === inputLocation;
      });
      return filteredPlaces.length > 0;
    }
    return null;
  };

  const getLocationInfo = locationName => {
    const locations = Object.values(placeList).flat();
    if (locations) {
      const filteredPlaces = locations.filter(place => {
        const placeLocation = place.location.replace(/\s/g, '').toLowerCase();
        const inputLocation = locationName.replace(/\s/g, '').toLowerCase();
        return placeLocation === inputLocation;
      });
      return filteredPlaces[0];
    }
    return null;
  };

  // const findVoiceLocation = (data, location, floor) => {
  //   const locations = data[floor];
  //   if (locations) {
  //     for (const item of locations) {
  //       if (item.location === location) {
  //         return item;
  //       }
  //     }
  //   }
  //   return null; // 해당 위치를 찾지 못한 경우 null 반환
  // };

  function findFloor(targetDest) {
    // const targetLocation = "3층엘리베이터";

    for (const key in placeList) {
      const place = placeList[key];
      for (let i = 0; i < place.length; i++) {
        if (place[i].location === targetDest) {
          return key; // 해당 장소가 속한 번호 반환
        }
      }
    }

    return -1; // 해당 장소를 찾지 못한 경우 -1 반환
  }

  useEffect(() => {
    if (isJump == true && icon == floorChanged) {
      handleStartToMyLocation(indoorCurrentAxis);
      handleDestLocationPress(getLocationInfo(indoorDestPoint));
      alert('이어서 길안내를 시작합니다.');
    }
  }, [icon]);

  //태그 아이디 선택 관련
  const selectOptions = [
    {label: '태그 ID', value: ''},
    {label: '342', value: 342},
    {label: '343', value: 343},
    {label: '344', value: 344},
    {label: '345', value: 345},
    {label: '346', value: 346},
    {label: '347', value: 347},
    {label: '348', value: 348},
    {label: '349', value: 349},
    {label: '350', value: 350},
    {label: '351', value: 351},
    {label: '352', value: 352},
    {label: '353', value: 353},
    {label: '354', value: 354},
    {label: '355', value: 355},
  ];

  const [selectedOption, setSelectedOption] = useState('');

  const handleSelectChange = value => {
    setSelectedOption(value);
    setSelectedTagId(value);
  };

  //초기화 버튼 클릭 이벤트
  const resetClick = () => {
    setShowPath(false);
    setIsJump(false);
    setIndoorSourcePoint('현재위치');
    handleStartToMyLocation(indoorCurrentAxis); //윤서초기화
    setIndoorDestPoint('도착지');
    setCheckRightStart(0);
    setIsSearchIconPress(false);
  };

  if (!pageLoading) {
    return (
      <View style={styles.body}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={indoorSourceModalVisible}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: 'white',
                }}>
                <TouchableOpacity
                  onPress={() => {
                    onSpeechEnd();
                    setIndoorSourceModalVisible(false);
                  }}>
                  <Icon name="arrow-back-ios" color={'gray'} size={22} />
                </TouchableOpacity>
                <TextInput
                  value={indoorSourcePoint}
                  placeholder="장소를 검색"
                  placeholderTextColor="gray"
                  onChangeText={indoorSourcePoint =>
                    setIndoorSourcePoint(indoorSourcePoint)
                  }
                  style={styles.modalSearchBar}
                />
                {isIndoorRecord ? (
                  <BarIndicator color="#0eb5e9" size={22} count={3} />
                ) : (
                  <Icon
                    name="mic"
                    color={'gray'}
                    size={22}
                    onPress={onRecordVoice}
                  />
                )}
              </View>
              <View style={styles.myLocationView}>
                <Icon name="my-location" color={'#7eb7eaff'} size={20} />
                <TouchableOpacity
                  onPress={() => {
                    handleStartToMyLocation(indoorCurrentAxis);
                  }}>
                  <Text style={styles.myLocationText}>내 위치</Text>
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.locationList}>
                {placeList[icon].map(place => (
                  <TouchableOpacity
                    key={place.sequence}
                    style={styles.placeContainer}
                    onPress={() => handleStartLocationPress(place)}>
                    <Text style={styles.locationText}>{place.location}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={indoorDestModalVisible}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: 'white',
                }}>
                <TouchableOpacity
                  onPress={() => {
                    onSpeechEnd();
                    setIndoorDestModalVisible(false);
                  }}>
                  <Icon name="arrow-back-ios" color={'gray'} size={22} />
                </TouchableOpacity>
                {/*도착지 처리 관련 부분*/}
                <TextInput
                  value={indoorDestPoint}
                  placeholder="장소를 검색"
                  placeholderTextColor="gray"
                  onChangeText={indoorDestPoint =>
                    setIndoorDestPoint(indoorDestPoint)
                  }
                  multiline={true}
                  style={styles.modalSearchBar}
                />
                {isIndoorRecord ? (
                  <BarIndicator color="#0eb5e9" size={22} count={3} />
                ) : (
                  <Icon
                    name="mic"
                    color={'gray'}
                    size={22}
                    onPress={onRecordVoice}
                  />
                )}
              </View>
              {/*도착지list수정*/}
              
              <ScrollView style={styles.locationList}>
                {icon === '252' || icon === '253'
                  ? placeList[parseInt(icon)].map(place => (
                      <TouchableOpacity
                        key={place.sequence}
                        style={styles.placeContainer}
                        onPress={() => handleDestLocationPress(place)}>
                        <Text style={styles.locationText}>
                          {place.location}
                        </Text>
                      </TouchableOpacity>
                    ))
                  : Object.values(placeList)
                      .slice(0, 1)
                      .flatMap(placeArray =>
                        placeArray.map(place => (
                          <TouchableOpacity
                            key={place.sequence}
                            style={styles.placeContainer}
                            onPress={() => handleDestLocationPress(place)}>
                            <Text style={styles.locationText}>
                              {place.location}
                            </Text>
                          </TouchableOpacity>
                        )),
                      )}
              </ScrollView>
            </View>
          </View>
        </Modal>
        <StatusBar backgroundColor="transparent" translucent={true} />
        <View
          style={[
            styles.rowSquareBox,
            {
              height: SCREEN_HEIGHT * 0.15,
            },
          ]}>
          <TouchableOpacity onPress={() => testPress()}>
            <Text style={styles.headText}>{floorName[icon]}</Text>
          </TouchableOpacity>
          <View style={styles.rowbox}>
            <TouchableOpacity
              style={{flexDirection: 'row', justifyContent: 'center'}}
              onPress={() => {
                setIndoorSourceModalVisible(true);
              }}>
              <Text style={{marginTop: '3%', color: 'black'}}>
                {indoorSourcePoint}
              </Text>
              <Icon name="mic" color={'black'} size={22} />
            </TouchableOpacity>
            <TouchableOpacity
              style={{flexDirection: 'row', justifyContent: 'center'}}
              onPress={() => {
                setIndoorDestModalVisible(true);
              }}>
              <Text style={{marginTop: '3%', color: 'black'}}>
                {indoorDestPoint}
              </Text>
              <Icon name="mic" color={'black'} size={22} />
            </TouchableOpacity>
            {/*돋보기 부분*/}
            <TouchableOpacity
              style={styles.searchIcon}
              onPress={() => {
                // console.log(indoorSourcePoint);
                if (!DoSourceNavigation) {
                  alert('잘못된 출발지입니다.');
                  setDoSourceNavigation(true);
                } else if (!DoDestNavigation) {
                  alert('잘못된 도착지입니다.');
                  setDoDestNavigation(true);
                } else if (
                  (indoorSourcePoint == '현재위치' ||
                    indoorDestPoint == '도착지') &&
                  isJump == false
                ) {
                  alert('출발지 및 도착지를 입력해주세요.');
                  setDoDestNavigation(true); //윤서초기화
                } else {
                  setShowPath(true); //수정 ㅁㅅ
                  // if(indoorSourcePoint == '문화회관화장실' && indoorDestPoint == '카페')
                  // {
                  //   Gpath = [{"x": 64, "y": 63}, {"x": 63, "y": 63}, {"x": 62, "y": 63}, {"x": 61, "y": 63},{"x": 60, "y": 63}, {"x": 59, "y": 63}, {"x": 58, "y": 63}, {"x": 57, "y": 63}, {"x": 57, "y": 62}, {"x": 57, "y": 61}, {"x": 57, "y": 60}, {"x": 57, "y": 59}, {"x": 57, "y": 58}, {"x": 57, "y": 57}, {"x": 57, "y": 56}, {"x": 57, "y": 55}, {"x": 57, "y": 54}, {"x": 57, "y": 53}, {"x": 57, "y": 52}, {"x": 57, "y": 51}, {"x": 57, "y": 50}, {"x": 57, "y": 49}, {"x": 57, "y": 48}, {"x": 57, "y": 47}, {"x": 57, "y": 46}, {"x": 57, "y": 45}, {"x": 57, "y": 44}, {"x": 57, "y": 43}, {"x": 57, "y": 42}, {"x": 57, "y": 41}, {"x": 57, "y": 40}, {"x": 57, "y": 39}, {"x": 57, "y": 38}, {"x": 57, "y": 37}, {"x": 57, "y": 36}, {"x": 57, "y": 35}, {"x": 57, "y": 34}, {"x": 57, "y": 33}, {"x": 57, "y": 32}, {"x": 58, "y": 32}, {"x": 59, "y": 32}, {"x": 60, "y": 32}, {"x": 61, "y": 32}, {"x": 62, "y": 32}, {"x": 63, "y": 32}, {"x": 64, "y": 32}, {"x": 65, "y": 32}, {"x": 66, "y": 32}, {"x": 67, "y": 32}, {"x": 68, "y": 32}, {"x": 69, "y": 32}, {"x": 70, "y": 32}, {"x": 71, "y": 32}, {"x": 72, "y": 32}, {"x": 73, "y": 32}, {"x": 74, "y": 32}, {"x": 75, "y": 32}, {"x": 76, "y": 32}, {"x": 77, "y": 32}, {"x": 78, "y": 32}, {"x": 79, "y": 32}, {"x": 80, "y": 32}, {"x": 81, "y": 32}, {"x": 82, "y": 32}, {"x": 83, "y": 32}, {"x": 83, "y": 31}, {"x": 83, "y": 30}, {"x": 83, "y": 29}, {"x": 83, "y": 28}, {"x": 83, "y": 27}, {"x": 83, "y": 26}, {"x": 83, "y": 25}];
                  //   dispath = check_corner(Gpath);
                  // }
                  // else
                  {
                    make_maze(
                      Math.floor(indoorSourcePointAxis.x),
                      Math.floor(indoorSourcePointAxis.y),
                      Math.floor(indoorDestPointAxis.x),
                      Math.floor(indoorDestPointAxis.y),
                      icon,
                    );
                  }
                  console.log('Gpath');
                  console.log(Gpath);
                  const transformedData = Gpath.map((item, index) => {
                    if (index === Gpath.length - 1) {
                      return {
                        x1: Gpath[index].x / 100,
                        y1: Gpath[index].y / 100,
                        x2: null,
                        y2: null,
                      };
                    }
                    return {
                      x1: Gpath[index].x / 100,
                      y1: Gpath[index].y / 100,
                      x2: Gpath[index + 1].x / 100,
                      y2: Gpath[index + 1].y / 100,
                    };
                  });
                  setIsSearchIconPress(true);
                }
              }}>
              <Icon name="search" color={'gray'} size={22} />
            </TouchableOpacity>
            {isIndoorRecord ? (
              <TouchableOpacity>
                <BarIndicator color="#0eb5e9" size={22} count={3} />
              </TouchableOpacity>
            ) : (
              <Icon
                name="mic"
                color={'gray'}
                size={22}
                onPress={directNavigationHandler}
              />
            )}
          </View>
        </View>

        {/* 여기..? */}

        <View
          style={{
            flexDirection: 'row',
            backgroundColor: 'white',
            width: SCREEN_WIDTH * 0.8,
            alignSelf: 'center',
            justifyContent: 'space-between',
            marginTop: '3%',
          }}>
          <View
            style={[
              styles.rowSquareBox2,
              {
                width: SCREEN_WIDTH * 0.35,
              },
            ]}>
            <Picker
              selectedValue={selectedOption}
              onValueChange={handleSelectChange}>
              {selectOptions.map(option => (
                <Picker.Item
                  key={option.value}
                  label={option.label}
                  value={option.value}
                />
              ))}
            </Picker>
          </View>

          {/* 버튼 추가 */}
          <TouchableOpacity
            style={[
              styles.rowSquareBox2,
              {
                width: SCREEN_WIDTH * 0.35,
                justifyContent: 'center', // 수직 가운데 정렬
                alignItems: 'center', // 수평 가운데 정렬
              },
            ]}
            onPress={resetClick}>
            <Text style={[styles.headText, {marginLeft: 0, fontSize: 15}]}>
              초기화
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.container}>
          <ImageBackground
            source={imagePath[icon]}
            resizeMode="contain"
            style={{
              width: SCREEN_WIDTH * 0.9,
              height: SCREEN_HEIGHT * 0.5,
            }}>
            {isSearchIconPress ? (
              <Svg onPress={evt => handlePress(evt)}>
                {showPath && (
                  <>
                    {/* {console.log('showPath값' + showPath)} */}
                    {path_maze2 &&
                      (() => {
                        return path_maze2.map((coords, index) => {
                          if (index < path_maze2.length - 1) {
                            return (
                              <Line
                                key={index}
                                x1={path_maze2[index].x * SCREEN_WIDTH * 0.01}
                                y1={
                                  path_maze2[index].y *
                                  SCREEN_HEIGHT *
                                  0.6 *
                                  0.01
                                }
                                x2={
                                  path_maze2[index + 1].x * SCREEN_WIDTH * 0.01
                                }
                                y2={
                                  path_maze2[index + 1].y *
                                  SCREEN_HEIGHT *
                                  0.6 *
                                  0.01
                                }
                                stroke="rgba(255, 0, 0, 1)"
                                strokeWidth="2"
                              />
                            );
                          }
                        });
                      })()}
                    {/* 출발지 */}
                    <Circle
                      cx={indoorSourcePointAxis.x * 0.01 * SCREEN_WIDTH}
                      cy={indoorSourcePointAxis.y * 0.01 * SCREEN_HEIGHT * 0.6}
                      r={SCREEN_HEIGHT * 0.01}
                      fill="blue"
                    />
{/* 
                    <React.Fragment>
                            <Circle
                              cx={cur_x * 0.01 * SCREEN_WIDTH}
                              cy={cur_y * 0.01 * SCREEN_HEIGHT * 0.6}
                              r={SCREEN_HEIGHT * 0.01}
                              fill="black"
                            />
                            {console.log('도식' + cur_x + ' ' + cur_y)}
                          </React.Fragment> */}
                    {/* 도착지 */}
                    <Circle
                      cx={indoorDestPointAxis.x * 0.01 * SCREEN_WIDTH}
                      cy={indoorDestPointAxis.y * 0.01 * SCREEN_HEIGHT * 0.6}
                      r={SCREEN_HEIGHT * 0.01}
                      fill="red"
                    />
                  </>
                )}
                {selectedTagId == responseTagId && (
                  <>
                    {icon == tagFloorID && (
                      <>
                        {/* 경로 탐색시 현재 위치 */}
                        {icon == '245' && (
                          <Circle
                            cx={cur_x * 0.01 * SCREEN_WIDTH}
                            cy={cur_y * 0.01 * SCREEN_HEIGHT * 0.6}
                            r={SCREEN_HEIGHT * 0.01}
                            fill="black"
                          />
                        )}
                        {icon == '246' && (
                          <Circle
                            cx={cur_y * 0.01 * SCREEN_WIDTH}
                            cy={cur_x * 0.01 * SCREEN_HEIGHT * 0.6}
                            r={SCREEN_HEIGHT * 0.01}
                            fill="purple"
                          />
                        )}
                        {icon == '247' && (
                          <Circle
                            cx={cur_y * 0.01 * SCREEN_WIDTH}
                            cy={cur_x * 0.01 * SCREEN_HEIGHT * 0.6}
                            r={SCREEN_HEIGHT * 0.01}
                            fill="purple"
                          />
                        )}
                        {icon == '252' && (
                          <Circle
                            cx={cur_x * 0.01 * SCREEN_WIDTH}
                            cy={cur_y * 0.01 * SCREEN_HEIGHT * 0.6}
                            r={SCREEN_HEIGHT * 0.01}
                            fill="purple"
                          />
                        )}
                      </>
                    )}
                  </>
                )}
              </Svg>
            ) : (
              <Svg onPress={evt => handlePress(evt)}>
                {/* 현재 태그가 있는 곳으로 이동 ㅈㄱ*/}
                {/* 시작과 동시에 현재위치 */}
                {selectedTagId == responseTagId && (
                  <>
                    {icon == tagFloorID && (
                      <>
                        {icon == '245' && (
                          <React.Fragment>
                            <Circle
                              cx={cur_x * 0.01 * SCREEN_WIDTH}
                              cy={cur_y * 0.01 * SCREEN_HEIGHT * 0.6}
                              r={SCREEN_HEIGHT * 0.01}
                              fill="black"
                            />

                            {/* {console.log('도식' + cur_x + ' ' + cur_y)} */}
                          </React.Fragment>
                        )}
                        {icon == '246' && (
                          <Circle
                            cx={cur_y * 0.01 * SCREEN_WIDTH}
                            cy={cur_x * 0.01 * SCREEN_HEIGHT * 0.6}
                            r={SCREEN_HEIGHT * 0.01}
                            fill="purple"
                          />
                        )}
                        {icon == '247' && (
                          <Circle
                            cx={cur_y * 0.01 * SCREEN_WIDTH}
                            cy={cur_x * 0.01 * SCREEN_HEIGHT * 0.6}
                            r={SCREEN_HEIGHT * 0.01}
                            fill="purple"
                          />
                        )}
                      </>
                    )}
                  </>
                )}
              </Svg>
            )}
          </ImageBackground>
        </View>
      </View>
    );
  } else {
    return LoadingScreen();
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: '3%',
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    // justifyContent: 'center',
  },
  image: {
    width: SCREEN_WIDTH * 0.7,
    height: SCREEN_HEIGHT * 0.6,
    flex: 0.5,
    justifyContent: 'center',
  },
  body: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollBody: {
    backgroundColor: 'black',
  },
  sendMessage: {
    backgroundColor: '#2C437A',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '5%',
    borderRadius: 15,
    borderColor: 'transparent',
    width: SCREEN_WIDTH * 0.8,
    height: '10%',
    elevation: 2,
  },
  sendMessageText: {
    fontWeight: '700',
    textAlignVertical: 'center',
    color: 'white',
    fontSize: RFPercentage(2.0),
    fontFamily: 'NotoSansKR-Regular',
    marginLeft: '5%',
  },
  rowSquareBox: {
    marginTop: '3%',
    backgroundColor: 'white',
    borderRadius: 15,
    elevation: 2,
    width: SCREEN_WIDTH * 0.8,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  header: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header_font: {
    color: 'black',
    fontWeight: '700',
    fontSize: RFPercentage(2.5),
    fontFamily: 'NotoSansKR-Regular',
    margin: '7%',
  },
  rowText: {
    marginLeft: '5%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: '5%',
    fontFamily: 'NotoSansKR-Regular',
  },
  headText: {
    marginLeft: '16%',
    color: 'black',
    fontWeight: '700',
    fontSize: RFPercentage(2.0),
    fontFamily: 'NotoSansKR-Regular',
  },
  arrow: {
    color: 'white',
    marginRight: '2%',
    fontWeight: '700',
    fontFamily: 'NotoSansKR-Regular',
  },
  message: {
    marginLeft: '5%',
    flexDirection: 'row',
    paddingVertical: '1.5%',
    marginTop: '3%',
  },
  arrow2: {
    color: 'black',
    marginRight: '2%',
    marginTop: '3%',
    fontWeight: '700',
    fontFamily: 'NotoSansKR-Regular',
  },
  mailTime: {
    fontSize: RFPercentage(1.8),
    fontFamily: 'NotoSansKR-Regular',
    marginRight: '5%',
  },
  mailName: {
    fontSize: RFPercentage(1.9),
    fontFamily: 'NotoSansKR-Regular',
    marginRight: '5%',
    color: 'black',
  },
  mailText: {
    fontSize: RFPercentage(1.9),
    fontFamily: 'NotoSansKR-Regular',
    marginLeft: '3%',
    width: '50%',
  },
  rowbox: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: SCREEN_HEIGHT * 0.04,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '3%',
  },
  modalView: {
    width: '75%',
    height: '40%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: '4%',
    alignItems: 'center',
    // display:"flex",
    elevation: 3,
  },
  myLocationView: {
    display: 'flex',
    flexDirection: 'row',
    alignSelf: 'flex-start',
    alignItems: 'center',
  },
  myLocationText: {
    color: '#7eb7eaff',
    fontSize: RFPercentage(1.8),
    marginLeft: '8%',
  },
  locationList: {
    display: 'flex',
    width: '100%',
    height: '70%',
    marginTop: '5%',
  },
  placeContainer: {
    paddingVertical: '2%',
  },
  modalSearchBar: {
    width: '85%',
    height: '100%',
    borderRadius: 5,
  },

  button: {
    marginTop: 10,
  },

  picker: {
    borderWidth: 1,
    // borderColor: 'gray',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    marginTop: 10,
    marginLeft: 40,
    width: SCREEN_WIDTH * 0.2,
    height: SCREEN_HEIGHT * 0.04,
    fontSize: 5,
  },
  itemStyle: {
    fontSize: 30, // 원하는 글자 크기를 설정합니다
  },

  rowSquareBox2: {
    marginTop: '3%',
    backgroundColor: 'white',
    borderRadius: 15,
    elevation: 2,
    width: SCREEN_WIDTH * 0.8,
  },
});