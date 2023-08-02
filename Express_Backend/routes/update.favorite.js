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

  params.push(body.FAVORITE_YN);
  params.push(body.USER_ID);

  const sql = "UPDATE TB_USER    SET FAVORITE_YN = ?  WHERE USER_ID = ?;";
  try {
    jwt.verify(body.token, key.ACCESS_TOKEN_SECRET);
    db.query(sql, params, (err, result) => {
      if (!err) {
        console.log(result);
        res.send({
          status: "UPDATE FAVORITE SUCCESS",
          data: result,
        });
      } else {
        console.log("UPDATE FAVORITE FAILED");
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
