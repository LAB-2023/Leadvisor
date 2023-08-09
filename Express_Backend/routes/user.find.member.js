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

  const sql1 =
    "SELECT A.SEND_USER_ID      , A.SEND_USER_NM 	 , CASE WHEN (DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s') > DATE_FORMAT(A.REG_DT, '%Y-%m-%d %H:%i:%s')) THEN DATE_FORMAT(A.REG_DT, '%m월%d일') ELSE DATE_FORMAT(A.REG_DT, '%Y-%m-%d %H:%i:%s') END '전송일'      , DATE_FORMAT(A.REG_DT, '%Y-%m-%d %H:%i:%s') '전송일시'      , B.RECV_USER_ID      , B.RECV_USER_NM      , B.SEND_STATUS      , B.READ_YN      , B.READ_DT   FROM TB_MSG A LEFT OUTER JOIN TB_MSG_SEND B ON A.MSG_SEQ = B.MSG_SEQ  WHERE A.BIZ_ID = ?    AND A.SEND_USER_ID = '0'    AND A.SEND_USER_NM = ?       AND A.MSG_SEQ = ? ;";
  const params = [body.BIZ_ID, body.SEND_USER_NM, body.MSG_SEQ];
  try {
    jwt.verify(body.token, key.ACCESS_TOKEN_SECRET);
    db.query(sql1, params, (err, result) => {
      if (!err) {
        console.log(result);
        res.send({
          status: "userMessageTab general Data success",
          data: result,
        });
      } else {
        console.log("userMessageTab general Data error");
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
