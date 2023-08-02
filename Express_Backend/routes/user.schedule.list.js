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
  const params1 = [body.BIZ_ID, body.USE_YN, body.BIZ_ID];
  const params2 = [body.BIZ_ID, body.USE_YN, body.BIZ_ID, body.MARKED];
  let sql = "";
  let params = [];

  const sql1 =
    "SELECT A.SCHEDULE_SEQ      , A.BIZ_ID      , A.TARGET_GRP      , A.DEPT_ID      , A.USER_ID      , A.TITLE      , A.CONTENT      , A.LOCATION      , A.START_DT      , A.END_DT      , A.START_TIME      , A.END_TIME      , CONCAT(SUBSTR(A.START_DT,1,4), '-', SUBSTR(A.START_DT,5,2), '-', SUBSTR(A.START_DT,7,2), ' ', A.START_TIME) FULL_START_TIME      , CONCAT(SUBSTR(A.END_DT,1,4), '-', SUBSTR(A.END_DT,5,2), '-', SUBSTR(A.END_DT,7,2), ' ', A.END_TIME) FULL_END_TIME      , A.USE_YN      , A.REG_ID      , DATE_FORMAT(A.REG_DT, '%Y-%m-%d %H:%i:%s') REG_DT      , IFNULL(DEPT_NM, '전체부서') DEPT_NM   FROM TB_SCHEDULE A        LEFT OUTER JOIN (SELECT A.BIZ_ID 			     , A.DEPT_ID 			     , CASE WHEN A.LEVEL_ID = '1' THEN A.DEPT_NM 					WHEN A.LEVEL_ID = '2' THEN CONCAT_WS(' > ', B.DEPT_NM, A.DEPT_NM) 					WHEN A.LEVEL_ID = '3' THEN CONCAT_WS(' > ', C.DEPT_NM, B.DEPT_NM, A.DEPT_NM) 					ELSE CONCAT_WS(' > ', D.DEPT_NM, C.DEPT_NM, B.DEPT_NM, A.DEPT_NM) 				    END DEPT_NM 			  FROM TB_DEPT A  			       LEFT JOIN TB_DEPT B ON B.DEPT_ID = A.UP_DEPT_ID 			       LEFT JOIN TB_DEPT C ON C.DEPT_ID = B.UP_DEPT_ID 			       LEFT JOIN TB_DEPT D ON D.DEPT_ID = C.UP_DEPT_ID 			 WHERE A.BIZ_ID = ?) GR ON GR.BIZ_ID = A.BIZ_ID AND GR.DEPT_ID = A.DEPT_ID  WHERE 1=1    AND A.USE_YN = ?    AND A.BIZ_ID = ?  ORDER BY A.SCHEDULE_SEQ DESC;";
  const sql2 =
    "SELECT A.SCHEDULE_SEQ      , A.BIZ_ID      , A.TARGET_GRP      , A.DEPT_ID      , A.USER_ID      , A.TITLE      , A.CONTENT      , A.LOCATION      , A.START_DT      , A.END_DT      , A.START_TIME      , A.END_TIME      , CONCAT(SUBSTR(A.START_DT,1,4), '-', SUBSTR(A.START_DT,5,2), '-', SUBSTR(A.START_DT,7,2), ' ', A.START_TIME) FULL_START_TIME      , CONCAT(SUBSTR(A.END_DT,1,4), '-', SUBSTR(A.END_DT,5,2), '-', SUBSTR(A.END_DT,7,2), ' ', A.END_TIME) FULL_END_TIME      , A.USE_YN      , A.REG_ID      , DATE_FORMAT(A.REG_DT, '%Y-%m-%d %H:%i:%s') REG_DT      , IFNULL(DEPT_NM, '전체부서') DEPT_NM   FROM TB_SCHEDULE A        LEFT OUTER JOIN (SELECT A.BIZ_ID 			     , A.DEPT_ID 			     , CASE WHEN A.LEVEL_ID = '1' THEN A.DEPT_NM 					WHEN A.LEVEL_ID = '2' THEN CONCAT_WS(' > ', B.DEPT_NM, A.DEPT_NM) 					WHEN A.LEVEL_ID = '3' THEN CONCAT_WS(' > ', C.DEPT_NM, B.DEPT_NM, A.DEPT_NM) 					ELSE CONCAT_WS(' > ', D.DEPT_NM, C.DEPT_NM, B.DEPT_NM, A.DEPT_NM) 				    END DEPT_NM 			  FROM TB_DEPT A  			       LEFT JOIN TB_DEPT B ON B.DEPT_ID = A.UP_DEPT_ID 			       LEFT JOIN TB_DEPT C ON C.DEPT_ID = B.UP_DEPT_ID 			       LEFT JOIN TB_DEPT D ON D.DEPT_ID = C.UP_DEPT_ID 			 WHERE A.BIZ_ID = ?) GR ON GR.BIZ_ID = A.BIZ_ID AND GR.DEPT_ID = A.DEPT_ID  WHERE 1=1    AND A.USE_YN = ?    AND A.BIZ_ID = ?    AND DATE_FORMAT(A.START_DT, '%Y-%m-%d') = ?  ORDER BY A.SCHEDULE_SEQ DESC;";
  if (body.MARKED == undefined) {
    sql = sql1;
    params = params1;
  } else {
    sql = sql2;
    params = params2;
  }
  try {
    jwt.verify(body.token, key.ACCESS_TOKEN_SECRET);
    db.query(sql, params, (err, result) => {
      if (!err) {
        console.log(result);
        res.send({
          status: "user schedule list Data success",
          data: result,
        });
      } else {
        console.log("user schedule list Data error");
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
