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
    "SELECT COUNT(*)      , TRUNCATE(SUM(CASE WHEN T.MAPPING_CNT > 0 THEN 1 ELSE 0 END)/COUNT(*), 2) WORK_RATE /* 등록수 대비*/   FROM (SELECT A.USER_ID 	     , A.USER_NM 	     , (SELECT COUNT(*) 		  FROM TB_DEVICE B 		 WHERE A.USER_ID = B.USER_ID 		   AND B.USE_YN = 'Y') MAPPING_CNT 	  FROM TB_USER A 	 WHERE 1=1 	   AND A.BIZ_ID = ?	   AND A.USE_YN = ?) T;";

  try {
    jwt.verify(body.token, key.ACCESS_TOKEN_SECRET);
    db.query(sql1, params, (err, result) => {
      if (!err) {
        console.log(result);
        res.send({
          status: "WorkerRate success",
          data: result,
        });
      } else {
        console.log("WorkerRate Data error");
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
