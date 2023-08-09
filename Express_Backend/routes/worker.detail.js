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
  const params = [body.BIZ_ID, body.USE_YN, body.USER_ID];
  const sql1 =
    "SELECT A.USER_ID 	 , A.USER_NM 	 , A.GENDER 	 , CASE WHEN A.GENDER = 'M' THEN '남' ELSE '여' END GENDER_NM 	 , DATE_FORMAT(A.BIRTH, '%Y.%m.%d') BIRTH_FORMAT 	 , A.USER_STATUS 	 , A.BIRTH 	 , IFNULL(D.USER_STATUS_NM, '작업종료') USER_STATUS_NM 	 , CASE WHEN A.BIRTH IS NOT NULL AND A.BIRTH != '' THEN (DATE_FORMAT(NOW(), '%Y') - DATE_FORMAT(A.BIRTH,'%Y')) + 1 			ELSE -1 		END AS AGE 	 , IF(A.DISEASE_YN = 'Y', 'Y', 'N') DISEASE_YN 	 , IF(A.RISK_WORKER_YN = 'Y', 'Y', 'N') RISK_WORKER_YN 	 , IFNULL(G.HAZARD_YN, 'N') HAZARD_YN 	 , IFNULL(G.SAFETY_YN, 'N') SAFETY_YN 	 , E.DEVICE_NUM 	 , IFNULL(G.AREA_NM, '-') AREA_NM 	 , DATE_FORMAT(H.START_TIME, '%Y-%m-%d %H:%i:%s') '출근'      , DATE_FORMAT(H.END_TIME, '%Y-%m-%d %H:%i:%s') '퇴근' 	 , (SELECT S_VAL 		  FROM TB_BIO_DATA M 		 WHERE 1=1 		   AND A.BIZ_ID = M.BIZ_ID 		   AND A.USER_ID = M.USER_ID 		   AND E.DEVICE_ID  = E.DEVICE_ID  		   AND M.COMMAND = 'HRM' 		 ORDER BY DATA_SEQ DESC 		 LIMIT 1) HRM   FROM TB_USER A  				 LEFT OUTER JOIN TB_BIZ C ON A.BIZ_ID = C.BIZ_ID  				 LEFT OUTER JOIN TB_USER_STATUS D ON D.BIZ_ID = C.UP_BIZ_ID AND A.USER_STATUS = D.USER_STATUS AND D.USE_YN = 'Y' 				 LEFT OUTER JOIN TB_DEVICE E ON A.USER_ID = E.USER_ID AND E.USE_YN = 'Y' 				 LEFT OUTER JOIN TB_ENTRY_INOUT F ON A.USER_ID = F.USER_ID AND F.DEVICE_ID = E.DEVICE_ID AND F.EFF_END_DT = '99991231235959' AND ENTRY_TYPE = 'A' 				 LEFT OUTER JOIN TB_AREA G ON F.AREA_ID = G.AREA_ID AND G.USE_YN = 'Y' 				 LEFT OUTER JOIN TB_WORK_TIME H ON A.USER_ID = F.USER_ID AND H.WORK_DT = DATE_FORMAT(NOW(),'%Y%m%d')   WHERE 1=1    AND A.BIZ_ID = ?	       AND A.USE_YN = ?    AND A.USER_ID = ?";

  try {
    jwt.verify(body.token, key.ACCESS_TOKEN_SECRET);
    db.query(sql1, params, (err, result) => {
      if (!err) {
        console.log(result);
        res.send({
          status: "WorkerList success",
          data: result,
        });
      } else {
        console.log("WorkerList Data error");
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
