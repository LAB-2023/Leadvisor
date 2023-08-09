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
  const sql1 =
    "SELECT SUM(CASE WHEN A.STD_CODE = '01' OR A.STD_CODE = '02' OR A.STD_CODE = '03' OR A.STD_CODE = '04' THEN 1 ELSE 0 END) FINEDUST,        SUM(CASE WHEN A.STD_CODE = '07' THEN 1 ELSE 0 END) 'TEMPERATURE',        SUM(CASE WHEN A.STD_CODE != '01' AND A.STD_CODE != '02' AND A.STD_CODE != '03' AND A.STD_CODE != '04' AND A.STD_CODE != '07' THEN 1 ELSE 0 END) ETC   FROM TB_ALERT A LEFT OUTER JOIN TB_CODE B ON A.STD_CODE = B.CODE_ID AND B.CODE_GRP_ID = '0021' AND B.CODE_ID != '00' AND B.USE_YN = 'Y' 		  LEFT OUTER JOIN TB_SENSOR C ON A.SENSOR_ID = C.SENSOR_ID AND C.USE_YN = 'Y' 		  LEFT OUTER JOIN TB_SENSOR_TYPE D ON C.SENSOR_TYPE_ID = D.SENSOR_TYPE_ID AND D.USE_YN = 'Y' 		  LEFT OUTER JOIN TB_AREA E ON A.AREA_ID = E.AREA_ID AND E.USE_YN = 'Y'  WHERE A.BIZ_ID = ?    AND A.COMPLETE_YN = 'N' /* 미조치된 건 */    AND A.ALERT_TYPE = '04'    AND A.REG_DT >= DATE_FORMAT(NOW(), '%Y-%m-%d 00:00:00');";

  try {
    jwt.verify(body.token, key.ACCESS_TOKEN_SECRET);
    db.query(sql1, BIZ_ID, (err, result) => {
      if (!err) {
        console.log(result);
        res.send({
          status: "EnviromentWarning success",
          data: result,
        });
      } else {
        console.log("EnviromentWarning Data error");
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
