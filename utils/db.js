// spicedPg setup
const spicedPg = require("spiced-pg");

//DB Auth
const dbUrl = process.env.DATABASE_URL || `postgres:postgres:postgres@localhost:5432/salt-imageboard`;
var db = spicedPg(dbUrl);


module.exports.getInfo = function getInfo() {
    return db.query(`SELECT * FROM images`);
};//getInfo close.

module.exports.addData = function addData(
    url, username, title, description) {
        return db.query(
            `INSERT INTO images (url, username, title, description)
             VALUES ($1, $2, $3, $4) RETURNING id`,
             [url, username, title, description]);
};//addData close.
