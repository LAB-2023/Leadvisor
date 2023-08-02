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
  const params1 = [body.BIZ_ID, body.USE_YN];
  const params2 = [body.BIZ_ID, body.USE_YN, body.MARKED];

  let sql = "";
  let params = [];
  const sql1 =
    "SELECT A.NOTICE_ID      , DATE_FORMAT(A.REG_DT, '%Y-%m-%d %H:%i:%s') '전송일시', A.BIZ_ID      , A.TITLE      , A.CONTEXTS      , A.USE_YN   FROM TB_NOTICE A  WHERE A.BIZ_ID = ?    AND A.USE_YN = ?  ORDER BY A.NOTICE_ID DESC;";
  const sql2 =
    "SELECT A.NOTICE_ID      , A.BIZ_ID      , A.TITLE      , A.CONTEXTS      , A.USE_YN      , DATE_FORMAT(A.REG_DT, '%Y-%m-%d %H:%i:%s') '전송일시'   FROM TB_NOTICE A  WHERE A.BIZ_ID = ?    AND A.USE_YN = ?    AND DATE_FORMAT(A.REG_DT, '%Y-%m-%d') = ?  ORDER BY A.NOTICE_ID DESC;";

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
          status: "user notice Data success",
          data: result,
        });
      } else {
        console.log("user notice Data error");
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
