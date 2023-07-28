const express = require('express');
const controller = require('../controller/controller.js');
const app = express.Router();

app.get('/', controller.getIndex);
//signin
app.post('/signin', controller.postSignin);
app.get('/signin',controller.getSignin);
//signinfrontdesk
app.post('/fdsignin', controller.postfdSignin);
app.get('/fdsignin', controller.getfdSignin);
//apointment
app.post('/appoint', controller.postAppoint);
//forgot
app.post('/forgot', controller.postForgot);
app.get('/forgot', controller.getForgot);
//patient list
app.post('/fdPatient', controller.postfdPatient);
app.get('/fdPatient', controller.getfdPatient);
//front desk appointment list
app.post('/fdAppoint', controller.postfdAppoint);
app.get('/fdAppoint', controller.getfdAppoint);
//front desk schedule
app.post('/fdSched', controller.postfdSched);
app.get('/fdSched', controller.getfdSched);
//front desk list
app.post('/fdList', controller.postfdList);
app.get('/fdList', controller.getfdList);
//front desk patient info
app.post('/fdPatientInformation', controller.postfdPatient);
app.get('/fdPatientInformation', controller.getfdPatient);
//front desk patient history
app.post('/fdHistory', controller.postfdHistory);
app.get('/fdHistory', controller.getfdHistory);
//fd verify
app.post('/fdVerify',controller.postfdVerify);
//admin patient list
app.get('/adList', controller.getadList);
//admin appointment
app.get('/adAppoint', controller.getadAppoint);
//admin manage
app.get('/adManage', controller.getadManage);
//admin sched
app.post('/adSched', controller.postadSched);
app.get('/adSched', controller.getadSched);
//admin patient info
app.post('/adPatientInformation', controller.postadPatient);
app.get('/adPatientInformation', controller.getadPatient);
//admin verify
app.post('/adVerify',controller.postadVerify);
//admin manage user
app.post('/adMan', controller.postadMan);
app.get('/adMan', controller.getadMan);
//admin delete user
app.post('/deleteuser', controller.postdeleteuser);
//admin edit user
app.post('/edituser', controller.postedituser);
//admin logout
app.post('/adlogout', controller.postadlogout);
//admin add user
app.post('/adAdd', controller.postadAdd);
app.get('/adAdd', controller.getadAdd);

//admin logout
app.post('/fdlogout', controller.postfdlogout);

//delete notification
app.post('/deleteNotif', controller.postdeletenotif);



/* 404 route */
app.get('*', function(req, res) { res.render('error', {}); } );


module.exports = app;

