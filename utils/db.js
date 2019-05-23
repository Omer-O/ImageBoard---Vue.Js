// spicedPg setup
const spicedPg = require("spiced-pg");

//DB Auth
const dbUrl = process.env.DATABASE_URL || `postgres:postgres:postgres@localhost:5432/salt-imageboard`;
var db = spicedPg(dbUrl);


module.exports.getInfo = function getInfo() {
    return db.query(`SELECT * FROM images`);
};
