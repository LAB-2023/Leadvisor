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
  const sql1 =
    "SELECT M.OUTDOOR_SEQ,        M.DUID,        M.BIZ_ID,        M.DEVICE_ID 'TAG_ID',        M.USER_ID,        M.LAT,        M.LNG,        M.MEASURE_DT,        M.REG_DT,        N.DEVICE_NUM 'TAG_NUM',        N.USER_NM,        (SELECT IFNULL(MAX(T.ALERT_TYPE), '')           FROM TB_ALERT T          WHERE T.REG_DT > CURDATE()            AND T.DEVICE_ID = M.DEVICE_ID            AND T.USER_ID = M.USER_ID            AND T.COMPLETE_YN = 'N') ALERT_TYPE,        CASE WHEN C.BIRTH IS NOT NULL AND C.BIRTH != '' THEN CONCAT(( DATE_FORMAT(NOW(), '%Y') - DATE_FORMAT(C.BIRTH, '%Y') ) + 1, '세') ELSE '' END AS AGE /* 나이 */,        C.GENDER,        CASE WHEN C.GENDER = 'M' THEN '남' ELSE '여' END GENDER_NM,        IF(C.DISEASE_YN = 'Y', 'Y', 'N')     DISEASE_YN /* 건강취약여부 */,        IF(C.RISK_WORKER_YN = 'Y', 'Y', 'N') RISK_WORKER_YN /* 위험작업자여부 */,        C.USER_ID,        C.DEPT_ID,        C.MOBILE   FROM TB_OUTDOOR_POS M INNER JOIN (SELECT A.DEVICE_ID, 					   B.DEVICE_NUM, 					   C.USER_ID, 					   C.USER_NM, 					   MAX(OUTDOOR_SEQ) OUTDOOR_SEQ 				      FROM TB_OUTDOOR_POS A INNER JOIN TB_DEVICE B ON A.DEVICE_ID = B.DEVICE_ID AND B.DEVICE_TYPE = '01' AND B.USE_YN = 'Y' 							    INNER JOIN TB_USER C ON A.USER_ID = C.USER_ID AND C.USE_YN = 'Y' 				     WHERE 1 = 1 				       AND A.BIZ_ID = ? 				       AND A.MEASURE_DT >= DATE_FORMAT(NOW(), '%Y-%m-%d 00:00:00')  				     GROUP  BY A.DEVICE_ID, B.DEVICE_NUM, C.USER_ID, C.USER_NM) N ON M.OUTDOOR_SEQ = N.OUTDOOR_SEQ 			LEFT OUTER JOIN TB_USER C ON M.USER_ID = C.USER_ID AND C.USE_YN = 'Y'  WHERE 1 = 1  ORDER  BY M.OUTDOOR_SEQ;";

  try {
    jwt.verify(body.token, key.ACCESS_TOKEN_SECRET);
    db.query(sql1, BIZ_ID, (err, result) => {
      if (!err) {
        console.log(result);
        res.send({
          status: "WorkerPosition success",
          data: result,
        });
      } else {
        console.log("WorkerPosition Data error");
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
