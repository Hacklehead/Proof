const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const router = express.Router();
const app = express();

var Connection = require('tedious').Connection;
var Request = require('tedious').Request;

var db = require("./dbController.js");
var acc = require("./dbAccess.js");
var TYPES = require("tedious").TYPES;

const cors = require("cors");
const multipart = require("connect-multiparty");
const multipartMiddleware = multipart();

app.use(cors());
app.use(session({secret: 'ssshhhhh',saveUninitialized: true,resave: true}));
app.use(bodyParser.json());      
app.use(bodyParser.urlencoded({extended: true}));
//app.use(express.static(__dirname + '/views'));

app.set('view engine', 'ejs');
app.use( express.static( "public" ) );

var urlencodedParser = bodyParser.urlencoded({ extended: true });

var sess; // global session, NOT recommended
var output;


router.get('/',function(req,res){
	res.send('Hello Entry');
	
});




app.use('/', router);

const server = app.listen(process.env.PORT || 3000,() => {
    console.log(`New Version 2`);
    console.log(`App Started on PORT ${process.env.PORT || 3000}`);
});

