const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
app.use(bodyParser.json());
app.use(cors());
const db = require("../src/db_config.js");

const jwt = require("jsonwebtoken");
const key = require("../src/jwt_config");

app.get("/", function (req, res) {
  let body = req.query;
  const BIZ_ID = body.BIZ_ID;
  const USER_ID = body.USER_ID;
  const sql1 =
    "SELECT A.BIZ_ID,        A.ALERT_TYPE,        A.ALERT_SEQ,        A.DEVICE_ID,        A.TAG_ID,        IF(B.DEVICE_ID != '0', B.DEVICE_NUM, G.TAG_NUM) DEVICE_NUM/* 디바이스 번호 */,        C.USER_NM /* 사용자명 */,    C.USER_ID, C.DEPT_ID,        C.MOBILE,        F.AREA_NM /* 현재위치 */,        A.COMPLETE_YN,        A.REMARK,        CASE WHEN C.BIRTH IS NOT NULL AND C.BIRTH != '' THEN CONCAT(( DATE_FORMAT(NOW(), '%Y') - DATE_FORMAT(C.BIRTH, '%Y') ) + 1, '세')             ELSE ''         END AS AGE /* 나이 */,        C.GENDER,        CASE WHEN C.GENDER = 'M' THEN '남' ELSE '여' END GENDER_NM,        IF(C.DISEASE_YN = 'Y', 'Y', 'N')                DISEASE_YN/* 건강취약여부 */,        IF(C.RISK_WORKER_YN = 'Y', 'Y', 'N')            RISK_WORKER_YN/* 위험작업자여부 */,        DATE_FORMAT(A.REG_DT, '%Y-%m-%d %H:%i:%s')      REG_DT/* 등록일 : 위험 발생 시간 */,        F.AREA_NM /* 발생위치 */, A.LAT, A.LNG,        IF(F.HAZARD_YN = 'Y', '위험 구역', '')      '위험구역여부',        CASE WHEN A.LAT IS NOT NULL AND A.LNG IS NOT NULL THEN 'Y'             ELSE 'N'         END '지도보기가능여부'   FROM TB_ALERT A LEFT OUTER JOIN TB_DEVICE B ON A.DEVICE_ID = B.DEVICE_ID AND B.USE_YN = 'Y' 		  LEFT OUTER JOIN TB_USER C ON A.USER_ID = C.USER_ID AND C.USE_YN = 'Y' 		  LEFT OUTER JOIN TB_ENTRY_INOUT E ON E.ENTRY_TYPE = 'A' AND A.DEVICE_ID = E.DEVICE_ID AND A.USER_ID = E.USER_ID AND E.EFF_END_DT = '99991231235959' 		  LEFT OUTER JOIN TB_AREA F ON E.AREA_ID = F.AREA_ID AND F.USE_YN = 'Y' 		  LEFT OUTER JOIN TB_TAG G ON A.TAG_ID = G.TAG_ID AND G.USE_YN = 'Y'  WHERE 1 = 1    AND A.COMPLETE_YN = 'N' /* 미조치된 건 */    AND A.REG_DT > DATE_FORMAT(NOW(), '%Y-%m-%d 00:00:00')    AND A.ALERT_TYPE IN ( '01', '02', '05', '06', '07', '08', '09', '10' )    AND A.BIZ_ID = ?  AND C.USER_ID = ? ORDER  BY A.COMPLETE_YN LIMIT 1;";

  try {
    jwt.verify(body.token, key.ACCESS_TOKEN_SECRET);
    db.query(sql1, [BIZ_ID, USER_ID], (err, result) => {
      if (!err) {
        console.log(result);
        res.send({
          status: "Looking Worker success",
          data: result,
        });
      } else {
        console.log("Looking Worker Data error");
        res.send({ message: "fail", status: "fail" });
      }
    });
  } catch (err) {
    console.log("-1");
    console.error(err);
    return res.send({
      status: "fail",
    });
  }
});
module.exports = app;
