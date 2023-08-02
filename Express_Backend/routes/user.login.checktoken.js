const jwt = require("jsonwebtoken");
const key = require("../src/jwt_config");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
app.use(bodyParser.json());
app.use(cors());
const db = require("../src/db_config.js");

app.get("/", function (req, res) {
  let body = req.query;

  let decoded;
  const payload = {
    CUST_LOGIN_ID: body.CUST_LOGIN_ID,
  };
  try {
    // verify를 통해 값 decode!
    jwt.verify(body.refreshtoken, key.REFRESH_TOKEN_SECRET);

    res.send({
      message: "Login success",
      status: "success",
      token: jwt.sign(payload, key.ACCESS_TOKEN_SECRET, { expiresIn: "1d" }),
      refreshtoken: jwt.sign(payload, key.REFRESH_TOKEN_SECRET, {
        expiresIn: "30d",
      }),
    });
  } catch (err) {
    res.send({
      status: "fail",
    });
  }
});
module.exports = app;
