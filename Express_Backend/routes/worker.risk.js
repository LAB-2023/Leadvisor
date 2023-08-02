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
  const params = [body.BIZ_ID, body.USE_YN, body.BIZ_ID, body.USE_YN];
  const sql1 =
    "SELECT A.USER_ID,        A.USER_NM,        E.DEVICE_NUM,        A.GENDER,        A.USER_STATUS,        D.USER_STATUS_NM,        CASE WHEN A.BIRTH IS NOT NULL AND A.BIRTH != '' THEN ( DATE_FORMAT(NOW(), '%Y') - DATE_FORMAT(A.BIRTH, '%Y') ) + 1 ELSE -1 END AS AGE,        IF(A.DISEASE_YN = 'Y', 'Y', 'N')     DISEASE_YN,        IF(A.RISK_WORKER_YN = 'Y', 'Y', 'N') RISK_WORKER_YN,        IFNULL(G.HAZARD_YN, 'N')             HAZARD_YN,        IFNULL(G.SAFETY_YN, 'N')             SAFETY_YN,        IF(A.FAVORITE_YN = 'Y', 'Y', 'N')    FAVORITE_YN   FROM TB_USER A LEFT OUTER JOIN TB_BIZ C ON A.BIZ_ID = C.BIZ_ID 		 LEFT OUTER JOIN TB_USER_STATUS D ON D.BIZ_ID = C.UP_BIZ_ID AND A.USER_STATUS = D.USER_STATUS AND D.USE_YN = 'Y' 		 LEFT OUTER JOIN TB_DEVICE E ON A.USER_ID = E.USER_ID AND E.USE_YN = 'Y' AND E.DEVICE_TYPE = '01' 		 LEFT OUTER JOIN TB_ENTRY_INOUT F ON A.USER_ID = F.USER_ID AND F.DEVICE_ID = E.DEVICE_ID AND F.EFF_END_DT = '99991231235959' AND ENTRY_TYPE = 'A' 		 LEFT OUTER JOIN TB_AREA G ON F.AREA_ID = G.AREA_ID AND G.USE_YN = 'Y'  WHERE 1 = 1    AND A.BIZ_ID = ?    AND A.USE_YN = ?    AND IF(A.FAVORITE_YN = 'Y', 'Y', 'N') = 'Y'    AND IF(A.RISK_WORKER_YN = 'Y', 'Y', 'N') = 'Y'  UNION ALL SELECT A.USER_ID,        A.USER_NM,        E.DEVICE_NUM,        A.GENDER,        A.USER_STATUS,        D.USER_STATUS_NM,        CASE WHEN A.BIRTH IS NOT NULL AND A.BIRTH != '' THEN ( DATE_FORMAT(NOW(), '%Y') - DATE_FORMAT(A.BIRTH, '%Y') ) + 1 ELSE -1 END AS AGE,        IF(A.DISEASE_YN = 'Y', 'Y', 'N')     DISEASE_YN,        IF(A.RISK_WORKER_YN = 'Y', 'Y', 'N') RISK_WORKER_YN,        IFNULL(G.HAZARD_YN, 'N')             HAZARD_YN,        IFNULL(G.SAFETY_YN, 'N')             SAFETY_YN,        IF(A.FAVORITE_YN = 'Y', 'Y', 'N')    FAVORITE_YN   FROM TB_USER A LEFT OUTER JOIN TB_BIZ C ON A.BIZ_ID = C.BIZ_ID 		 LEFT OUTER JOIN TB_USER_STATUS D ON D.BIZ_ID = C.UP_BIZ_ID AND A.USER_STATUS = D.USER_STATUS AND D.USE_YN = 'Y' 		 LEFT OUTER JOIN TB_DEVICE E ON A.USER_ID = E.USER_ID AND E.USE_YN = 'Y' AND E.DEVICE_TYPE = '01' 		 LEFT OUTER JOIN TB_ENTRY_INOUT F ON A.USER_ID = F.USER_ID AND F.DEVICE_ID = E.DEVICE_ID AND F.EFF_END_DT = '99991231235959' AND ENTRY_TYPE = 'A' 		 LEFT OUTER JOIN TB_AREA G ON F.AREA_ID = G.AREA_ID AND G.USE_YN = 'Y'  WHERE 1 = 1    AND A.BIZ_ID = ?    AND A.USE_YN = ?    AND IF(A.FAVORITE_YN = 'Y', 'Y', 'N') = 'N'    AND IF(A.RISK_WORKER_YN = 'Y', 'Y', 'N') = 'Y'  ORDER BY FAVORITE_YN DESC, USER_ID";

  try {
    jwt.verify(body.token, key.ACCESS_TOKEN_SECRET);
    db.query(sql1, params, (err, result) => {
      if (!err) {
        console.log(result);
        res.send({
          status: "RiskWorker success",
          data: result,
        });
      } else {
        console.log("RiskWorker Data error");
        res.send({ status: "fail" });
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
