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

//app.set('view engine', 'ejs');
//app.use( express.static( "public" ) );

var urlencodedParser = bodyParser.urlencoded({ extended: true });

var sess; // global session, NOT recommended
var output;

// Home route
app.get("/", (req, res) => {
	res.send("Welcome to a basic Zeit-Now express App");
  });

  app.get("/books", (req, res) => {
	res.send("Welcome to books");
  });  

app.get('/data',urlencodedParser, function(req, res){

	console.log('LoanMaster');
  
	var suserid = JSON.stringify(req.body.userid); 
	var spassword = JSON.stringify(req.body.password); 
  
	acc.getUserLoans_vue('Hacklehead','sa',res);

  });

  app.post('/vueLoanMaster',urlencodedParser, function(req, res){

	console.log('LoanMaster');
  
	var suserid = JSON.stringify(req.body.userid); 
	var spassword = JSON.stringify(req.body.password); 
  
	//acc.getUserLoans(132,suserid,res);
	acc.getUserLoans_vue(132,'Hacklehead',res);

  });

  app.post("/loadloans", multipartMiddleware, function(req, res) {
	//app.post('/connect',urlencodedParser, function(req, res){
  
	  var suserid = JSON.stringify(req.body.title); 
	  var spwd = JSON.stringify(req.body.content); 
  
	  suserid = suserid.replace(/\"/g, ""); 
	  spwd = spwd.replace(/\"/g, ""); 
	  suserid = suserid.replace(/\\/g, ""); 
	  spwd = spwd.replace(/\\/g, ""); 
  
	  console.log('1-' + suserid + '-' + spwd);
  
	  var buff= acc.getUserLoans_vue(suserid,spwd,res);
	  //var buff= acc.getUserLoans_mysql(suserid,spwd,res);
	  	
	  console.log('3-'+'buff=' + buff);
	  
	});

	app.post("/loadprofile", multipartMiddleware, function(req, res) {
		var suserid = JSON.stringify(req.body.title); 
		var spwd = JSON.stringify(req.body.content); 
	  
		suserid = suserid.replace(/\"/g, ""); 
		spwd = spwd.replace(/\"/g, ""); 
		suserid = suserid.replace(/\\/g, ""); 
		spwd = spwd.replace(/\\/g, ""); 
	  
		console.log('1-' + suserid + '-' + spwd);
	
		var buff= acc.getUserProfile_vue(suserid,spwd,res);
			  
		console.log('3-'+'buff=' + buff);
		  
	});	

	app.post("/loaduid", multipartMiddleware, function(req, res) {
		var suserid = JSON.stringify(req.body.title); 
		var spwd = JSON.stringify(req.body.content); 
	  
		suserid = suserid.replace(/\"/g, ""); 
		spwd = spwd.replace(/\"/g, ""); 
		suserid = suserid.replace(/\\/g, ""); 
		spwd = spwd.replace(/\\/g, ""); 
	  
		console.log('1-' + suserid + '-' + spwd);
	
		var buff= acc.getLoginStatus_vue(suserid,spwd,res);
			  
		console.log('3-'+'buff=' + buff);
		  
	});	

	app.post("/loancopy", multipartMiddleware, function(req, res) {
		var suserid = JSON.stringify(req.body.user); 
		var sSrcloan = JSON.stringify(req.body.srcloan); 
		var sDestloan = JSON.stringify(req.body.destloan); 
	  
		suserid = suserid.replace(/\"/g, ""); 
		sSrcloan = sSrcloan.replace(/\"/g, ""); 
		sDestloan = sDestloan.replace(/\"/g, ""); 
		suserid = suserid.replace(/\\/g, ""); 
		sSrcloan = sSrcloan.replace(/\\/g, ""); 
		sDestloan = sDestloan.replace(/\\/g, ""); 
	  
		//console.log('1-' + suserid + '-' + sSrcloan + '-' + sDestloan);
	
		//var buff= acc.getLoginStatus_vue(suserid,spwd,res);
		var buff = acc.copyUserLoan_vue(132,suserid,sSrcloan,sDestloan,res);	  
		console.log('3-'+'buff=' + buff);
		  
	});		

app.post("/loanadd", multipartMiddleware, function(req, res) {
	var suserid = JSON.stringify(req.body.user); 
	var sNewloan = JSON.stringify(req.body.newloan); 

	suserid = suserid.replace(/\"/g, ""); 
	sNewloan = sNewloan.replace(/\"/g, ""); 

	suserid = suserid.replace(/\\/g, ""); 
	sNewloan = sNewloan.replace(/\\/g, ""); 

	// console.log('1-' + suserid + '-' + sSrcloan + '-' + sDestloan);
	//var buff= acc.getLoginStatus_vue(suserid,spwd,res);
	var buff = acc.addUserLoan_vue(132,suserid,sNewloan,res);	  
	console.log('3-buff=' + buff);
});		

app.post("/loandelete", multipartMiddleware, function(req, res) {
	var suserid = JSON.stringify(req.body.user); 
	var sSrcloan = JSON.stringify(req.body.srcloan); 
  
	suserid = suserid.replace(/\"/g, ""); 
	sSrcloan = sSrcloan.replace(/\"/g, ""); 
	suserid = suserid.replace(/\\/g, ""); 
	sSrcloan = sSrcloan.replace(/\\/g, ""); 
	console.log( 'loandelete', { user: suserid, message: sSrcloan }); 
	messx = acc.deleteLoan_vue(132,suserid,sSrcloan,res);
});		

app.post("/profileupdate", multipartMiddleware, function(req, res) {
	var suserid = JSON.stringify(req.body.user); 
	var spwd = JSON.stringify(req.body.pwd); 
	var semail = JSON.stringify(req.body.email); 
  
	suserid = suserid.replace(/\"/g, ""); 
	spwd = spwd.replace(/\"/g, ""); 
	semail = semail.replace(/\"/g, ""); 

	suserid = suserid.replace(/\\/g, ""); 
	spwd = spwd.replace(/\\/g, ""); 
	semail = semail.replace(/\\/g, ""); 

	console.log( 'profileupdate', { user: suserid, message: semail }); 
	messx = acc.editProfile_vue(132,suserid,spwd,semail,res);
});

app.post("/loanupdate", multipartMiddleware, function(req, res) {

	var suserid = JSON.stringify(req.body.user); 
	var sloanid = JSON.stringify(req.body.loanid); 

	var sStartDate = JSON.stringify(req.body.StartDate); 
	var sbalance = JSON.stringify(req.body.balance); 
	var srate = JSON.stringify(req.body.rate); 
	var sRatePeriodicity = JSON.stringify(req.body.RatePeriodicity); 
	var sPeriodicity = JSON.stringify(req.body.Periodicity); 
	var snumpmts = JSON.stringify(req.body.numpmts); 
	var spayment = JSON.stringify(req.body.payment); 
	var sMethod = JSON.stringify(req.body.Method); 

	suserid = suserid.replace(/\"/g, ""); 
	sloanid = sloanid.replace(/\"/g, ""); 
	sStartDate = sStartDate.replace(/\"/g, ""); 
	sbalance = sbalance.replace(/\"/g, ""); 
	srate = srate.replace(/\"/g, ""); 
	sRatePeriodicity = sRatePeriodicity.replace(/\"/g, ""); 
	sPeriodicity = sPeriodicity.replace(/\"/g, ""); 
	snumpmts = snumpmts.replace(/\"/g, ""); 
	spayment = spayment.replace(/\"/g, ""); 
	sMethod = sMethod.replace(/\"/g, ""); 	

	suserid = suserid.replace(/\\/g, ""); 
	sloanid = sloanid.replace(/\\/g, ""); 
	sStartDate = sStartDate.replace(/\\/g, ""); 
	sbalance = sbalance.replace(/\\/g, ""); 
	srate = srate.replace(/\\/g, ""); 
	sRatePeriodicity = sRatePeriodicity.replace(/\\/g, ""); 
	sPeriodicity = sPeriodicity.replace(/\\/g, ""); 
	snumpmts = snumpmts.replace(/\\/g, ""); 
	spayment = spayment.replace(/\\/g, ""); 
	sMethod = sMethod.replace(/\\/g, ""); 				

	console.log( 'loanupdate', { user: suserid, loanid: sloanid, StartDate: sStartDate, balance: sbalance, rate: srate }); 
	messx = acc.editLoan_vue(132,suserid,sloanid,sStartDate,sPeriodicity,srate,sRatePeriodicity,sbalance,spayment,snumpmts,sMethod,res);
});

const server = app.listen(process.env.PORT || 3000,() => {
    console.log(`New Version 2`);
    console.log(`App Started on PORT ${process.env.PORT || 3000}`);
});