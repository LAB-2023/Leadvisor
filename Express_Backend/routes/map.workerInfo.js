// const express = require("express");
// const app = express();
// const bodyParser = require("body-parser");
// const cors = require("cors");
// app.use(bodyParser.json());
// app.use(cors());
// const db = require("../src/db_config.js");

// const jwt = require("jsonwebtoken");
// const key = require("../src/jwt_config");

// app.get("/", function (req, res) {
//   let body = req.query;
//   const ALERT_SEQ = body.ALERT_SEQ;
//   const sql1 =
//     "SELECT A.ALERT_SEQ      , A.BIZ_ID      , A.DEVICE_ID      , B.DEVICE_NUM /* DEVICE 번호:ID */      , C.USER_NM /* 사용자명 */      , F.AREA_NM /* 현재위치 */      , CASE WHEN C.BIRTH IS NOT NULL AND C.BIRTH != '' THEN (DATE_FORMAT(NOW(), '%Y') - DATE_FORMAT(C.BIRTH,'%Y')) + 1 		    ELSE -1 		END AS AGE      , IF(C.DISEASE_YN = 'Y', 'Y', 'N') DISEASE_YN      , A.ALERT_TYPE   FROM TB_ALERT A LEFT OUTER JOIN TB_DEVICE B ON A.DEVICE_ID = B.DEVICE_ID AND B.USE_YN = 'Y'   				  LEFT OUTER JOIN TB_USER C ON A.USER_ID = C.USER_ID AND C.USE_YN = 'Y'   				  LEFT OUTER JOIN TB_TAG_MAPPING D ON A.TAG_ID = D.TAG_ID AND A.USER_ID = D.USER_ID AND D.EFF_END_DT = '99991231235959'   				  LEFT OUTER JOIN TB_ENTRY_INOUT E ON E.ENTRY_TYPE = 'A' AND A.TAG_ID = E.TAG_ID AND A.USER_ID = E.USER_ID AND E.EFF_END_DT = '99991231235959'   				  LEFT OUTER JOIN TB_AREA F ON E.AREA_ID = F.AREA_ID AND F.USE_YN = 'Y'  WHERE 1=1     AND A.COMPLETE_YN = 'N' /* 미조치된 건 */    AND A.REG_DT > DATE_FORMAT(NOW(), '%Y-%m-%d 00:00:00')    AND A.ALERT_SEQ = ?";

//   try {
//     jwt.verify(body.token, key.ACCESS_TOKEN_SECRET);
//     db.query(sql1, ALERT_SEQ, (err, result) => {
//       if (!err) {
//         console.log(result);
//         res.send({
//           status: "WorkerInfo success",
//           data: result,
//         });
//       } else {
//         console.log("WorkerInfo Data error");
//         res.send({ message: "fail", status: "fail" });
//       }
//     });
//   } catch (err) {
//     console.log("-1");
//     console.error(err);
//     return res.send({
//       status: "fail",
//     });
//   }
// });
// module.exports = app;
