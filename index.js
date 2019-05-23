const express = require('express');
const app = express();
const db = require('./utils/db');
const bodyParser = require('body-parser');
const multer = require('multer');

app.use(express.static('./public'));
/////////////////////////
//copy paste from class:
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

app.post('/upload,', uploader.single('file'), function(req, res) {
    // If nothing went wrong the file is already in the uploads directory
    if (req.file) {
        res.json({
            success: true
        });
    } else {
        res.json({
            success: false
        });
    }
});
//until here copy pase in class
///////////////////////
app.get('/imageboard', (req, res) => {
    db.getInfo().then(result => {
        console.log('this is result:', result);
        res.json(result.rows);
    }).catch(error => {
        console.log(error);
    });
});

app.listen(8080, () => console.log('!I vue js!'));
