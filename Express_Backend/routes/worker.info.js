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
  const ALERT_SEQ = body.ALERT_SEQ;

  const sql1 =
    "SELECT A.ALERT_SEQ   , A.ALERT_TYPE   , B.USER_NM      , C.DEVICE_NUM      , B.GENDER      , CASE WHEN B.GENDER = 'M' THEN '남자' ELSE '여자' END GENDER_NM      , CASE WHEN B.BIRTH IS NOT NULL AND B.BIRTH != '' THEN (DATE_FORMAT(NOW(), '%Y') - DATE_FORMAT(B.BIRTH,'%Y')) + 1 	    ELSE '' 	END AS AGE      , IF(B.DISEASE_YN = 'Y', '건강 취약자', '') 'Health'      , IF(B.RISK_WORKER_YN = 'Y', '위험 작업자', '') 'Danger'      , D.AREA_NM '발생위치'   FROM TB_ALERT A LEFT OUTER JOIN TB_USER B ON A.USER_ID = B.USER_ID AND B.USE_YN = 'Y' 		  LEFT OUTER JOIN TB_DEVICE C ON A.DEVICE_ID = C.DEVICE_ID AND C.USE_YN = 'Y' 		  LEFT OUTER JOIN TB_AREA D ON A.AREA_ID = D.AREA_ID AND D.USE_YN = 'Y'  WHERE 1=1    AND A.ALERT_SEQ = ?";

  try {
    jwt.verify(body.token, key.ACCESS_TOKEN_SECRET);
    db.query(sql1, ALERT_SEQ, (err, result) => {
      if (!err) {
        console.log(result);
        res.send({
          status: "WorkerDetailInfo success",
          data: result,
        });
      } else {
        console.log("WorkerDetailInfo Data error");
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
