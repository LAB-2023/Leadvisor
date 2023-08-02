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
    "SELECT A.MSG_SEQ      , CASE WHEN (DATE_FORMAT(NOW(), '%Y-%m-%d') <= DATE_FORMAT(A.REG_DT, '%Y-%m-%d')) THEN DATE_FORMAT(A.REG_DT, '%p %h:%i') ELSE DATE_FORMAT(A.REG_DT, '%m월%d일') END '전송일'      , DATE_FORMAT(A.REG_DT, '%Y년%m월%d일 %p %h:%i') '전송일시'      , A.SEND_USER_NM      , A.SEND_CONTENT      , B.SEND_STATUS      , COUNT(*) MSG_CNT      , CASE WHEN COUNT(*) > 1 THEN CONCAT(MAX(B.RECV_USER_NM), '+', COUNT(*)-1)             WHEN COUNT(*) = 1 THEN MAX(B.RECV_USER_NM)             ELSE ''         END MAIN_RECV_NAME   FROM TB_MSG A LEFT OUTER JOIN TB_MSG_SEND B ON A.MSG_SEQ = B.MSG_SEQ AND B.DEL_YN = 'N'  WHERE A.BIZ_ID = ?    AND A.SEND_USER_NM = '관리자'  GROUP BY A.MSG_SEQ, A.REG_DT, A.SEND_USER_NM, A.SEND_CONTENT, B.SEND_STATUS  ORDER BY MSG_SEQ DESC";
  const sql2 =
    "SELECT (SELECT COUNT(*) FROM TB_MSG WHERE BIZ_ID = ? AND SEND_USER_NM = '관리자' AND REG_DT >= DATE_FORMAT(NOW(), '%Y-%m-%d 00:00:00')) TODAY_SEND_MSG_CNT FROM DUAL";
  const sql3 =
    "SELECT A.MSG_SEQ   FROM TB_MSG A LEFT OUTER JOIN TB_MSG_SEND B ON A.MSG_SEQ = B.MSG_SEQ AND B.DEL_YN = 'N'  WHERE A.BIZ_ID = ?    AND A.SEND_USER_NM = '관리자'  GROUP BY A.MSG_SEQ, A.REG_DT, A.SEND_USER_NM, A.SEND_CONTENT, B.SEND_STATUS  ORDER BY MSG_SEQ DESC";
  try {
    jwt.verify(body.token, key.ACCESS_TOKEN_SECRET);
    db.query(sql1, body.BIZ_ID, (err, result) => {
      if (!err) {
        console.log(result);
        db.query(sql2, body.BIZ_ID, (err, count) => {
          db.query(sql3, body.BIZ_ID, (err, seq) => {
            res.send({
              status: "user send list Data success",
              data: result,
              count: count,
              seq: seq,
            });
          });
        });
      } else {
        console.log("user send list Data error");
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
