
const dotenv = require(`dotenv`);

//import the necessary modules
const express = require(`express`);
const path = require('path');
const app = express();
const fileUpload = require(`./controller/upload.js`) ;
//import handlebars
const hbs = require('hbs');
//routes
const routes = require('./routes/routes.js');
const db = require('./models/db.js');
const { select_query } = require('./models/db.js');

//parse incoming requests with urlencoded payloads
app.use(express.urlencoded({ extended: false }));
//parse incoming json payload
app.use(express.json());
//set up handlebars in app
app.set(`view engine`, `hbs`);
//registar partials folder
hbs.registerPartials(__dirname + `/views/partials`);

//opens dotenv
dotenv.config();
//sets values from dotenv
port = process.env.PORT;
hostname = process.env.HOSTNAME;

//set the file path containing the static assets
app.use(express.static(path.join(__dirname, 'public')));
//set hbs as the view engine
app.set('view engine', 'hbs');
//set the file path containing the hbs files
app.set('views', path.join(__dirname, 'views'));
//set the file path containing the partial hbs files
app.use('/', routes);

app.use(`/`, fileUpload);

app.listen(port, hostname, function () {
    console.log(`Server is running at:`);
    console.log(`http://` + hostname + `:` + port);
});
