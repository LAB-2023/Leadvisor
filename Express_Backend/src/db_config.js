var mysql = require("mysql");
var db = mysql.createConnection({
    host: "210.95.145.226",
    user: "admin",
    password: "aiot13579",
    database: "sbrtls",
});
db.connect();
module.exports = db;