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
  const params = [body.BIZ_ID, body.USE_YN];
  const sql1 =
    "SELECT COUNT(*) TOT_MAN_CNT /* 전체 인원 */ 	 , IFNULL(SUM(CASE WHEN T.GENDER = 'M' THEN 1 ELSE 0 END), 0) MAN_CNT /* 남성 */ 	 , IFNULL(SUM(CASE WHEN T.GENDER = 'F' THEN 1 ELSE 0 END), 0) FEMALE_CNT /* 여성 */ 	 , IFNULL(SUM(CASE WHEN T.HAZARD_YN = 'Y' THEN 1 ELSE 0 END), 0) HAZARD_MAN_CNT /* 위험 지역 */ 	 , IFNULL(SUM(CASE WHEN T.SAFETY_YN = 'Y' THEN 1 ELSE 0 END), 0) SAFE_MAN_CNT /* 안전 지역 */ 	 , IFNULL(SUM(CASE WHEN T.AGE > 65 THEN 1 ELSE 0 END), 0) YOUNG_MAN_CNT /* 65세 미만 */ 	 , IFNULL(SUM(CASE WHEN T.AGE >= 65 THEN 1 ELSE 0 END), 0) OLD_MAN_CNT /* 65세 이상(=고령자) */ 	 , IFNULL(SUM(CASE WHEN T.DISEASE_YN = 'Y' THEN 1 ELSE 0 END), 0) DISEASE_MAN_CNT /* 건강 취약자 */ 	 , IFNULL(SUM(CASE WHEN T.RISK_WORKER_YN = 'Y' THEN 1 ELSE 0 END), 0) RISK_MAN_CNT /* 위험 작업자 */ 	 , IFNULL(SUM(CASE WHEN T.USER_STATUS_NM = '작업시작' THEN 1 ELSE 0 END), 0) WORK_MAN_CNT /* 작업시작 작업자 */ 	 , IFNULL(SUM(CASE WHEN T.USER_STATUS_NM = '작업종료' THEN 1 ELSE 0 END), 0) HOME_MAN_CNT /* 작업종료 작업자 */   FROM (SELECT A.USER_ID 			 , A.USER_NM 			 , A.GENDER 			 , A.USER_STATUS 			 , IFNULL(D.USER_STATUS_NM, '작업종료') USER_STATUS_NM 			 , CASE WHEN A.BIRTH IS NOT NULL AND A.BIRTH != '' THEN (DATE_FORMAT(NOW(), '%Y') - DATE_FORMAT(A.BIRTH,'%Y')) + 1 					ELSE -1 				END AS AGE 			 , IF(A.DISEASE_YN = 'Y', 'Y', 'N') DISEASE_YN 			 , IF(A.RISK_WORKER_YN = 'Y', 'Y', 'N') RISK_WORKER_YN 			 , IFNULL(G.HAZARD_YN, 'N') HAZARD_YN 			 , IFNULL(G.SAFETY_YN, 'Y') SAFETY_YN 		  FROM TB_USER A  						 LEFT OUTER JOIN TB_BIZ C ON A.BIZ_ID = C.BIZ_ID  						 LEFT OUTER JOIN TB_USER_STATUS D ON D.BIZ_ID = C.UP_BIZ_ID AND A.USER_STATUS = D.USER_STATUS AND D.USE_YN = 'Y' 						 LEFT OUTER JOIN TB_DEVICE E ON A.USER_ID = E.USER_ID AND E.USE_YN = 'Y' 						 LEFT OUTER JOIN TB_ENTRY_INOUT F ON A.USER_ID = F.USER_ID AND F.DEVICE_ID = E.DEVICE_ID AND F.EFF_END_DT = '99991231235959' AND ENTRY_TYPE = 'A' 						 LEFT OUTER JOIN TB_AREA G ON F.AREA_ID = G.AREA_ID AND G.USE_YN = 'Y' 		 WHERE 1=1 		   AND A.BIZ_ID = ?		    		   AND A.USE_YN = ?) T";

  try {
    jwt.verify(body.token, key.ACCESS_TOKEN_SECRET);
    db.query(sql1, params, (err, result) => {
      if (!err) {
        console.log(result);
        res.send({
          status: "WorkerRegisterStatus success",
          data: result,
        });
      } else {
        console.log("WorkerRegisterStatus Data error");
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
