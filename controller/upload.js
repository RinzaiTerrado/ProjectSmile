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
  const image = file.originalname;db.update_fulluser(id,fullName, userType, username, email, mobileNumber, password, image);
  db.insert_log("user " + id + " was edited",1,0);
}

app.get('/', controller.getIndex);

// Upload route
app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
      const email = req.body.email;
      db.find_user(req.body.email, function(result){
          if(result == ""){//no results were found
            if (err) {
              console.log('Error happened:', err);
              
              db.query_console(function(result){
                var notifs ={};
                notifs = result;
                res.render('adAdd', {
                  msg: err, 
                  notifs
                });
              });
            } else {
              if (req.file == undefined) {
                console.log('No file selected');
                
                db.query_console(function(result){
                  var notifs ={};
                  notifs = result;
                  res.render('adAdd', {
                    msg: 'No file selected', 
                    notifs
                  });
                });
              } else {
                console.log('File Uploaded');
                postadAdd(req, req.file); // Call the function with the file object
                res.redirect("/adManage");
              }
            }
        } else { //email already exists
          console.log('Email already exists');
          
          db.query_console(function(result){
            var notifs ={};
            notifs = result;
            res.render('adAdd', {
              msg: 'Email already Exists', 
              notifs
            });
          });
          
        }
      });
    });
  });
// Upload route
app.post('/uploadedit', (req, res) => {
  upload(req, res, (err) => {
    const email = req.body.email;
    
    const oldEmail = req.body.oldEmail;
    db.find_user(req.body.email, function(result){
        if(req.body.email==oldEmail|| result.length == 0){//same email or no new email
          if (err) {
            console.log('Error happened:', err);
            res.render('adAdd', {
              msg: err
            });
          } else {
            console.log(req.file);

            if (req.file == undefined) {
              console.log('No new file found');
              const id= req.body.id;
              const mobileNumber = req.body.mobileNumber.trim();
              const fullName = req.body.fullName.trim();
              const userType = req.body.userType.trim();
              const username = req.body.username.trim();
              const email = req.body.email.trim();
              const password = req.body.password.trim();
              db.update_fullusernoimg(id,fullName, userType, username, email, mobileNumber, password);
              db.insert_log(fullName + " was edited.");
              res.redirect("/adManage");
            } else {
              console.log('File Uploaded');
              postadUpdate(req, req.file); // Call the function with the file object
              res.redirect("/adManage");
            }
          }
      } else { //email already exists
        var email = req.body.oldEmail;        
        db.find_user(email,function(result){
          var user = result[0];
          db.query_console(function(result){
              var notifs ={};
              notifs = result;
              res.render('adsystemaccountedit', {
                msg: 'Email already Exists', user,notifs});
          });
      });
      }
    });
  });
  });
module.exports = app;
