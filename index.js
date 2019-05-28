const express = require('express');
const app = express();
const db = require('./utils/db');
const bodyParser = require('body-parser');
const multer = require('multer');
const s3 = require('./s3');
const path = require('path');
const uidSafe = require('uid-safe');

app.use(bodyParser.json());

var diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + '/uploads');
    },
    filename: function (req, file, callback) {
      uidSafe(24).then(function(uid) {
          callback(null, uid + path.extname(file.originalname));
      });
    }
});

var uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

app.use(express.static('./public'));

app.get('/imageboard', (req, res) => {
    db.getInfo().then(result => {
        //console.log('this is result:', result);
        res.json(result.rows);
    }).catch(error => {
        console.log(error);
    });
});

app.post('/upload', uploader.single('file'),
        s3.upload, function(req, res) {
            let { title, description, username } = req.body;
            let url = "https://s3.amazonaws.com/spicedling/" + req.file.filename;
            db.addData(url, username, title, description)
                .then(result => {
                    const image = {
                        id: result.rows[0].id,
                        description: description,
                        title: title,
                        url: url,
                        username: username,
                        success: true
                        }
                        console.log('imagePush :', image);
                        res.json(image);
                }).catch(function(err) {
                    console.log(err);
                });
});//uploader.single function c lose

app.get('/get-image-info/:id', (req, res) => {
    let id = req.params.id;
    db.getPopUpInfo(id).then(result => {
        let { description, title, url, username, created_at } =
            result.rows[0];
            console.log('log redult of get comment:', result);
            const popUp = {
                description: description,
                title: title,
                url: url,
                username: username,
                created_at: created_at,
                success: true
                }
            db.getComment(id).then(result  => {
                    const comments = result.rows;
                    console.log('Im popUp:', popUp);
                    console.log('Im comments:', comments);
                    res.json([
                        popUp, comments
                    ]);
            })
        }).catch(function(err) {
            console.log(err);
        });
});///app.get(get-image-info/:id) close.

app.post('/addComment', (req, res) => {
    let { comment, username, id } = req.body;
    console.log('this is req.body:', req.body);
    db.addComment( comment, username, id )
        .then(result => {
            console.log('this is results:', req.body);
            const newComment = {
                    user_comment: username,
                    comment: comment,
                    image_id: id,
                    comment_id: result.rows[0].id,
                    created_at: result.rows[0].created_at,
                    success: true
            };
            console.log(newComment);
            res.json(newComment);
        }).catch(function(err) {
            console.log(err);
        });
});//app.post('/addComment') close.

app.listen(8080, () => console.log('!I vue js!'));
