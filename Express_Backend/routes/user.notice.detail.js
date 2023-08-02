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
  const params = [body.USE_YN, body.NOTICE_ID];
  const sql1 =
    "SELECT A.NOTICE_ID      , A.BIZ_ID      , A.TITLE      , A.CONTEXTS      , A.USE_YN      , DATE_FORMAT(A.REG_DT, '%Y-%m-%d %H:%i:%s') REG_DT      , B.BIZ_NM   FROM TB_NOTICE A INNER JOIN TB_BIZ B ON A.BIZ_ID = B.BIZ_ID AND B.USE_YN = ?  WHERE A.NOTICE_ID = ?;";
  try {
    jwt.verify(body.token, key.ACCESS_TOKEN_SECRET);
    db.query(sql1, params, (err, result) => {
      if (!err) {
        console.log(result);
        res.send({
          status: "user notice detail Data success",
          data: result,
        });
      } else {
        console.log("user notice detail Data error");
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
