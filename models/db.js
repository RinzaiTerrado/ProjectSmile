//sets sqlite3
const sqlite3 = require('sqlite3').verbose();
let sql;

//connecting to database
const db = new sqlite3.Database('./database/database.db',sqlite3.OPEN_READWRITE, (err) =>{
    if (err) return console.error(err.message);
});
const db_functions = {
    create_table: async function(){                
        console.log("table created");
        /*
        sql = `CREATE TABLE users(id INTEGER PRIMARY KEY, fullName text, userType text, username text, email text, mobileNumber text, password text, image text, verification text)`;
        db.run(sql);
        sql = `CREATE TABLE appointment(id INTEGER PRIMARY KEY, fullName text, email text,  mobileNumber INTEGER, dentist text, service text, date text, time text, approved text)`;
        db.run(sql);
        //db.run("DROP TABLE console");
        sql = 'CREATE TABLE console(id INTEGER PRIMARY KEY, message text, admin, frontdesk)';
        db.run(sql);
        db.run("DROP TABLE login");
        
        sql = 'CREATE TABLE login(id INTEGER PRIMARY KEY, userID, userType)';
        db.run(sql);
        sql = `INSERT INTO login(userID , userType ) VALUES(1, "Admin")`;
        db.run(sql);
        */
    
    },
    drop_table:async function(){
        console.log("table dropped");
        db.run("DROP TABLE users");
        db.run("DROP TABLE appointment");
    },
    find_userpass: async function (email, password, callback) {
        //prepares insert statement
        sql = `SELECT * FROM users where email = ? AND password = ?`;
        db.all(sql,
            [email,password],
            (err, result)=>{
                if(err) return callback(false);
                return callback(result);
        });
    },
    find_user: async function (email, callback) {
        //prepares insert statement
        sql = `SELECT * FROM users where email = ? `;
        db.all(sql,
            [email],
            (err, result)=>{
                if(err) return callback(false);
                return callback(result);
        });
    },
    find_appointment: async function (id, callback) {
        //prepares insert statement
        sql = `SELECT * FROM appointment where id = ? `;
        db.all(sql,
            [id],
            (err, result)=>{
                if(err) return callback(false);
                return callback(result);
        });
    },
    find_userhistory: async function (name, callback) {
        //prepares insert statement
        sql = `SELECT * FROM appointment where fullName = ? `;
        db.all(sql,
            [name],
            (err, result)=>{
                if(err) return callback(false);
                return callback(result);
        });
    },
    query_users: async function (callback) {
        //prepares insert statement
        sql = `SELECT * FROM users`;
        db.all(sql,
            [],
            (err, result)=>{
                if(err) return callback(false);
                return callback(result);
        });
    },
    query_appointments: async function (callback) {
        //prepares insert statement
        sql = `SELECT * FROM appointment`;
        db.all(sql,
            [],
            (err, result)=>{
                if(err) return callback(false);
                return callback(result);
        });
    },
    query_console: async function (callback) {
        //prepares insert statement
        sql = `SELECT * FROM console order by id desc`;
        db.all(sql,
            [],
            (err, result)=>{
                if(err) return callback(false);
                return callback(result);
        });
    },
    query_consolefd: async function (callback) {
        //prepares insert statement
        sql = `SELECT * FROM console where frontdesk=1 order by id desc`;
        db.all(sql,
            [],
            (err, result)=>{
                if(err) return callback(false);
                return callback(result);
        });
    },
    query_uniqueappointments: async function (callback) {
        //prepares insert statement
        sql = `SELECT DISTINCT fullName, email, mobileNumber FROM appointment`;
        db.all(sql,
            [],
            (err, result)=>{
                if(err) return callback(false);
                return callback(result);
        });
    },
    insert_user: async function (fullName, userType, username, email, mobileNumber,  password, image, verification) {
        //prepares insert statement

        sql = `INSERT INTO users(fullName, userType, username, email, mobileNumber,  password, image, verification) VALUES (?,?,?,?,?,?,?,?)`;
        console.log("inserting to db + image = " + image);
        db.run(sql,
            [fullName, userType, username, email, mobileNumber, password, image, verification],
            (err)=>{
                if(err) return console.error(err.message);
        });
    },
    insert_log: async function (message, admin, frontdesk) {
        //prepares insert statement
        sql = `INSERT INTO console(message, admin, frontdesk) VALUES (?,?,?)`;
        console.log("inserting to console db message = " + message);
        db.run(sql,
            [message,admin,frontdesk],
            (err)=>{
                if(err) return console.error(err.message);
        });
    },
    insert_appointment: async function (fullName, email,  mobileNumber, dentist, service, date, time) {
        //prepares insert statement
        sql = `INSERT INTO appointment(fullName, email,  mobileNumber, dentist, service, date, time, approved) VALUES (?,?,?,?,?,?,?,?)`;
        db.run(sql,
            [fullName, email,  mobileNumber, dentist, service, date, time, "0"],
            (err)=>{
                if(err) return console.error(err.message);
        });
    },
    update_user: async function (email, variable, value) {
        //prepares insert statement
        sql = `UPDATE users SET ` + variable + ` =? WHERE email =?`;
        db.run(sql,
            [value, email],
            (err)=>{
                if(err) return console.error(err.message);
        });
    },
    update_fulluser: async function (id, fullName, userType, username, email, mobileNumber, password, image) {
        //prepares insert statement
        sql = `UPDATE users SET fullName = ?, userType = ?, username = ?, email = ?, mobileNumber = ?, password = ?, image = ? WHERE id =?`;
        db.run(sql,
            [fullName, userType, username, email, mobileNumber, password, image, id],
            (err)=>{
                if(err) return console.error(err.message);
        });
    },
    update_fullusernoimg: async function (id, fullName, userType, username, email, mobileNumber, password) {
        //prepares insert statement
        sql = `UPDATE users SET fullName = ?, userType = ?, username = ?, email = ?, mobileNumber = ?, password = ? WHERE id =?`;
        db.run(sql,
            [fullName, userType, username, email, mobileNumber, password, id],
            (err)=>{
                if(err) return console.error(err.message);
        });
    },
    updatefull_appointment: async function (id, name, email, num, dentist, service, date, time) {
        //prepares insert statement
        sql = `UPDATE appointment SET fullName =?, email=?, mobileNumber=?, dentist=?, service=?, date=?, time=? WHERE id =?`;
        db.run(sql,
            [name, email, num, dentist, service, date, time, id],
            (err)=>{
                if(err) return console.error(err.message);
        });
    },
    update_appointment: async function (id, variable, value) {
        //prepares insert statement
        sql = `UPDATE appointment SET ` + variable + ` =? WHERE id =?`;
        db.run(sql,
            [value, id],
            (err)=>{
                if(err) return console.error(err.message);
        });
    },
    delete_user: async function (id) {
        //prepares insert statement
        sql = `DELETE FROM users WHERE id = ?`;
        db.run(sql,
            [id],
            (err)=>{
                if(err) return console.error(err.message);
        });
    },
    delete_console: async function (id) {
        //prepares insert statement
        sql = `DELETE FROM console WHERE id = ?`;
        db.run(sql,
            [id],
            (err)=>{
                if(err) return console.error(err.message);
        });
    },
    clear_console: async function (id) {
        //prepares insert statement
        sql = `DELETE FROM console`;
        console.log('CONSOLE CLEARED');
        db.run(sql,
            [id],
            (err)=>{
                if(err) return console.error(err.message);
        });
    },
    get_login: async function (callback) {
        //prepares insert statement        
        sql = `SELECT * FROM login`;
        db.all(sql,
            [],
            (err, result)=>{
                if(err) return callback(false);
                return callback(result);
        });
    },
    login: async function (id, userType) {
        //prepares insert statement
        sql = `UPDATE login SET userID =?, userType = ? WHERE id =1`;
        db.run(sql,
            [id,userType],
            (err)=>{
                if(err) return console.error(err.message);
        });
    },
    logout: async function () {
        //prepares insert statement
        sql = `UPDATE login SET userID = 0, userType = "none" WHERE id =1`;
        db.run(sql,
            (err)=>{
                if(err) return console.error(err.message);
        });
    }

}




module.exports = db_functions;