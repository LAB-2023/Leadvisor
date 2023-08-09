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
  const BIZ_ID = [body.BIZ_ID];
  const total_sql =
    "SELECT B.CODE_NM,        A.ALERT_SEQ,        D.SENSOR_TYPE_NM,        E.AREA_NM,        DATE_FORMAT(A.REG_DT, '%Y-%m-%d %H:%i:%s') DATE,        A.WARNING_LEVEL /* 경고레벨(0:정상,1:주의,2:경고,3:긴급) */ ,        A.COMPLETE_YN   FROM TB_ALERT A LEFT OUTER JOIN TB_CODE B ON A.STD_CODE = B.CODE_ID AND B.CODE_GRP_ID = '0021' AND B.CODE_ID != '00' AND B.USE_YN = 'Y' 		  LEFT OUTER JOIN TB_SENSOR C ON A.SENSOR_ID = C.SENSOR_ID AND C.USE_YN = 'Y' 		  LEFT OUTER JOIN TB_SENSOR_TYPE D ON C.SENSOR_TYPE_ID = D.SENSOR_TYPE_ID AND D.USE_YN = 'Y' 		  LEFT OUTER JOIN TB_AREA E ON A.AREA_ID = E.AREA_ID AND E.USE_YN = 'Y'  WHERE A.BIZ_ID = ?    AND A.ALERT_TYPE = '04' AND A.COMPLETE_YN = 'N' /* 미조치된 건 */    AND A.REG_DT >= DATE_FORMAT(NOW(), '%Y-%m-%d 00:00:00')  ORDER BY A.COMPLETE_YN DESC, ALERT_SEQ;";
  const pm2_5_sql =
    "SELECT B.CODE_NM,        A.ALERT_SEQ,        D.SENSOR_TYPE_NM,        E.AREA_NM,        DATE_FORMAT(A.REG_DT, '%Y-%m-%d %H:%i:%s') DATE,        A.WARNING_LEVEL /* 경고레벨(0:정상,1:주의,2:경고,3:긴급) */ ,        A.COMPLETE_YN   FROM TB_ALERT A LEFT OUTER JOIN TB_CODE B ON A.STD_CODE = B.CODE_ID AND B.CODE_GRP_ID = '0021' AND B.CODE_ID != '00' AND B.USE_YN = 'Y' 		  LEFT OUTER JOIN TB_SENSOR C ON A.SENSOR_ID = C.SENSOR_ID AND C.USE_YN = 'Y' 		  LEFT OUTER JOIN TB_SENSOR_TYPE D ON C.SENSOR_TYPE_ID = D.SENSOR_TYPE_ID AND D.USE_YN = 'Y' 		  LEFT OUTER JOIN TB_AREA E ON A.AREA_ID = E.AREA_ID AND E.USE_YN = 'Y'  WHERE A.BIZ_ID = ?    AND A.ALERT_TYPE = '04' AND A.COMPLETE_YN = 'N' /* 미조치된 건 */    AND A.STD_CODE IN ('01','02','03','04')    AND A.REG_DT >= DATE_FORMAT(NOW(), '%Y-%m-%d 00:00:00')  ORDER BY A.COMPLETE_YN DESC, ALERT_SEQ;";
  const pm10_sql =
    "SELECT B.CODE_NM,        A.ALERT_SEQ,        D.SENSOR_TYPE_NM,        E.AREA_NM,        DATE_FORMAT(A.REG_DT, '%Y-%m-%d %H:%i:%s') DATE,        A.WARNING_LEVEL /* 경고레벨(0:정상,1:주의,2:경고,3:긴급) */ ,        A.COMPLETE_YN   FROM TB_ALERT A LEFT OUTER JOIN TB_CODE B ON A.STD_CODE = B.CODE_ID AND B.CODE_GRP_ID = '0021' AND B.CODE_ID != '00' AND B.USE_YN = 'Y' 		  LEFT OUTER JOIN TB_SENSOR C ON A.SENSOR_ID = C.SENSOR_ID AND C.USE_YN = 'Y' 		  LEFT OUTER JOIN TB_SENSOR_TYPE D ON C.SENSOR_TYPE_ID = D.SENSOR_TYPE_ID AND D.USE_YN = 'Y' 		  LEFT OUTER JOIN TB_AREA E ON A.AREA_ID = E.AREA_ID AND E.USE_YN = 'Y'  WHERE A.BIZ_ID = ?    AND A.ALERT_TYPE = '04' AND A.COMPLETE_YN = 'N' /* 미조치된 건 */    AND A.STD_CODE IN ('07')    AND A.REG_DT >= DATE_FORMAT(NOW(), '%Y-%m-%d 00:00:00')  ORDER BY A.COMPLETE_YN DESC, ALERT_SEQ;";
  const carbon_sql =
    "SELECT B.CODE_NM,        A.ALERT_SEQ,        D.SENSOR_TYPE_NM,        E.AREA_NM,        DATE_FORMAT(A.REG_DT, '%Y-%m-%d %H:%i:%s') DATE,        A.WARNING_LEVEL /* 경고레벨(0:정상,1:주의,2:경고,3:긴급) */ ,        A.COMPLETE_YN   FROM TB_ALERT A LEFT OUTER JOIN TB_CODE B ON A.STD_CODE = B.CODE_ID AND B.CODE_GRP_ID = '0021' AND B.CODE_ID != '00' AND B.USE_YN = 'Y' 		  LEFT OUTER JOIN TB_SENSOR C ON A.SENSOR_ID = C.SENSOR_ID AND C.USE_YN = 'Y' 		  LEFT OUTER JOIN TB_SENSOR_TYPE D ON C.SENSOR_TYPE_ID = D.SENSOR_TYPE_ID AND D.USE_YN = 'Y' 		  LEFT OUTER JOIN TB_AREA E ON A.AREA_ID = E.AREA_ID AND E.USE_YN = 'Y'  WHERE A.BIZ_ID = ?    AND A.ALERT_TYPE = '04'    AND A.COMPLETE_YN = 'N' /* 미조치된 건 */    AND A.STD_CODE IN ('05','06','08','09','10','11','12','13','14','15','16')    AND A.REG_DT >= DATE_FORMAT(NOW(), '%Y-%m-%d 00:00:00')  ORDER BY A.COMPLETE_YN DESC, ALERT_SEQ;";

  //   try{
  //     jwt.verify(body.token, key.ACCESS_TOKEN_SECRET);
  //   db.query(total_sql, BIZ_ID, (err, result) => {
  //       if (!err) {
  //         console.log(result);
  //           res.send({
  //               status: "EnviromentWarningList success",
  //               data: result
  //           });
  //       } else {
  //           console.log("EnviromentWarningList Data error");
  //           res.send({message: "fail", status: "fail"});
  //       }
  //   });
  // } catch (err) {
  //   console.log("-1");
  //         console.error(err);
  //         return res.send({
  //             status: "fail",
  //             });
  // }
  // });
  // module.exports = app;

  try {
    jwt.verify(body.token, key.ACCESS_TOKEN_SECRET);
    db.query(total_sql, BIZ_ID, (err, result) => {
      if (!err) {
        db.query(pm2_5_sql, BIZ_ID, (err2, result2) => {
          if (!err2) {
            db.query(pm10_sql, BIZ_ID, (err3, result3) => {
              if (!err3) {
                db.query(carbon_sql, BIZ_ID, (err4, result4) => {
                  if (!err4) {
                    res.send({
                      status: "Environment Data success",
                      data: result,
                      PM2_5_data: result2,
                      PM10_data: result3,
                      carbon_data: result4,
                    });
                  } else {
                    console.log("Carbon Data error");
                    res.send({ status: "fail" });
                  }
                });
              } else {
                console.log("PM10 Data error");
                res.send({ status: "fail" });
              }
            });
          } else {
            console.log("PM2.5 Data error");
            res.send({ status: "fail" });
          }
        });
      } else {
        console.log("Environment Data error");
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
