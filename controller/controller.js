const e = require("express");
const db_functions = require("../models/db");
const nodeMailer = require('nodemailer');
const { URL } = require('url'); // Import the URL module
const { verbose, Database } = require("sqlite3");

const controller = {
    getIndex: async function(req,res){
        res.render('patient');
    },
    postSignin:function(req,res){
        var email = req.body.email;
        var password = req.body.password;
        
        db_functions.query_users(function(result){
            console.log("list of users")
            console.log(result);
        });
        var user = db_functions.find_userpass(email,password, function(result){
            console.log(result);
            if(result == ""){//no results were found
                console.log("invalid credentials");

                res.render('login',{msg:'Invalid credentials.'});
            } else {
                if(result[0].userType == "Admin"){
                    db_functions.insert_log(result[0].email + " has successfully logged in",1,0);
                    db_functions.login(result[0].id, "Admin");
                    res.redirect('/adList');
                } else {
                    console.log("invalid credentials");    
                    res.render('login',{msg:'Invalid credentials.'});

                }
                
            }
                
        });
       //res.render('error');
        
    },
    getSignin:function(req,res){
        res.render('login');
        //console.error(err.message);
        /*
        if(email){//renders if success
            res.render('admin');
        } else {//if not found in database render error
            res.render('error');
        }
*/
    },
    getfdSignin:function(req,res){
        res.render('login-frontdesk');
    },
    postfdSignin:function(req,res){
        var email = req.body.email;
        var password = req.body.password;
        db_functions.query_users(function(result){
            console.log("list of users")
            console.log(result);
        });
        var user = db_functions.find_userpass(email,password, function(result){
            if(result == ""){//no results were found
                console.log("invalid credentials");

                res.render('login-frontdesk',{msg:'Invalid credentials.'});
            } else {
                if(result[0].userType == "Frontdesk"){
                    db_functions.insert_log(result[0].email + " has successfully logged in",1,0);
                    db_functions.login(result[0].id, "Frontdesk");
                    res.redirect('/fdList');
                } else {
                    console.log("invalid credentials");    
                    res.render('login-frontdesk',{msg:'Invalid credentials.'});

                }
                
            }
                
        });
       //res.render('error');
    },
    postSignup:function(req,res){
        var first_name = req.body.fname;
        var last_name = req.body.lname;
        var username = req.body.username;
        var email = req.body.email;
        var password = req.body.password;
        //check if username/email exists
        var user = db_functions.checkuser(email,username, function(result){
            if (result == ""){// username and email not found  in database 
                console.log("original username/email");
            } else {
                
            }
        });
        var user = db_functions.find_userpass(email,password, function(result){
            //res.send(result);
            if(result == ""){//no results were found
                console.log("invalid credentials");

                res.render('error');
            } else {
                console.log(result[0].email);
                res.render('index');
                
            }
                
        });
        
    },
    getSignup:function(req,res){
        var email = req.body.email;
        var password = req.body.password;
        var user = db_functions.find_userpass(email,password, function(result){
            //res.send(result);
            if(result == ""){//no results were found
                console.log("invalid credentials");

                res.render('error');
            } else {
                console.log(result[0].email);
                res.render('index');
                
            }
                
        });
        
    },
    postAppoint:function(req,res){
        var fullname = req.body.fullname.trim();
        var email = req.body.email.trim();
        var mobile = req.body.mobile.trim();
        var dentist = req.body.dentist.trim();
        var service = req.body.service.trim();
        var date = req.body.date.trim();
        var time = req.body.time.trim();
        db_functions.insert_appointment(fullname,email,mobile,dentist,service,date,time);
        db_functions.insert_log(fullname + " added an appointment",1,1);

       res.render('patient');
    },
    getForgot:function(req,res){
       res.render('forgetpassword');
    },
    postForgot: async function(req,res){
        const email = req.body.email;
        const verification = req.body.verification;
        const newpass = req.body.newpass;
        //send email
        const code = Math.floor(Math.random() * 999999);
        //random number generator
        const message = `
        <h1>Verification</h1>
        ` + code;
        const transporter = nodeMailer.createTransport({
            service: 'Gmail',
            auth:{
                user: "project.smile.finals@gmail.com",
                pass: "jmhggewqnzietiad"
            }
        });
        //check if email is in database
        
        var user = db_functions.find_user(email, async function(result){
            if(result == ""){//no results were found
                res.render('forgetpassword', {msg:'no users found'});
            } else {
                //if true
                if(result[0].verification == '0'){
                    console.log("sending email");
                    const info = await transporter.sendMail({
                        from: 'Project Smile <project.smile.finals@gmail.com>',
                        to:email,
                        subject: 'Verification',
                        html: message,
                    })
                    console.log("email sent");
                    console.log("verification sent: " + code);
                    db_functions.update_user(email, "verification", code);
                }
                console.log("users verification value is = "+result[0].verification);
                db_functions.find_user(email, function(result){
                    console.log("verification = " + verification);
                    console.log(result[0].verification);
                    if(verification != result[0].verification && verification != ""){
                        console.log("error")
                        res.render('forgetpassword');//resets if false

                    } else {
                        if(newpass != ""){
                            db_functions.update_user(email,"password",newpass);
                            db_functions.update_user(email,'verification','0');
                            db_functions.insert_log(email + " has successfully changed their password",1,0);
                            res.render('forgetpassword');//resets if false
                        }
                    }
                });
            }
                
        });
       //res.render('forgetpassword');
    },
    postfdPatient:function(req,res){
        db_functions.get_login(function(result){
            if(result[0].userType == "Frontdesk"){
		//is frontdesk account
                const name = req.body.fullName;
                console.log("name = "+ name);
                db_functions.find_userhistory
                db_functions.find_userhistory(name,function(result){
                    var appointment = result;
                     
                    db_functions.query_consolefd(function(result){
                        var notifs ={};
                        notifs = result;
                        res.render('fdpatientinformation', {appointment,notifs});
                    });
                });
            } else {                
                res.redirect('/fdsignin')
            }
        });
    },
    getfdPatient:function(req,res){
        db_functions.get_login(function(result){
            if(result[0].userType == "Frontdesk"){
                db_functions.query_appointments(function(result){
                    var appointment = {};
                    appointment = result;
                    db_functions.query_consolefd(function(result){
                        var notifs ={};
                        notifs = result;
                        res.render('appointment',{appointment,notifs});
                    });
                });
            } else {
                res.redirect('/fdsignin')
            }
        });
    },
    postfdAppoint:function(req,res){
        db_functions.get_login(function(result){
            if(result[0].userType == "Frontdesk"){
		//is frontdesk account
        
                db_functions.query_consolefd(function(result){
                    var notifs ={};
                    notifs = result;
                    res.render('fdpatientinformation', {notifs});
                });
            } else {
                res.redirect('/fdsignin')
            }
        });
    },
    getfdAppoint:function(req,res){
        db_functions.get_login(function(result){
            if(result[0].userType == "Frontdesk"){
                db_functions.query_appointments(function(result){
                    var appointment = {};
                    appointment = result;
                    
                    db_functions.query_consolefd(function(result){
                        var notifs ={};
                        notifs = result;
                        res.render('fdappointment',{appointment, notifs});
                    });
                });
            } else {
                res.redirect('/fdsignin')
            }
        });
        
    },
    postfdSched:function(req,res){
        db_functions.get_login(function(result){
            if(result[0].userType == "Frontdesk"){
		//is frontdesk account
                const id = req.body.id
                db_functions.find_appointment(id,function(result){
                    var appointment = result[0];
                    
                    db_functions.query_consolefd(function(result){
                        var notifs ={};
                        notifs = result;
                        res.render('fdschedule', {appointment,notifs});
                    });
                });
            } else {
                res.redirect('/fdsignin')
            }
        });
        
    },
    getfdSched:function(req,res){
        db_functions.get_login(function(result){
            if(result[0].userType == "Frontdesk"){
		//is frontdesk account
        
                db_functions.query_consolefd(function(result){
                    var notifs ={};
                    notifs = result;
                    res.render('fdschedule', {notifs});
                });
            } else {
                res.redirect('/fdsignin')
            }
        });
        
    },
    getfdPatient:function(req,res){
        db_functions.get_login(function(result){
            if(result[0].userType == "Frontdesk"){
                db_functions.query_consolefd(function(result){
                    var notifs ={};
                    notifs = result;
                    res.render('fdpatientinformation',{notifs});
                });
            } else {
                res.redirect('/fdsignin')
            }
        });
    },
    postfdHistory:function(req,res){
        db_functions.get_login(function(result){
            if(result[0].userType == "Frontdesk"){
		//is frontdesk account
                db_functions.query_consolefd(function(result){
                    var notifs ={};
                    notifs = result;
                    res.render('fdhistory',{notifs});
                });
        res.render('fdhistory');
            } else {
                res.redirect('/fdsignin')
            }
        });
    },
    getfdHistory:function(req,res){
        db_functions.get_login(function(result){
            if(result[0].userType == "Frontdesk"){
		//is frontdesk account
                db_functions.query_consolefd(function(result){
                    var notifs ={};
                    notifs = result;
                    res.render('fdhistory',{notifs});
                });
            } else {
                res.redirect('/fdsignin')
            }
        });
    },
    postfdList:function(req,res){
        db_functions.get_login(function(result){
            if(result[0].userType == "Frontdesk"){
		//is frontdesk account
            db_functions.query_consolefd(function(result){
                var notifs ={};
                notifs = result;
                res.render('fdlist',{notifs});
            });
            } else {
                res.redirect('/fdsignin')
            }
        });
    },
    getfdList:function(req,res){
        db_functions.get_login(function(result){
            if(result[0].userType == "Frontdesk"){
		//is frontdesk account
                db_functions.query_uniqueappointments(function(result){
                    var patient = {};
                    patient = result;

                    db_functions.query_consolefd(function(result){
                        var notifs ={};
                        notifs = result;
                        res.render('fdlist',{patient,notifs});
                    });
                });
            } else {
                res.redirect('/fdsignin')
            }
        });
        
    },
    postfdVerify:function(req,res){
        db_functions.get_login(function(result){
            if(result[0].userType == "Frontdesk"){
		//is frontdesk account
                const id = req.body.id;
                const name = req.body.name.trim();
                const email = req.body.email.trim();
                const num = req.body.mobileNumber.trim();
                const dentist = req.body.dentist.trim();
                const service = req.body.service.trim();
                const date = req.body.date.trim();
                const time = req.body.time.trim();
                db_functions.update_appointment(id, "approved", "1");
                db_functions.updatefull_appointment(id, name, email, num, dentist, service, date, time);
                db_functions.insert_log("id " + id + " has been verified by front desk",1,1);
                
                res.redirect('/fdAppoint');
            } else {
                res.redirect('/fdsignin')
            }
        });
        
    },
    getadList:function(req,res){
        db_functions.get_login(function(result){
            if(result[0].userType == "Admin"){
		        //is frontdesk account
                db_functions.query_uniqueappointments(function(result){
                    var patient = {};
                    patient = result;
                    db_functions.query_console(function(result){
                        var notifs ={};
                        notifs = result;
                        res.render('adlist',{patient, notifs});
                    });
                });
            } else {
                res.redirect('/signin')
            }
        });
    },
    getadAppoint:function(req,res){
        db_functions.get_login(function(result){
            if(result[0].userType == "Admin"){
		//is frontdesk account
                db_functions.query_appointments(function(result){
                    var appointment = {};
                    appointment = result;                    
                    db_functions.query_console(function(result){
                        var notifs ={};
                        notifs = result;
                        res.render('adappointment',{appointment,notifs});
                    });
                });
            } else {
                res.redirect('/signin')
            }
        });
    },
    getadManage:function(req,res){
        db_functions.get_login(function(result){
            if(result[0].userType == "Admin"){
		//is frontdesk account
                db_functions.query_users(function(result){
                    var users = {};      
                    users = result;   
                                 
                    db_functions.query_console(function(result){
                        var notifs ={};
                        notifs = result;
                        res.render('admanage', {users,notifs});
                    });
                });
            } else {
                res.redirect('/signin')
            }
        });
    },
    postadPatient:function(req,res){
        db_functions.get_login(function(result){
            if(result[0].userType == "Admin"){
		//is frontdesk account
                const name = req.body.fullName.trim();
                
                db_functions.find_userhistory
                //res.render('fdpatientinformation');
                db_functions.find_userhistory(name,function(result){
                    var appointment = result;
                     
                    db_functions.query_console(function(result){
                        var notifs ={};
                        notifs = result;
                        res.render('adpatientinformation', {appointment,notifs});
                    });
                });
            } else {
                res.redirect('/signin')
            }
        });
    },
    getadPatient:function(req,res){
        db_functions.get_login(function(result){
            if(result[0].userType == "Admin"){
		//is frontdesk account
                    db_functions.query_console(function(result){
                        var notifs ={};
                        notifs = result;
                        res.render('adpatientinformation', {notifs});
                    });
            } else {
                res.redirect('/signin')
            }
        });
    },
    postadSched:function(req,res){
        db_functions.get_login(function(result){
            if(result[0].userType == "Admin"){
		//is frontdesk account
                const id = req.body.id
                db_functions.find_appointment(id,function(result){
                    var appointment = result[0];
                    db_functions.query_console(function(result){
                        var notifs ={};
                        notifs = result;
                        res.render('adschedule', {appointment,notifs});
                    });
                });
            } else {
                res.redirect('/signin')
            }
        });
    },
    getadSched:function(req,res){
        db_functions.get_login(function(result){
            if(result[0].userType == "Admin"){
		//is frontdesk account
                    db_functions.query_console(function(result){
                        var notifs ={};
                        notifs = result;
                        res.render('adschedule', {notifs});
                    });
            } else {
                res.redirect('/signin')
            }
        });
    },
    postadVerify:function(req,res){
        db_functions.get_login(function(result){
            if(result[0].userType == "Admin"){
		//is frontdesk account
                const id = req.body.id;
                const name = req.body.name.trim();
                const email = req.body.email.trim();
                const num = req.body.mobileNumber.trim();
                const dentist = req.body.dentist.trim();
                const service = req.body.service.trim();
                const date = req.body.date.trim();
                const time = req.body.time.trim();
                db_functions.update_appointment(id, "approved", "1");
                db_functions.updatefull_appointment(id, name, email, num, dentist, service, date, time);
                db_functions.insert_log("id " + id + " has been verified by Admin",1,1);
                
                res.redirect('/adAppoint');
            } else {
                res.redirect('/signin')
            }
        });
        
    },
    postadMan:function(req,res){
        db_functions.get_login(function(result){
            if(result[0].userType == "Admin"){
		//is frontdesk account
                const email = req.body.email.trim();
                db_functions.find_user(email,function(result){
                    var user = result[0];
                    db_functions.query_console(function(result){
                        var notifs ={};
                        notifs = result;
                        res.render('adsystemaccountedit', {user,notifs});
                    });
                });
            } else {
                res.redirect('/signin')
            }
        });
    },
    getadMan:function(req,res){
        db_functions.get_login(function(result){
            if(result[0].userType == "Admin"){
		//is frontdesk account
        
                db_functions.query_console(function(result){
                    var notifs ={};
                    notifs = result;
                    res.render('adsystemaccountedit', {notifs});
                });
            } else {
                res.redirect('/signin')
            }
        });
    },
    postadAdd:function(req,res){
        db_functions.get_login(function(result){
            if(result[0].userType == "Admin"){
		//is frontdesk account
                const mobileNumber = req.body.mobileNumber.trim();
                const fullName = req.body.fullName.trim();
                const userType = req.body.userType.trim();
                const username = req.body.username.trim();
                const email = req.body.email.trim();
                const password = req.body.password.trim();
                const image = "null";
                db_functions.insert_user(fullName, userType, username, email, mobileNumber, password, image);
                db_functions.insert_log("New user was created " + fullName, 1,0);
                
                res.redirect('/adManage');
            } else {
                res.redirect('/signin')
            }
        });
    },
    getadAdd:function(req,res){
        db_functions.get_login(function(result){
            if(result[0].userType == "Admin"){
		//is frontdesk account
                db_functions.query_console(function(result){
                    var notifs ={};
                    notifs = result;
                    res.render('adadd',{notifs});
                });
            } else {
                res.redirect('/signin')
            }
        });
    },
    postdeleteuser:function(req,res){
        db_functions.get_login(function(result){
            if(result[0].userType == "Admin"){
		//is frontdesk account
                const id = req.body.id;
                db_functions.delete_user(id);
                db_functions.insert_log("user " +id+" was deleted",1,0);
                res.redirect('/adManage');
            } else {
                res.redirect('/signin')
            }
        });
    },
    postedituser:function(req,res){
        db_functions.get_login(function(result){
            if(result[0].userType == "Admin"){
		//is frontdesk account
                const id = req.body.id;
                const mobileNumber = req.body.mobileNumber.trim();
                const fullName = req.body.fullName.trim();
                const userType = req.body.userType.trim();
                const username = req.body.username.trim();
                const email = req.body.email.trim();
                const password = req.body.password.trim();
                const image = "null";
                db_functions.insert_log("user " + id + " was edited",1,0);
                db_functions.update_fulluser(id, fullName, userType, username, email, mobileNumber, password, image);
                res.redirect('/adManage');
            } else {
                res.redirect('/signin')
            }
        });
        //db_functions.create_table();
        
        
    },
    postadlogout:function(req,res){
        db_functions.logout();
        db_functions.insert_log("user has logged out of the System");
        res.redirect('/signin');        
    },
    postfdlogout:function(req,res){
        db_functions.logout();
        db_functions.insert_log("user has logged out of the System");
        res.redirect('/fdsignin');        
    },
    postdeletenotif:function(req,res){
        const currentURL = req.get('Referrer');
        const id = req.body.id;
        db_functions.delete_console(id);


        const parsedURL = new URL(currentURL);
        const previousPath = parsedURL.pathname;
        res.redirect(previousPath);
    }
    
}
module.exports = controller;
