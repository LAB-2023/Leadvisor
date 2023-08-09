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
  console.log(body);
  const BIZ_TYPE = body.BIZ_TYPE;
  const BIZ_ID = body.BIZ_ID;
  const sql1 = "SELECT A.BIZ_NM, A.*   FROM TB_BIZ A  WHERE UP_BIZ_ID = ?;";
  const sql2 = "SELECT A.BIZ_NM, A.*   FROM TB_BIZ A  WHERE BIZ_ID = ?;";

  if (BIZ_TYPE == "01") {
    try {
      jwt.verify(body.token, key.ACCESS_TOKEN_SECRET);
      db.query(sql1, BIZ_ID, (err, result) => {
        if (!err) {
          console.log(result);
          res.send({
            status: "BIZ_TYPE: 01 DB access success",
            data: result,
          });
        } else {
          console.log("BIZ_TYPE: 01 DB access fail");
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
  } else if (BIZ_TYPE == "02") {
    try {
      jwt.verify(body.token, key.ACCESS_TOKEN_SECRET);
      db.query(sql2, BIZ_ID, (err, result) => {
        if (!err) {
          console.log("This is result");
          console.log(result);
          res.send({
            status: "BIZ_TYPE: 02 DB access success",
            data: result,
          });
        } else {
          console.log("BIZ_TYPE: 02 DB access fail");
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
  } else console.log("SELECT SITE DB BIZ_TYPE ERROR");
});
module.exports = app;
