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
  const params = [body.BIZ_ID, body.USE_YN];
  const sql1 =
    "SELECT A.USER_ID 	 , A.USER_NM 	 , A.GENDER 	,A.DEPT_ID , A.USER_STATUS 	 , IFNULL(D.USER_STATUS_NM, '작업종료') USER_STATUS_NM 	 , CASE WHEN A.BIRTH IS NOT NULL AND A.BIRTH != '' THEN (DATE_FORMAT(NOW(), '%Y') - DATE_FORMAT(A.BIRTH,'%Y')) + 1 			ELSE -1 		END AS AGE 	 , IF(A.DISEASE_YN = 'Y', 'Y', 'N') DISEASE_YN 	 , IF(A.RISK_WORKER_YN = 'Y', 'Y', 'N') RISK_WORKER_YN 	 , IFNULL(G.HAZARD_YN, 'N') HAZARD_YN 	 , IFNULL(G.SAFETY_YN, 'N') SAFETY_YN 	 , E.DEVICE_NUM 	 , IFNULL(G.AREA_NM, '-') AREA_NM   FROM TB_USER A  				 LEFT OUTER JOIN TB_BIZ C ON A.BIZ_ID = C.BIZ_ID  				 LEFT OUTER JOIN TB_USER_STATUS D ON D.BIZ_ID = C.UP_BIZ_ID AND A.USER_STATUS = D.USER_STATUS AND D.USE_YN = 'Y' 				 LEFT OUTER JOIN TB_DEVICE E ON A.USER_ID = E.USER_ID AND E.USE_YN = 'Y' 				 LEFT OUTER JOIN TB_ENTRY_INOUT F ON A.USER_ID = F.USER_ID AND F.DEVICE_ID = E.DEVICE_ID AND F.EFF_END_DT = '99991231235959' AND ENTRY_TYPE = 'A' 				 LEFT OUTER JOIN TB_AREA G ON F.AREA_ID = G.AREA_ID AND G.USE_YN = 'Y'  WHERE 1=1    AND A.BIZ_ID = ?		       AND A.USE_YN = ?";

  const agedSQL =
    "SELECT * " +
    "FROM (SELECT A.USER_ID " +
    ", A.USER_NM " +
    ", A.GENDER " +
    ", A.USER_STATUS " +
    ", D.USER_STATUS_NM " +
    ", CASE WHEN A.BIRTH IS NOT NULL AND A.BIRTH != '' THEN (DATE_FORMAT(NOW(), '%Y') - DATE_FORMAT(A.BIRTH,'%Y')) + 1 " +
    "ELSE -1 " +
    "END AS AGE " +
    ", IF(A.DISEASE_YN = 'Y', 'Y', 'N') DISEASE_YN " +
    ", IF(A.RISK_WORKER_YN = 'Y', 'Y', 'N') RISK_WORKER_YN " +
    ", IFNULL(G.HAZARD_YN, 'N') HAZARD_YN " +
    ", IFNULL(G.SAFETY_YN, 'N') SAFETY_YN " +
    ", IF(A.FAVORITE_YN = 'Y', 'Y', 'N') FAVORITE_YN " +
    "FROM TB_USER A LEFT OUTER JOIN TB_BIZ C ON A.BIZ_ID = C.BIZ_ID " +
    "LEFT OUTER JOIN TB_USER_STATUS D ON D.BIZ_ID = C.UP_BIZ_ID AND A.USER_STATUS = D.USER_STATUS AND D.USE_YN = 'Y' " +
    "LEFT OUTER JOIN TB_DEVICE E ON A.USER_ID = E.USER_ID AND E.USE_YN = 'Y' AND E.DEVICE_TYPE = '01' " +
    "LEFT OUTER JOIN TB_ENTRY_INOUT F ON A.USER_ID = F.USER_ID AND F.DEVICE_ID = E.DEVICE_ID AND F.EFF_END_DT = '99991231235959' AND ENTRY_TYPE = 'A' " +
    "LEFT OUTER JOIN TB_AREA G ON F.AREA_ID = G.AREA_ID AND G.USE_YN = 'Y' " +
    "WHERE 1=1 " +
    "AND A.BIZ_ID = ? " +
    "AND A.USE_YN = ?) T " +
    "WHERE 1=1 " +
    "AND T.AGE >= 65;";

  const workingSQL =
    "SELECT * " +
    "FROM (SELECT A.USER_ID " +
    ", A.USER_NM " +
    ", A.GENDER " +
    ", A.USER_STATUS " +
    ", D.USER_STATUS_NM " +
    ", CASE WHEN A.BIRTH IS NOT NULL AND A.BIRTH != '' THEN (DATE_FORMAT(NOW(), '%Y') - DATE_FORMAT(A.BIRTH,'%Y')) + 1 " +
    "ELSE -1 " +
    "END AS AGE " +
    ", IF(A.DISEASE_YN = 'Y', 'Y', 'N') DISEASE_YN " +
    ", IF(A.RISK_WORKER_YN = 'Y', 'Y', 'N') RISK_WORKER_YN " +
    ", IFNULL(G.HAZARD_YN, 'N') HAZARD_YN " +
    ", IFNULL(G.SAFETY_YN, 'N') SAFETY_YN " +
    ", IF(A.FAVORITE_YN = 'Y', 'Y', 'N') FAVORITE_YN " +
    "FROM TB_USER A LEFT OUTER JOIN TB_BIZ C ON A.BIZ_ID = C.BIZ_ID " +
    "LEFT OUTER JOIN TB_USER_STATUS D ON D.BIZ_ID = C.UP_BIZ_ID AND A.USER_STATUS = D.USER_STATUS AND D.USE_YN = 'Y' " +
    "LEFT OUTER JOIN TB_DEVICE E ON A.USER_ID = E.USER_ID AND E.USE_YN = 'Y' AND E.DEVICE_TYPE = '01' " +
    "LEFT OUTER JOIN TB_ENTRY_INOUT F ON A.USER_ID = F.USER_ID AND F.DEVICE_ID = E.DEVICE_ID AND F.EFF_END_DT = '99991231235959' AND ENTRY_TYPE = 'A' " +
    "LEFT OUTER JOIN TB_AREA G ON F.AREA_ID = G.AREA_ID AND G.USE_YN = 'Y' " +
    "WHERE 1=1 " +
    "AND A.BIZ_ID = ? " +
    "AND A.USE_YN = ?) T " +
    "WHERE 1=1 " +
    "AND T.USER_STATUS_NM = '작업시작';";

  const youngSQL =
    "SELECT * " +
    "FROM (SELECT A.USER_ID " +
    ", A.USER_NM " +
    ", A.GENDER " +
    ", A.USER_STATUS " +
    ", D.USER_STATUS_NM " +
    ", CASE WHEN A.BIRTH IS NOT NULL AND A.BIRTH != '' THEN (DATE_FORMAT(NOW(), '%Y') - DATE_FORMAT(A.BIRTH,'%Y')) + 1 " +
    "ELSE -1 " +
    "END AS AGE " +
    ", IF(A.DISEASE_YN = 'Y', 'Y', 'N') DISEASE_YN " +
    ", IF(A.RISK_WORKER_YN = 'Y', 'Y', 'N') RISK_WORKER_YN " +
    ", IFNULL(G.HAZARD_YN, 'N') HAZARD_YN " +
    ", IFNULL(G.SAFETY_YN, 'N') SAFETY_YN " +
    ", IF(A.FAVORITE_YN = 'Y', 'Y', 'N') FAVORITE_YN " +
    "FROM TB_USER A LEFT OUTER JOIN TB_BIZ C ON A.BIZ_ID = C.BIZ_ID " +
    "LEFT OUTER JOIN TB_USER_STATUS D ON D.BIZ_ID = C.UP_BIZ_ID AND A.USER_STATUS = D.USER_STATUS AND D.USE_YN = 'Y' " +
    "LEFT OUTER JOIN TB_DEVICE E ON A.USER_ID = E.USER_ID AND E.USE_YN = 'Y' AND E.DEVICE_TYPE = '01' " +
    "LEFT OUTER JOIN TB_ENTRY_INOUT F ON A.USER_ID = F.USER_ID AND F.DEVICE_ID = E.DEVICE_ID AND F.EFF_END_DT = '99991231235959' AND ENTRY_TYPE = 'A' " +
    "LEFT OUTER JOIN TB_AREA G ON F.AREA_ID = G.AREA_ID AND G.USE_YN = 'Y' " +
    "WHERE 1=1 " +
    "AND A.BIZ_ID = ? " +
    "AND A.USE_YN = ?) T " +
    "WHERE 1=1 " +
    "AND T.AGE < 65;";

  const DiseaseSQL =
    "SELECT * " +
    "FROM (SELECT A.USER_ID " +
    ", A.USER_NM " +
    ", A.GENDER " +
    ", A.USER_STATUS " +
    ", D.USER_STATUS_NM " +
    ", CASE WHEN A.BIRTH IS NOT NULL AND A.BIRTH != '' THEN (DATE_FORMAT(NOW(), '%Y') - DATE_FORMAT(A.BIRTH,'%Y')) + 1 " +
    "ELSE -1 " +
    "END AS AGE " +
    ", IF(A.DISEASE_YN = 'Y', 'Y', 'N') DISEASE_YN " +
    ", IF(A.RISK_WORKER_YN = 'Y', 'Y', 'N') RISK_WORKER_YN " +
    ", IFNULL(G.HAZARD_YN, 'N') HAZARD_YN " +
    ", IFNULL(G.SAFETY_YN, 'N') SAFETY_YN " +
    ", IF(A.FAVORITE_YN = 'Y', 'Y', 'N') FAVORITE_YN " +
    "FROM TB_USER A LEFT OUTER JOIN TB_BIZ C ON A.BIZ_ID = C.BIZ_ID " +
    "LEFT OUTER JOIN TB_USER_STATUS D ON D.BIZ_ID = C.UP_BIZ_ID AND A.USER_STATUS = D.USER_STATUS AND D.USE_YN = 'Y' " +
    "LEFT OUTER JOIN TB_DEVICE E ON A.USER_ID = E.USER_ID AND E.USE_YN = 'Y' AND E.DEVICE_TYPE = '01' " +
    "LEFT OUTER JOIN TB_ENTRY_INOUT F ON A.USER_ID = F.USER_ID AND F.DEVICE_ID = E.DEVICE_ID AND F.EFF_END_DT = '99991231235959' AND ENTRY_TYPE = 'A' " +
    "LEFT OUTER JOIN TB_AREA G ON F.AREA_ID = G.AREA_ID AND G.USE_YN = 'Y' " +
    "WHERE 1=1 " +
    "AND A.BIZ_ID = ? " +
    "AND A.USE_YN = ?) T " +
    "WHERE 1=1 " +
    "AND T.DISEASE_YN = 'Y';";

  const RiskSQL =
    "SELECT * " +
    "FROM (SELECT A.USER_ID " +
    ", A.USER_NM " +
    ", A.GENDER " +
    ", A.USER_STATUS " +
    ", D.USER_STATUS_NM " +
    ", CASE WHEN A.BIRTH IS NOT NULL AND A.BIRTH != '' THEN (DATE_FORMAT(NOW(), '%Y') - DATE_FORMAT(A.BIRTH,'%Y')) + 1 " +
    "ELSE -1 " +
    "END AS AGE " +
    ", IF(A.DISEASE_YN = 'Y', 'Y', 'N') DISEASE_YN " +
    ", IF(A.RISK_WORKER_YN = 'Y', 'Y', 'N') RISK_WORKER_YN " +
    ", IFNULL(G.HAZARD_YN, 'N') HAZARD_YN " +
    ", IFNULL(G.SAFETY_YN, 'N') SAFETY_YN " +
    ", IF(A.FAVORITE_YN = 'Y', 'Y', 'N') FAVORITE_YN " +
    "FROM TB_USER A LEFT OUTER JOIN TB_BIZ C ON A.BIZ_ID = C.BIZ_ID " +
    "LEFT OUTER JOIN TB_USER_STATUS D ON D.BIZ_ID = C.UP_BIZ_ID AND A.USER_STATUS = D.USER_STATUS AND D.USE_YN = 'Y' " +
    "LEFT OUTER JOIN TB_DEVICE E ON A.USER_ID = E.USER_ID AND E.USE_YN = 'Y' AND E.DEVICE_TYPE = '01' " +
    "LEFT OUTER JOIN TB_ENTRY_INOUT F ON A.USER_ID = F.USER_ID AND F.DEVICE_ID = E.DEVICE_ID AND F.EFF_END_DT = '99991231235959' AND ENTRY_TYPE = 'A' " +
    "LEFT OUTER JOIN TB_AREA G ON F.AREA_ID = G.AREA_ID AND G.USE_YN = 'Y' " +
    "WHERE 1=1 " +
    "AND A.BIZ_ID = ? " +
    "AND A.USE_YN = ?) T " +
    "WHERE 1=1 " +
    "AND T.RISK_WORKER_YN = 'Y';";

  const maleSQL =
    "SELECT * " +
    "FROM (SELECT A.USER_ID " +
    ", A.USER_NM " +
    ", A.GENDER " +
    ", A.USER_STATUS " +
    ", D.USER_STATUS_NM " +
    ", CASE WHEN A.BIRTH IS NOT NULL AND A.BIRTH != '' THEN (DATE_FORMAT(NOW(), '%Y') - DATE_FORMAT(A.BIRTH,'%Y')) + 1 " +
    "ELSE -1 " +
    "END AS AGE " +
    ", IF(A.DISEASE_YN = 'Y', 'Y', 'N') DISEASE_YN " +
    ", IF(A.RISK_WORKER_YN = 'Y', 'Y', 'N') RISK_WORKER_YN " +
    ", IFNULL(G.HAZARD_YN, 'N') HAZARD_YN " +
    ", IFNULL(G.SAFETY_YN, 'N') SAFETY_YN " +
    ", IF(A.FAVORITE_YN = 'Y', 'Y', 'N') FAVORITE_YN " +
    "FROM TB_USER A LEFT OUTER JOIN TB_BIZ C ON A.BIZ_ID = C.BIZ_ID " +
    "LEFT OUTER JOIN TB_USER_STATUS D ON D.BIZ_ID = C.UP_BIZ_ID AND A.USER_STATUS = D.USER_STATUS AND D.USE_YN = 'Y' " +
    "LEFT OUTER JOIN TB_DEVICE E ON A.USER_ID = E.USER_ID AND E.USE_YN = 'Y' AND E.DEVICE_TYPE = '01' " +
    "LEFT OUTER JOIN TB_ENTRY_INOUT F ON A.USER_ID = F.USER_ID AND F.DEVICE_ID = E.DEVICE_ID AND F.EFF_END_DT = '99991231235959' AND ENTRY_TYPE = 'A' " +
    "LEFT OUTER JOIN TB_AREA G ON F.AREA_ID = G.AREA_ID AND G.USE_YN = 'Y' " +
    "WHERE 1=1 " +
    "AND A.BIZ_ID = ? " +
    "AND A.USE_YN = ?) T " +
    "WHERE 1=1 " +
    "AND T.GENDER = 'M';";

  const femaleSQL =
    "SELECT * " +
    "FROM (SELECT A.USER_ID " +
    ", A.USER_NM " +
    ", A.GENDER " +
    ", A.USER_STATUS " +
    ", D.USER_STATUS_NM " +
    ", CASE WHEN A.BIRTH IS NOT NULL AND A.BIRTH != '' THEN (DATE_FORMAT(NOW(), '%Y') - DATE_FORMAT(A.BIRTH,'%Y')) + 1 " +
    "ELSE -1 " +
    "END AS AGE " +
    ", IF(A.DISEASE_YN = 'Y', 'Y', 'N') DISEASE_YN " +
    ", IF(A.RISK_WORKER_YN = 'Y', 'Y', 'N') RISK_WORKER_YN " +
    ", IFNULL(G.HAZARD_YN, 'N') HAZARD_YN " +
    ", IFNULL(G.SAFETY_YN, 'N') SAFETY_YN " +
    ", IF(A.FAVORITE_YN = 'Y', 'Y', 'N') FAVORITE_YN " +
    "FROM TB_USER A LEFT OUTER JOIN TB_BIZ C ON A.BIZ_ID = C.BIZ_ID " +
    "LEFT OUTER JOIN TB_USER_STATUS D ON D.BIZ_ID = C.UP_BIZ_ID AND A.USER_STATUS = D.USER_STATUS AND D.USE_YN = 'Y' " +
    "LEFT OUTER JOIN TB_DEVICE E ON A.USER_ID = E.USER_ID AND E.USE_YN = 'Y' AND E.DEVICE_TYPE = '01' " +
    "LEFT OUTER JOIN TB_ENTRY_INOUT F ON A.USER_ID = F.USER_ID AND F.DEVICE_ID = E.DEVICE_ID AND F.EFF_END_DT = '99991231235959' AND ENTRY_TYPE = 'A' " +
    "LEFT OUTER JOIN TB_AREA G ON F.AREA_ID = G.AREA_ID AND G.USE_YN = 'Y' " +
    "WHERE 1=1 " +
    "AND A.BIZ_ID = ? " +
    "AND A.USE_YN = ?) T " +
    "WHERE 1=1 " +
    "AND T.GENDER = 'F';";

  try {
    jwt.verify(body.token, key.ACCESS_TOKEN_SECRET);
    db.query(sql1, params, (err, result) => {
      if (!err) {
        db.query(agedSQL, params, (err2, result2) => {
          if (!err2) {
            db.query(youngSQL, params, (err3, result3) => {
              if (!err3) {
                db.query(workingSQL, params, (err4, result4) => {
                  if (!err4) {
                    db.query(DiseaseSQL, params, (err5, result5) => {
                      if (!err5) {
                        db.query(RiskSQL, params, (err6, result6) => {
                          if (!err6) {
                            db.query(maleSQL, params, (err7, result7) => {
                              if (!err7) {
                                db.query(femaleSQL, params, (err8, result8) => {
                                  if (!err8) {
                                    res.send({
                                      status: "WorkerList success",
                                      data: result,
                                      aged: result2,
                                      young: result3,
                                      working: result4,
                                      disease: result5,
                                      risk: result6,
                                      male: result7,
                                      female: result8,
                                    });
                                  } else {
                                    console.log("WorkerList Data error");
                                    res.send({ status: "fail" });
                                  }
                                });
                              } else {
                                console.log("WorkerList Data error");
                                res.send({ status: "fail" });
                              }
                            });
                          } else {
                            console.log("WorkerList Data error");
                            res.send({ status: "fail" });
                          }
                        });
                      } else {
                        console.log("WorkerList Data error");
                        res.send({ status: "fail" });
                      }
                    });
                  } else {
                    console.log("WorkerList Data error");
                    res.send({ status: "fail" });
                  }
                });
              } else {
                console.log("WorkerList Data error");
                res.send({ status: "fail" });
              }
            });
          } else {
            console.log("WorkerList Data error");
            res.send({ status: "fail" });
          }
        });
      } else {
        console.log("WorkerList Data error");
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
