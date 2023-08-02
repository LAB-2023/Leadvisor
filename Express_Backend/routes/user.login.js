const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());
const cors = require("cors");
app.use(cors());
const db = require("../src/db_config");
const jwt = require("jsonwebtoken");
const key = require("../src/jwt_config");
const crypto = require("crypto");
var CryptoJS = require("crypto-js");

app.get("/", function (req, res) {
  let body = req.query;
  console.log(body);
  const encryptInfo = body.encryptInfo;
  console.log(encryptInfo);
  const secretKey = "1234";
  const pw_secretKey = "eie3u3788sa";

  // 받아온 값을 복호화 -> 비밀번호를 암호화
  var bytes = CryptoJS.AES.decrypt(encryptInfo, secretKey);
  var decrypted = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  console.log("decrypted:", decrypted);
  console.log("decrypted:", decrypted["OrganizationID"]);
  console.log("decrypted:", decrypted["userName"]);
  console.log("decrypted:", decrypted["userPassword"]);
  const LOGIN_ORGANIZATION = decrypted["OrganizationID"];
  const LOGIN_NAME = decrypted["userName"];
  let BIZ_ID;

  const params_BIZ_ID = [LOGIN_ORGANIZATION, LOGIN_NAME];
  const sql =
    "SELECT A.BIZ_ID   FROM TB_BIZ A INNER JOIN TB_ADMIN_USER B ON A.BIZ_ID = B.BIZ_ID  WHERE A.CUST_LOGIN_ID = ?    AND B.LOGIN_ID = ?;";

  db.query(sql, params_BIZ_ID, (err, result) => {
    if (!err) {
      //console.log("Get BIZ_ID: " + JSON.stringify(result).substring(12, 18));
      BIZ_ID = JSON.stringify(result).substring(12, 18);
    } else {
      console.log("data error");
    }

    //console.log("BIZ_ID: " + BIZ_ID);
    const pw = decrypted["userPassword"] + BIZ_ID + LOGIN_NAME + pw_secretKey;
    const LOGIN_PW = crypto.createHash("sha256").update(pw).digest("hex");
    //console.log("LOGIN_PW :" + LOGIN_PW);

    //console.log("sha256 decrypted: ", LOGIN_PW);

    const sql1 =
      "SELECT A.BIZ_ID, A.BIZ_NM, A.BIZ_TYPE, A.CUST_LOGIN_ID, CASE WHEN A.BIZ_TYPE = '01' THEN A.BIZ_ID ELSE B.BIZ_ID END AS CUST_BIZ_ID, CASE WHEN A.BIZ_TYPE = '01' THEN A.BIZ_NM ELSE B.BIZ_NM END AS CUST_BIZ_NM, C.LOGIN_ID, C.ADMIN_NM FROM TB_BIZ A LEFT OUTER JOIN TB_BIZ B ON A.UP_BIZ_ID = B.BIZ_ID AND A.USE_YN = 'Y' AND B.USE_YN = 'Y' LEFT OUTER JOIN TB_ADMIN_USER C ON A.BIZ_ID = C.BIZ_ID AND A.USE_YN = 'Y' WHERE 1=1 AND C.USE_YN = 'Y' AND A.CUST_LOGIN_ID = ? AND C.LOGIN_ID = ? AND C.LOGIN_PW = ?;";
    const params = [LOGIN_ORGANIZATION, LOGIN_NAME, LOGIN_PW];
    db.query(sql1, params, (err, result) => {
      if (!err && result[0] != null) {
        //BIZ_ID가 일치하는 TB_Biz내용 불러오기
        const sql2 = "SELECT * FROM sbrtls.TB_BIZ WHERE BIZ_ID= ? ;";
        db.query(sql2, BIZ_ID, (err, data) => {
          if (!err) {
            const payload = {
              CUST_LOGIN_ID: LOGIN_ORGANIZATION,
            };
            res.send({
              message: "Login success",
              status: "success",
              data: data,
              token: jwt.sign(payload, key.ACCESS_TOKEN_SECRET, {
                expiresIn: "1d",
              }),
              refreshtoken: jwt.sign(payload, key.REFRESH_TOKEN_SECRET, {
                expiresIn: "30d",
              }),
            });
          } else {
            console.log("Call Data error");
            res.send({ message: "fail", status: "fail" });
          }
        });
      } else {
        console.log("Login error");
        res.send({
          message: "Login fail",
          status: "fail",
        });
      }
    });
  });
});

module.exports = app;
