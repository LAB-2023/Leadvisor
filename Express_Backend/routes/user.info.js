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
  const BIZ_ID = body.BIZ_ID;

  const sql1 = "SELECT * FROM sbrtls.TB_BIZ WHERE BIZ_ID= ? ;";

  try {
    jwt.verify(body.token, key.ACCESS_TOKEN_SECRET);
    db.query(sql1, BIZ_ID, (err, result) => {
      if (!err) {
        console.log(result);
        res.send({
          data: result,
        });
      } else {
        console.log("Data error");
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
