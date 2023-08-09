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
  const params = [];

  params.push(body.REMARK);
  params.push(body.UPD_ID);
  params.push(body.ALERT_SEQ);

  console.log(params);

  const sql =
    "UPDATE TB_ALERT      SET COMPLETE_YN = 'Y'       , FIELD_REMARK = ?      , UPD_ID = ?      , UPD_DT = NOW()  WHERE ALERT_SEQ = ?;";
  try {
    jwt.verify(body.token, key.ACCESS_TOKEN_SECRET);
    db.query(sql, params, (err, result) => {
      console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
      console.log(body.token);
      console.log(result);
      if (!err) {
        console.log(result);
        res.send({
          status: "UPDATE SUCCESS",
          data: result,
        });
      } else {
        console.log("UPDATE FAILED");
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
