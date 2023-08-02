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
  const params = [body.BIZ_ID, body.BIZ_ID, body.BIZ_ID];
  console.log(params);
  const sql1 =
    "SELECT '0' USER_ID, '0' USER_NM, A.DEPT_ID, A.DEPT_NM, A.DEPT_ID_LEV1, A.DEPT_ID_LEV2, A.DEPT_ID_LEV3, A.DEPT_ID_LEV4 FROM TB_DEPT A WHERE A.BIZ_ID = ? UNION ALL SELECT A.USER_ID , A.USER_NM , A.DEPT_ID , T.DEPT_NM , T.DEPT_ID_LEV1 , T.DEPT_ID_LEV2 , T.DEPT_ID_LEV3 , T.DEPT_ID_LEV4 FROM TB_USER A INNER JOIN TB_DEVICE C ON A.USER_ID = C.USER_ID AND C.USE_YN = 'Y'  AND C.DEVICE_TYPE = '01' LEFT OUTER JOIN (SELECT A.BIZ_ID , A.DEPT_ID , A.DEPT_NM , A.DEPT_ID_LEV1 , A.DEPT_ID_LEV2 , A.DEPT_ID_LEV3 , A.DEPT_ID_LEV4			 FROM TB_DEPT A LEFT JOIN TB_DEPT B ON B.DEPT_ID = A.UP_DEPT_ID LEFT JOIN TB_DEPT C ON C.DEPT_ID = B.UP_DEPT_ID LEFT JOIN TB_DEPT D ON D.DEPT_ID = C.UP_DEPT_ID  WHERE A.BIZ_ID = ?) T ON A.DEPT_ID = T.DEPT_ID WHERE A.BIZ_ID = ? AND A.USE_YN = 'Y' ORDER BY  DEPT_ID IS NULL ASC,  DEPT_ID_LEV1, DEPT_ID_LEV2, DEPT_ID_LEV3, DEPT_ID_LEV4;";
  // const sqlDNM = "select DEPT_NM , DEPT_ID FROM TB_DEPT where DEPT_NM in (SELECT DEPT_NM  FROM (SELECT '0' USER_ID, '0' USER_NM, A.DEPT_ID, A.DEPT_NM, A.DEPT_ID_LEV1, A.DEPT_ID_LEV2, A.DEPT_ID_LEV3, A.DEPT_ID_LEV4 FROM TB_DEPT A WHERE A.BIZ_ID = ? UNION ALL SELECT A.USER_ID , A.USER_NM , A.DEPT_ID , T.DEPT_NM , T.DEPT_ID_LEV1 , T.DEPT_ID_LEV2 , T.DEPT_ID_LEV3 , T.DEPT_ID_LEV4 FROM TB_USER A INNER JOIN TB_DEVICE C ON A.USER_ID = C.USER_ID AND C.USE_YN = 'Y'  AND C.DEVICE_TYPE = '01' LEFT OUTER JOIN (SELECT A.BIZ_ID , A.DEPT_ID , A.DEPT_NM , A.DEPT_ID_LEV1 , A.DEPT_ID_LEV2 , A.DEPT_ID_LEV3 , A.DEPT_ID_LEV4			 FROM TB_DEPT A LEFT JOIN TB_DEPT B ON B.DEPT_ID = A.UP_DEPT_ID LEFT JOIN TB_DEPT C ON C.DEPT_ID = B.UP_DEPT_ID LEFT JOIN TB_DEPT D ON D.DEPT_ID = C.UP_DEPT_ID  WHERE A.BIZ_ID = ?) T ON A.DEPT_ID = T.DEPT_ID WHERE A.BIZ_ID = ? AND A.USE_YN = 'Y' ORDER BY  DEPT_ID IS NULL ASC,  DEPT_ID_LEV1, DEPT_ID_LEV2, DEPT_ID_LEV3, DEPT_ID_LEV4) as a GROUP BY DEPT_NM);";
  const sqlDNM =
    "SELECT DEPT_NM,DEPT_ID FROM (SELECT '0' USER_ID, '0' USER_NM, A.DEPT_ID, A.DEPT_NM, A.DEPT_ID_LEV1, A.DEPT_ID_LEV2, A.DEPT_ID_LEV3, A.DEPT_ID_LEV4 FROM TB_DEPT A WHERE A.BIZ_ID = ? UNION ALL SELECT A.USER_ID , A.USER_NM , A.DEPT_ID , T.DEPT_NM , T.DEPT_ID_LEV1 , T.DEPT_ID_LEV2 , T.DEPT_ID_LEV3 , T.DEPT_ID_LEV4 FROM TB_USER A INNER JOIN TB_DEVICE C ON A.USER_ID = C.USER_ID AND C.USE_YN = 'Y'  AND C.DEVICE_TYPE = '01' LEFT OUTER JOIN (SELECT A.BIZ_ID , A.DEPT_ID , A.DEPT_NM , A.DEPT_ID_LEV1 , A.DEPT_ID_LEV2 , A.DEPT_ID_LEV3 , A.DEPT_ID_LEV4			 FROM TB_DEPT A LEFT JOIN TB_DEPT B ON B.DEPT_ID = A.UP_DEPT_ID LEFT JOIN TB_DEPT C ON C.DEPT_ID = B.UP_DEPT_ID LEFT JOIN TB_DEPT D ON D.DEPT_ID = C.UP_DEPT_ID  WHERE A.BIZ_ID = ?) T ON A.DEPT_ID = T.DEPT_ID WHERE A.BIZ_ID = ? AND A.USE_YN = 'Y' ORDER BY  DEPT_ID IS NULL ASC,  DEPT_ID_LEV1, DEPT_ID_LEV2, DEPT_ID_LEV3, DEPT_ID_LEV4) as a GROUP BY DEPT_NM,DEPT_ID;";

  try {
    jwt.verify(body.token, key.ACCESS_TOKEN_SECRET);
    db.query(sql1, params, (err, result) => {
      if (!err) {
        console.log(result.length);

        db.query(sqlDNM, params, (err2, result2) => {
          if (!err) {
            console.log(result2);
            res.send({
              status: "addressBook List DB success",
              data: result,
              DEPT_NM: result2,
            });
          } else {
            console.log("addressBook List DB fail" + err2);
            res.send({ status: "fail" });
          }
        });
      } else {
        console.log("addressBook List DB fail");
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
