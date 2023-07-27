const sqlite3 = require('sqlite3').verbose();
let sql;

//connecting to database
const db = new sqlite3.Database('./database/database.db',sqlite3.OPEN_READWRITE, (err) =>{
    if (err) return console.error(err.message);
});
//create new table
/*
sql = `CREATE TABLE users(id INTEGER PRIMARY KEY, first_name, last_name, username,password, email)`;
db.run(sql);
*/
//drop table
/*
db.run("DROP TABLE users");
*/

//INSERT
/*
sql = `INSERT INTO users(first_name, last_name, username, password, email) VALUES (?,?,?,?,?)`;
db.run(sql,
    ["Terr", "Rin", "rin2", "1111", "rinzai@g1mail.com"],
    (err)=>{
        if(err) return console.error(err.message);
});
*/
/*
//UPDATE
sql = `UPDATE users SET first_name = ? WHERE id = ?`;
db.run(sql,['Jake',1], (err)=> {
    if (err) return console.error(err.message);
});

//DELETE
sql = `UPDATE users SET first_name = ? WHERE id = ?`;
db.run(sql, [1], (err) =>{
    if(err) return console.error(err.message);
});
//query data
sql = `SELECT * FROM users`;
db.all(sql,[],(err, rows)=>{
    if(err) return console.error(err.message);
        rows.forEach(row=>{
            console.log(row);
        });
});
*/
const signinButton = document.getElementById("SIconfirm");
if( signinButton) {
    signinButton.addEventListener('click', function(){
        const email = document.getElementById("SUemail");
        const first_name = document.getElementById("SUfirstName");
        const last_name = document.getElementById("SUlastName");
        const password = document.getElementById("SUpassword");        
        alert(email.value + " " + first_name.value);
    });
}

