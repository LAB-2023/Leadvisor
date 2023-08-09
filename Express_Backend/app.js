const express = require("express");
//const admin = require("firebase-admin");
const app = express();
// let ts = Date.now();
// let date_ob = new Date(ts);
// let date = date_ob.getDate();
// let month = date_ob.getMonth() + 1;
// let year = date_ob.getFullYear();
// let hours = date_ob.getHours();
// let minutes = date_ob.getMinutes();
// let nowDate = year + "-" + month + "-" + date + " " + hours + ":" + minutes;

// const serviceAccount = require("./src/withsafe-2008b-firebase-adminsdk-fulz8-2647af3430.json");
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });
const bodyParser = require("body-parser");
const cors = require("cors");
app.use(bodyParser.json());
app.use(cors());
const db = require("./src/db_config.js");

app.get("/", (req, res) => {
  res.json({ message: "Welcome to yourGuide Application." });
});

//sending Message Example
// const sendingNotification = async () => {
//   const message = {
//     data: {
//       type: "0", // Android 0
//       regDt: nowDate, // Date
//       bizId: "B00002", // BIZ_ID
//       custLoginId: "sbsystems", //CUST_BIZ_ID
//       alertType: "02", // 경고타입
//       userNm: "김윤호", // 사용자명
//       userId: "1", // 사용자ID
//     },
//     android: {
//       priority: "high", // 고정
//       notification: {
//         color: "#f45342", // 고정 색상인지 확인 필요
//         title: "SOS 요청", // 알림 제목
//         body: "SOS 요청 알림입니다.", // 알림 내용
//       },
//     },
//     topic: "B00001", // 알림 수신받을 BIZ_ID
//   };

//   await admin
//     .messaging()
//     .send(message)
//     .then((response) => {
//       console.log("Successfully sent message: ", response);
//     })
//     .catch((error) => {
//       console.log("Error sending message: ", error);
//     });
// };
// sendingNotification();

app.use("/api/user/login", require("./routes/user.login"));
app.use(
  "/api/user/login/checktoken",
  require("./routes/user.login.checktoken")
);
app.use("/api/user/info", require("./routes/user.info"));
app.use("/api/user/select/site", require("./routes/user.select.site"));

//통합관리
app.use("/api/worker/dailystatus", require("./routes/worker.dailystatus"));
app.use(
  "/api/worker/dailyWorkerList",
  require("./routes/worker.dailyWorkerList")
);
app.use(
  "/api/worker/registerStatus",
  require("./routes/worker.registerStatus")
);
app.use("/api/worker/todayRate", require("./routes/worker.todayRate"));
app.use("/api/worker/warning", require("./routes/worker.warning"));
app.use("/api/worker/risk", require("./routes/worker.risk"));
app.use(
  "/api/environment/warningList",
  require("./routes/environment.warningList")
);
app.use("/api/environment/warning", require("./routes/environment.warning"));
app.use("/api/worker/registerList", require("./routes/worker.registerList"));
app.use("/api/worker/action", require("./routes/worker.action"));
app.use("/api/worker/dangerSpot", require("./routes/worker.dangerSpot"));
app.use("/api/worker/detail", require("./routes/worker.detail"));
app.use("/api/worker/heart", require("./routes/worker.heart"));
app.use("/api/worker/SOS", require("./routes/worker.SOS"));
app.use("/api/worker/warning", require("./routes/worker.warning"));
app.use("/api/worker/info", require("./routes/worker.info"));
app.use("/api/update/favorite", require("./routes/update.favorite"));
app.use("/api/update/Action", require("./routes/update.Action"));

//모니터링
app.use("/api/map/workerPosition", require("./routes/map.workerPosition"));
//app.use("/api/map/workerInfo", require("./routes/map.workerInfo"));

//messagetab

app.use("/api/user/messagetab/send", require("./routes/user.messagetab.send"));
app.use("/api/user/send/list", require("./routes/user.send.list"));

app.use("/api/user/notice/list", require("./routes/user.notice.list"));
app.use("/api/user/notice/detail", require("./routes/user.notice.detail"));
app.use("/api/user/schedule/list", require("./routes/user.schedule.list"));
app.use("/api/user/schedule/detail", require("./routes/user.schedule.detail"));
app.use("/api/user/address/list", require("./routes/user.address.list"));
app.use("/api/user/find/member", require("./routes/user.find.member"));
app.use("/api/user/count/deptmem", require("./routes/user.count.deptmem"));
//map tab
app.use("/api/user/map/list", require("./routes/user.map.list"));

// Node.js 웹과 연결. 포트번호 4000
app.listen(4000, () => {
  console.log("Server connect with port 4000");
});
