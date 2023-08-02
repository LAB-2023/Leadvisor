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
  const params = [body.CUST_LOGIN_ID, body.ALERT_SEQ];

  const sql1 =
    "UPDATE TB_ALERT      SET COMPLETE_YN = 'Y'      , REMARK = '조치완료'      , UPD_ID = ?     , UPD_DT = NOW()  WHERE ALERT_SEQ = ? ;";

  try {
    jwt.verify(body.token, key.ACCESS_TOKEN_SECRET);
    db.query(sql1, params, (err, result) => {
      if (!err) {
        console.log(result);
        res.send({
          status: "ACTION success",
          data: result,
        });
      } else {
        console.log("ACTION Data error");
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
