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

module.exports.getPopUpInfo = function getPopUpInfo(id) {
    return db.query(`SELECT * FROM images WHERE id=$1`, [id]);
};//getInfo close.

module.exports.getComment = function getComment(imageId) {
    return db.query(`SELECT * FROM comment WHERE image_id=$1`, [imageId])
}
module.exports.addComment = function addComment(comment, username, imgId) {
    return db.query(
        `INSERT INTO comment (comment, username, image_id)
         VALUES ($1, $2, $3) RETURNING created_at, id`,
        [comment, username, imgId]
    );
};//addComment close.
