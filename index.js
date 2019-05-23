const express = require('express');
const app = express();
const db = require('./utils/db');
const bodyParser = require('body-parser');
const multer = require('multer');
const s3 = require('./s3');
const path = require('path');
const uidSafe = require('uid-safe');


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
                .then(function() {
                    const imagePush = {
                        description: description,
                        title: title,
                        url: url,
                        username: username,
                        success: true
                        };
                            //console.log('imagePush :', imagePush);
                        res.json(imagePush);
                }).catch(function(err) {
                    console.log(err);
                });
        // if (req.file) {
        //     res.json({
        //         success: true
        //     });
        // } else {
        //     res.json({
        //         success: false
        //     });
        // }
});//uploader.single function close



app.listen(8080, () => console.log('!I vue js!'));
