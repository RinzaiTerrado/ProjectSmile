const express = require('express');
const app = express();
const multer = require('multer');
const path = require('path');
const db = require('../models/db.js');
const controller = require('../controller/controller.js');

// Set storage engine
const storage = multer.diskStorage({
  destination: './public/images/profile/',
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

function checkFileType(file, cb) {
  // Allowed extensions
  const filetypes = /jpeg|jpg|png|gif/;
  // Check extension
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime type
  const mimetype = filetypes.test(file.mimetype);

  console.log("check here" + extname);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!')
  }
}

// Init Upload
const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB (adjust the size as needed)
  },
}).single('myImage');


function postadAdd(req, file) {
    const mobileNumber = req.body.mobileNumber.trim();
    const fullName = req.body.fullName.trim();
    const userType = req.body.userType.trim();
    const username = req.body.username.trim();
    const email = req.body.email.trim();
    const password = req.body.password.trim();
    const image = file.originalname;
    //console.log(" image avalue =" + image);
    //console.log(fullName + " " + userType + " " + username + " " + email + " " + mobileNumber + " " + password + " " + image);
    db.insert_user(fullName, userType, username, email, mobileNumber, password, image, "0");
    db.insert_log("New user was created " + fullName, 1, 0);
  }
function postadUpdate(req, file) {
  const id= req.body.id;
  const mobileNumber = req.body.mobileNumber.trim();
  const fullName = req.body.fullName.trim();
  const userType = req.body.userType.trim();
  const username = req.body.username.trim();
  const email = req.body.email.trim();
  const password = req.body.password.trim();
  const image = file.originalname;
  //console.log(fullName + " " + userType + " " + username + " " + email + " " + mobileNumber + " " + password + " " + image);
  db.update_fulluser(id,fullName, userType, username, email, mobileNumber, password, image);
  //db.insert_user(fullName, userType, username, email, mobileNumber, password, image);
  db.insert_log("user " + id + " was edited",1,0);
}

app.get('/', controller.getIndex);

// Upload route
app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
      if (err) {
        console.log('Error happened:', err);
        res.render('error', {
          msg: err
        });
      } else {
        console.log(req.file);
        if (req.file == undefined) {
          console.log('No file selected');
          res.render('error', {
            msg: 'Error: No file Selected!'
          });
        } else {
          console.log('File Uploaded');
          postadAdd(req, req.file); // Call the function with the file object
          res.redirect("/adManage");
        }
      }
    });
  });
// Upload route
app.post('/uploadedit', (req, res) => {
    upload(req, res, (err) => {
      if (err) {
        console.log('Error happened:', err);
        res.render('error', {
          msg: err
        });
      } else {
        console.log(req.file);
        if (req.file == undefined) {
          console.log('No file selected');
          res.render('error', {
            msg: 'Error: No file Selected!'
          });
        } else {
          console.log('File Uploaded');
          postadUpdate(req, req.file); // Call the function with the file object
          res.redirect("/adManage");
        }
      }
    });
  });
module.exports = app;
