let Gpath;
let Gpath2;
let Gpath3;
var column = 90;
var row = 80;
let dispath;
const maze = Array.from(new Array(row), () => new Array(column).fill(0));

const path_cafeToilet = [
  {x: 64, y: 63},
  {x: 63, y: 63},
  {x: 62, y: 63},
  {x: 61, y: 63},
  {x: 60, y: 63},
  {x: 59, y: 63},
  {x: 58, y: 63},
  {x: 57, y: 63},
  {x: 57, y: 62},
  {x: 57, y: 61},
  {x: 57, y: 60},
  {x: 57, y: 59},
  {x: 57, y: 58},
  {x: 57, y: 57},
  {x: 57, y: 56},
  {x: 57, y: 55},
  {x: 57, y: 54},
  {x: 57, y: 53},
  {x: 57, y: 52},
  {x: 57, y: 51},
  {x: 57, y: 50},
  {x: 57, y: 49},
  {x: 57, y: 48},
  {x: 57, y: 47},
  {x: 57, y: 46},
  {x: 57, y: 45},
  {x: 57, y: 44},
  {x: 57, y: 43},
  {x: 57, y: 42},
  {x: 57, y: 41},
  {x: 57, y: 40},
  {x: 57, y: 39},
  {x: 57, y: 38},
  {x: 57, y: 37},
  {x: 57, y: 36},
  {x: 57, y: 35},
  {x: 57, y: 34},
  {x: 57, y: 33},
  {x: 57, y: 32},
  {x: 58, y: 32},
  {x: 59, y: 32},
  {x: 60, y: 32},
  {x: 61, y: 32},
  {x: 62, y: 32},
  {x: 63, y: 32},
  {x: 64, y: 32},
  {x: 65, y: 32},
  {x: 66, y: 32},
  {x: 67, y: 32},
  {x: 68, y: 32},
  {x: 69, y: 32},
  {x: 70, y: 32},
  {x: 71, y: 32},
  {x: 72, y: 32},
  {x: 73, y: 32},
  {x: 74, y: 32},
  {x: 75, y: 32},
  {x: 76, y: 32},
  {x: 77, y: 32},
  {x: 78, y: 32},
  {x: 79, y: 32},
  {x: 80, y: 32},
  {x: 81, y: 32},
  {x: 82, y: 32},
  {x: 83, y: 32},
  {x: 83, y: 31},
  {x: 83, y: 30},
  {x: 83, y: 29},
  {x: 83, y: 28},
  {x: 83, y: 27},
  {x: 83, y: 26},
  {x: 83, y: 25},
];
const toiletToCafe = [
  {x: 83, y: 25},
  {x: 83, y: 26},
  {x: 83, y: 27},
  {x: 83, y: 28},
  {x: 83, y: 29},
  {x: 83, y: 30},
  {x: 83, y: 31},
  {x: 83, y: 32},
  {x: 82, y: 32},
  {x: 81, y: 32},
  {x: 80, y: 32},
  {x: 79, y: 32},
  {x: 78, y: 32},
  {x: 77, y: 32},
  {x: 76, y: 32},
  {x: 75, y: 32},
  {x: 74, y: 32},
  {x: 73, y: 32},
  {x: 72, y: 32},
  {x: 71, y: 32},
  {x: 70, y: 32},
  {x: 69, y: 32},
  {x: 68, y: 32},
  {x: 67, y: 32},
  {x: 66, y: 32},
  {x: 65, y: 32},
  {x: 64, y: 32},
  {x: 63, y: 32},
  {x: 62, y: 32},
  {x: 61, y: 32},
  {x: 60, y: 32},
  {x: 59, y: 32},
  {x: 58, y: 32},
  {x: 57, y: 32},
  {x: 57, y: 33},
  {x: 57, y: 34},
  {x: 57, y: 35},
  {x: 57, y: 36},
  {x: 57, y: 37},
  {x: 57, y: 38},
  {x: 57, y: 39},
  {x: 57, y: 40},
  {x: 57, y: 41},
  {x: 57, y: 42},
  {x: 57, y: 43},
  {x: 57, y: 44},
  {x: 57, y: 45},
  {x: 57, y: 46},
  {x: 57, y: 47},
  {x: 57, y: 48},
  {x: 57, y: 49},
  {x: 57, y: 50},
  {x: 57, y: 51},
  {x: 57, y: 52},
  {x: 57, y: 53},
  {x: 57, y: 54},
  {x: 57, y: 55},
  {x: 57, y: 56},
  {x: 57, y: 57},
  {x: 57, y: 58},
  {x: 57, y: 59},
  {x: 57, y: 60},
  {x: 57, y: 61},
  {x: 57, y: 62},
  {x: 57, y: 63},
  {x: 58, y: 63},
  {x: 59, y: 63},
  {x: 60, y: 63},
  {x: 61, y: 63},
  {x: 62, y: 63},
  {x: 63, y: 63},
  {x: 64, y: 63},
];

// var startX = 20, startY = 3, endX = 3, endY = 10;
let cnt, cnt3;
let start;
let end;
class Cell {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Node {
  constructor(parent, position) {
    this.parent = parent;
    this.position = position;
    this.g = 0;
    this.h = 0;
    this.f = 0;
  }
}

function aStar(maze, start, end) {
  // startNode와 endNode 초기화
  const startNode = new Node(null, start);
  const endNode = new Node(null, end);

  // openList, closedList 초기화
  let openList = [];
  let closedList = [];
  const nodePosition = [];
  // openList에 시작 노드 추가
  openList.push(startNode);

  // endNode를 찾을 때까지 실행
  while (openList.length > 0) {
    // 현재 노드 지정
    let currentNode = openList[0];
    let currentIdx = 0;

    // 이미 같은 노드가 openList에 있고, f 값이 더 크면
    // currentNode를 openList안에 있는 값으로 교체
    for (let i = 0; i < openList.length; i++) {
      if (openList[i].f < currentNode.f) {
        currentNode = openList[i];
        currentIdx = i;
      }
    }

    // openList에서 제거하고 closedList에 추가

    openList.splice(currentIdx, 1);

    closedList.push(currentNode);

    // 현재 노드가 목적지면 current.position 추가하고
    // current의 부모로 이동
    if (
      currentNode.position.x == endNode.position.x &&
      currentNode.position.y == endNode.position.y
    ) {
      const path = [];
      let current = currentNode;
      while (current != null) {
        // maze 길을 표시하려면 주석 해제
        // const [x, y] = current.position;
        // maze[x][y] = 7;
        path.push(current.position);

        current = current.parent;
      }
      return path.reverse();
    }
    cnt = 0;

    let check = [
      [0, -1],
      [0, 1],
      [-1, 0],
      [1, 0],
    ];

    // let check = [
    // [0, -1],
    // [0, 1],
    // [-1, 0],
    // [1, 0],
    // [-1, -1],
    // [-1, 1],
    // [1, -1],
    // [1, 1]]

    const children = [];
    // 인접한 xy좌표 전부
    for (let i of check) {
      // 노드 위치 업데이트S

      const nodePosition = [
        currentNode.position.x + i[0], // column값
        currentNode.position.y + i[1], // row값
      ];

      if (
        nodePosition[0] > column - 1 ||
        nodePosition[0] < 0 ||
        nodePosition[1] > row - 1 ||
        nodePosition[1] < 0
      ) {
        // 하나라도 true면 범위 밖임
        continue;
      }
      // 장애물이 있으면 다른 위치 불러오기
      if (maze[nodePosition[1]][nodePosition[0]] != 0) {
        continue;
      }
      // 자식 노드 생성 및 추가
      let newCell = new Cell(nodePosition[0], nodePosition[1]);
      let new_node = new Node(currentNode, newCell);
      children.push(new_node);

      // 자식 노드들 loop
      for (let i = 0; i < children.length; i++) {
        let child = children[i];

        // 자식이 closedList에 있으면 continue
        if (closedList.includes(child)) {
          continue;
        }

        // f, g, h값 업데이트
        child.g = currentNode.g + 1;
        child.h =
          (child.position.x - endNode.position.x) ** 2 +
          (child.position.y - endNode.position.y) ** 2;
        // child.h = heuristic(child, endNode); 다른 휴리스틱

        child.f = child.g + child.h;

        // 자식이 openList에 있으며, g값이 더 크면 continue
        cnt3 = 0;
        for (let i of openList)
          if (
            child.position.x == i.position.x &&
            child.position.y == i.position.y &&
            child.g > i.g
          )
            cnt3++;
        if (cnt3 > 0) continue;
        openList.push(child);
      }
    }
  }
}

function check_corner(Gpath) {
  let cornerList = []; // x, y 좌표와 판별값을 저장할 리스트
  let message = ''; // 판별 메시지
  let message_start = '출발지 입니다. 안내를 시작합니다.';
  let prevMessage = ''; // 이전 판별 메시지

  cornerList.push({x: Gpath[0].x, y: Gpath[0].y, message: message_start});

  for (let i = 0; i < Gpath.length - 1; i++) {
    let cnt2 = i + 1;

    if (
      Gpath[cnt2].x + 1 === Gpath[cnt2 - 1].x &&
      Gpath[cnt2].y + 1 === Gpath[cnt2 - 1].y
    ) {
      message = '우회전 입니다.';
    } else if (
      Gpath[cnt2].x - 1 === Gpath[cnt2 - 1].x &&
      Gpath[cnt2].y - 1 === Gpath[cnt2 - 1].y
    ) {
      message = '우회전 입니다.';
    } else if (
      Gpath[cnt2].x + 1 === Gpath[cnt2 - 1].x &&
      Gpath[cnt2].y - 1 === Gpath[cnt2 - 1].y
    ) {
      message = '좌회전 입니다.';
    } else if (
      Gpath[cnt2].x - 1 === Gpath[cnt2 - 1].x &&
      Gpath[cnt2].y + 1 === Gpath[cnt2 - 1].y
    ) {
      message = '좌회전 입니다.';
    } else if (
      (Gpath[cnt2].x + 1 === Gpath[cnt2 - 1].x &&
        Gpath[cnt2].y === Gpath[cnt2 - 1].y) ||
      (Gpath[cnt2].x - 1 === Gpath[cnt2 - 1].x &&
        Gpath[cnt2].y === Gpath[cnt2 - 1].y)
    ) {
      message = '좌회전 입니다.';
    } else if (
      (Gpath[cnt2].x === Gpath[cnt2 - 1].x &&
        Gpath[cnt2].y + 1 === Gpath[cnt2 - 1].y) ||
      (Gpath[cnt2].x === Gpath[cnt2 - 1].x &&
        Gpath[cnt2].y - 1 === Gpath[cnt2 - 1].y)
    ) {
      message = '우회전 입니다.';
    }

    if (prevMessage === '') {
      prevMessage = message;
    }

    if (prevMessage !== message) {
      prevMessage = '';
      cornerList.push({
        x: Gpath[cnt2 - 1].x,
        y: Gpath[cnt2 - 1].y,
        message: message,
      });
    }

    if (i + 1 === Gpath.length - 1) {
      if (
        Gpath[i + 1].x === Gpath[Gpath.length - 1].x &&
        Gpath[i + 1].y === Gpath[Gpath.length - 1].y
      ) {
        cornerList.push({
          x: Gpath[i + 1].x,
          y: Gpath[i + 1].y,
          message: '목적지 입니다.',
        });
      } else {
        cornerList.push({x: Gpath[i + 1].x, y: Gpath[i + 1].y, message: ''});
      }
    }
  }

  return cornerList;
}
function make_maze4(startX, startY, endX, endY) {
  column = 90;
  row = 80;
  for (var i = 0; i < row; i++) {
    for (var j = 0; j < column; j++) maze[i][j] = 1;
  }
  //4층 장애물
  for (var i = 22; i < 33; i++) for (var j = 83; j < 84; j++) maze[i][j] = 0;
  for (var i = 32; i < 33; i++) for (var j = 57; j < 84; j++) maze[i][j] = 0;
  for (var i = 32; i < 79; i++) for (var j = 57; j < 58; j++) maze[i][j] = 0; //직선 코스
  for (var i = 63; i < 64; i++) for (var j = 57; j < 65; j++) maze[i][j] = 0; //우측
  for (var i = 65; i < 66; i++) for (var j = 48; j < 58; j++) maze[i][j] = 0; //좌측

  var cell = new Cell(startX, startY);
  start = cell;
  var cell3 = new Cell(57, 32); //중간지점
  let middle = cell3;
  var cell4 = new Cell(58, 32); //중간지점 바로 오른쪽 지점
  let middle_next = cell4;
  var cell2 = new Cell(endX, endY);
  end = cell2;

  Gpath2 = aStar(maze, start, middle);
  Gpath3 = aStar(maze, middle_next, end);
  Gpath = Gpath2.concat(Gpath3);
  dispath = check_corner(Gpath);
  for (var i = 0; i < Gpath.length; i++) {
    if (maze[Gpath[i].y][Gpath[i].x] == 0) {
      maze[Gpath[i].y][Gpath[i].x] = 2;
    }
  }
}
function make_maze(startX, startY, endX, endY, floor) {
  if (startY > 32 && endX == 83 && endY == 25) {
    make_maze4(startX, startY, endX, endY);
  } else if (startX == 64 && startY == 63 && endX == 83 && endY == 25) {
    Gpath = path_cafeToilet;
    dispath = check_corner(Gpath);
  } else if (startX == 83 && startY == 25 && endX == 64 && endY == 63) {
    Gpath = toiletToCafe;
    dispath = check_corner(Gpath);
  } else {
    //1층일때
    if (floor == '245') {
      column = 90;
      row = 80;
      for (var i = 0; i < row; i++) {
        for (var j = 0; j < column; j++) maze[i][j] = 1;
      }
      //1층 장애물
      for (var i = 20; i < 21; i++) for (var j = 5; j < 50; j++) maze[i][j] = 0;
      for (var i = 20; i < 41; i++)
        for (var j = 49; j < 50; j++) maze[i][j] = 0;
      for (var i = 40; i < 41; i++)
        for (var j = 49; j < 60; j++) maze[i][j] = 0;
      for (var i = 40; i < 41; i++)
        for (var j = 59; j < 71; j++) maze[i][j] = 0;
      for (var i = 40; i < 61; i++)
        for (var j = 59; j < 60; j++) maze[i][j] = 0;
      for (var i = 36; i < 41; i++)
        for (var j = 70; j < 71; j++) maze[i][j] = 0;
      for (var i = 40; i < 46; i++)
        for (var j = 70; j < 71; j++) maze[i][j] = 0;
    }
    //2층일때
    else if (floor == '246') {
      column = 90;
      row = 80;
      for (var i = 0; i < row; i++) {
        for (var j = 0; j < column; j++) maze[i][j] = 1;
      }
      //2층 장애물
      for (var i = 19; i < 20; i++) for (var j = 5; j < 34; j++) maze[i][j] = 0;
      for (var i = 19; i < 33; i++) for (var j = 5; j < 6; j++) maze[i][j] = 0;
      for (var i = 32; i < 33; i++) for (var j = 5; j < 51; j++) maze[i][j] = 0;
      for (var i = 32; i < 41; i++)
        for (var j = 50; j < 51; j++) maze[i][j] = 0;
      for (var i = 40; i < 41; i++)
        for (var j = 50; j < 59; j++) maze[i][j] = 0;
      for (var i = 36; i < 41; i++)
        for (var j = 58; j < 59; j++) maze[i][j] = 0;
      for (var i = 36; i < 37; i++)
        for (var j = 58; j < 68; j++) maze[i][j] = 0;
      for (var i = 19; i < 33; i++)
        for (var j = 32; j < 33; j++) maze[i][j] = 0;
    }
    //3층일때
    else if (floor == '247') {
      column = 90;
      row = 80;
      for (var i = 0; i < row; i++) {
        for (var j = 0; j < column; j++) maze[i][j] = 1;
      }
      //3층 경로
      for (var i = 18; i < 19; i++) for (var j = 0; j < 41; j++) maze[i][j] = 0;
      for (var i = 18; i < 33; i++)
        for (var j = 41; j < 42; j++) maze[i][j] = 0;
      for (var i = 33; i < 34; i++)
        for (var j = 41; j < 52; j++) maze[i][j] = 0;
      for (var i = 33; i < 40; i++)
        for (var j = 52; j < 53; j++) maze[i][j] = 0;
      for (var i = 39; i < 40; i++)
        for (var j = 52; j < 61; j++) maze[i][j] = 0;
      for (var i = 39; i < 63; i++)
        for (var j = 61; j < 62; j++) maze[i][j] = 0;
    } else if (floor == '252') {
      column = 90;
      row = 80;
      for (var i = 0; i < row; i++) {
        for (var j = 0; j < column; j++) maze[i][j] = 1;
      }
      //4층 장애물
      for (var i = 22; i < 33; i++)
        for (var j = 83; j < 84; j++) maze[i][j] = 0;
      for (var i = 32; i < 33; i++)
        for (var j = 57; j < 84; j++) maze[i][j] = 0;
      for (var i = 32; i < 79; i++)
        for (var j = 57; j < 58; j++) maze[i][j] = 0; //직선 코스
      for (var i = 63; i < 64; i++)
        for (var j = 57; j < 65; j++) maze[i][j] = 0; //우측
      for (var i = 65; i < 66; i++)
        for (var j = 48; j < 58; j++) maze[i][j] = 0; //좌측
    } else {
      console.log('Wrong floor tagID input');
    }

    var cell = new Cell(startX, startY);
    start = cell;
    var cell2 = new Cell(endX, endY);
    end = cell2;

    Gpath = aStar(maze, start, end);
    dispath = check_corner(Gpath);
    for (var i = 0; i < Gpath.length; i++) {
      if (maze[Gpath[i].y][Gpath[i].x] == 0) {
        maze[Gpath[i].y][Gpath[i].x] = 2;
      }
    }
  }
}

export {make_maze, Gpath, dispath, check_corner, path_cafeToilet};
