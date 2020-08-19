//var express = require('express');
//var app = express();

const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const router = express.Router();
const app = express();
const axios = require('axios');

var yahooFinance = require('yahoo-finance');
const sAlphaBackup = require('alphavantage')({ key: '2DSCA5ETJKPTVOWN' });

var Connection = require('./tedious').Connection;
var Request = require('./tedious').Request;

var db = require("./dbController.js");
var acc = require("./dbAccess.js");
var TYPES = require("tedious").TYPES;

const cors = require("cors");
const multipart = require("connect-multiparty");
const multipartMiddleware = multipart();

var sStockIntradayURL = "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=<<SS>>&interval=<<INT>>&apikey=<<ALPHA>>";
var sStockDailyURL = "https://www.alphavantage.co/query?function=TIME_SERIES_<<DDD>>&symbol=<<SS>>&outputsize=full&apikey=<<ALPHA>>"

var sFXIntradayURL = "https://www.alphavantage.co/query?function=FX_INTRADAY&from_symbol=<<FC>>&to_symbol=<<TC>>&interval=<<INT>>&outputsize=full&apikey=<<ALPHA>>"
var sFXDailyURL = "https://www.alphavantage.co/query?function=FX_<<DDD>>&from_symbol=<<FC>>&to_symbol=<<TC>>&outputsize=full&apikey=<<ALPHA>>"
var sSectorURL = "https://www.alphavantage.co/query?function=SECTOR&apikey=<<ALPHA>>"

var sTechnicalURL = "https://www.alphavantage.co/query?function=<<FUNC>>&symbol=<<SS>>&interval=<<INT>>&time_period=10&series_type=<<SER>>&apikey=<<ALPHA>>"
var storeCcy = ['btc-BitCoin', 'cad-Canadian Dollar', 'chf-Swiss Franc', 'eur-Euro','gbp-British Pound Sterling','HKD-Hong Kong Dollar','JPY-Japanese Yen', 'usd-United States Dollar']

var sSearchURL = "https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=<<SRCH>>&apikey=<<ALPHA>>"
var sYahooSearchURL = "http://autoc.finance.yahoo.com/autoc?query=<<SRCH>>&region=EU&lang=en-US"
var iCountdown = 60

app.use(cors());
app.use(session({secret: 'ssshhhhh',saveUninitialized: true,resave: true}));
app.use(bodyParser.json());      
app.use(bodyParser.urlencoded({extended: true}));

var urlencodedParser = bodyParser.urlencoded({ extended: true });

var sess; // global session, NOT recommended
var output;

// set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 3010;

// set the view engine to ejs
app.set('view engine', 'ejs');

// make express look in the public directory for assets (css/js/img)
app.use(express.static(__dirname + '/public'));

// set the home page route

app.get('/', (req, res) => {
	res.send("Welcome to a basic Zeit-Now Node JS Server App on Port 3000");
  });

  app.get('/data',urlencodedParser, function(req, res){

	console.log('LoanMaster-1');
  
	var suserid = JSON.stringify(req.body.userid); 
	var spassword = JSON.stringify(req.body.password); 
  
	//res.send("Welcome to a basic Heroku-Now express App");
	acc.getUserLoans_vue('Hacklehead','sa',res);

  });
  
  app.post("/indexadd", multipartMiddleware, function(req, res) {
	//app.post('/connect',urlencodedParser, function(req, res){
	var suserid = JSON.stringify(req.body.title); 
	var spwd = JSON.stringify(req.body.content); 
	var sIndex = JSON.stringify(req.body.Index); 
  
	suserid = suserid.replace(/\"/g, ""); 
	spwd = spwd.replace(/\"/g, ""); 
	sIndex = sIndex.replace(/\"/g, ""); 
					
	suserid = suserid.replace(/\\/g, ""); 
	spwd = spwd.replace(/\\/g, "");  
	sIndex = sIndex.replace(/\\/g, ""); 
				  
	var buff= acc.addIndex(suserid,sIndex);   
	var buff= acc.getLocalIndex(sIndex);   
	console.log('index add post');

  });

  app.post("/indexdelete", multipartMiddleware, function(req, res) {
	//app.post('/connect',urlencodedParser, function(req, res){

	console.log('index delete post');

	var suserid = JSON.stringify(req.body.title); 
	var spwd = JSON.stringify(req.body.content); 
	var sIndex = JSON.stringify(req.body.Index); 
	
	suserid = suserid.replace(/\"/g, ""); 
	spwd = spwd.replace(/\"/g, ""); 
	sIndex = sIndex.replace(/\"/g, ""); 
					
	suserid = suserid.replace(/\\/g, ""); 
	spwd = spwd.replace(/\\/g, "");  
	sIndex = sIndex.replace(/\\/g, ""); 
	
	var buff= acc.delIndex(suserid,sIndex);   
	

  });

  app.post("/xsearch", multipartMiddleware, function(req, res) {
	//app.post('/connect',urlencodedParser, function(req, res){
	var suserid = JSON.stringify(req.body.title); 
	var spwd = JSON.stringify(req.body.content); 
	var sSearch = JSON.stringify(req.body.Search); 
	var sAlphaKey = JSON.stringify(req.body.alphakey); 
  
	suserid = suserid.replace(/\"/g, ""); 
	spwd = spwd.replace(/\"/g, ""); 
	sSearch = sSearch.replace(/\"/g, ""); 
	sAlphaKey = sAlphaKey.replace(/\"/g, ""); 
					
	suserid = suserid.replace(/\\/g, ""); 
	spwd = spwd.replace(/\\/g, "");  
	sSearch = sSearch.replace(/\\/g, ""); 
	sAlphaKey = sAlphaKey.replace(/\\/g, ""); 
	if (sAlphaKey.length < 4){sAlphaKey = sAlphaBackup}
		//sAlphaBackup		  
	var sURL = sSearchURL
	sURL = sURL.replace("<<SRCH>>", sSearch); 
	sURL = sURL.replace("<<ALPHA>>", sAlphaKey); 
	//console.log('1-' + suserid + '-' + spwd + '-' + sStockSymbol);
	console.log('url-' + sURL);
	  
	axios.get(sURL)
	   .then(function (response) {
	   //console.log(response.data);
	   return res.json({status: true, rows: response.data });
	   // do something with response data
	   })
	   .catch(function (error) {
	   // console.log(error);
	   return res.json({status: false, rows: 'ouch' });
	   });  	
		console.log('intraday post');
  });
  
  app.post("/ysearch", multipartMiddleware, function(req, res) {
	  //app.post('/connect',urlencodedParser, function(req, res){
	  var suserid = JSON.stringify(req.body.title); 
	  var spwd = JSON.stringify(req.body.content); 
	  var sSearch = JSON.stringify(req.body.Search); 
	
	  suserid = suserid.replace(/\"/g, ""); 
	  spwd = spwd.replace(/\"/g, ""); 
	  sSearch = sSearch.replace(/\"/g, ""); 
					  
	  suserid = suserid.replace(/\\/g, ""); 
	  spwd = spwd.replace(/\\/g, "");  
	  sSearch = sSearch.replace(/\\/g, ""); 
					
	  var sURL = sYahooSearchURL
	  sURL = sURL.replace("<<SRCH>>", sSearch); 
	  //console.log('1-' + suserid + '-' + spwd + '-' + sStockSymbol);
	  console.log('url-' + sURL);
		
	  axios.get(sURL)
		 .then(function (response) {
		 //console.log(response.data);
		 return res.json({status: true, rows: response.data });
		 // do something with response data
		 })
		 .catch(function (error) {
		 // console.log(error);
		 return res.json({status: false, rows: 'ouch' });
		 });  	
		  console.log('intraday post');
	});

  app.post("/xSector", multipartMiddleware, function(req, res) {
	  //app.post('/connect',urlencodedParser, function(req, res){
					
	  var suserid = JSON.stringify(req.body.title); 
	  var spwd = JSON.stringify(req.body.content); 
	  var sAlphaKey = JSON.stringify(req.body.alphakey); 
				  
	  suserid = suserid.replace(/\"/g, ""); 
	  spwd = spwd.replace(/\"/g, ""); 
	  sAlphaKey = sAlphaKey.replace(/\"/g, ""); 
						
	  suserid = suserid.replace(/\\/g, ""); 
	  spwd = spwd.replace(/\\/g, "");  
	  sAlphaKey = sAlphaKey.replace(/\\/g, "");  
	  if (sAlphaKey.length < 4){sAlphaKey = sAlphaBackup}

	  var sURL = sSectorURL
	  sURL = sURL.replace("<<ALPHA>>", sAlphaKey); 	
	  //console.log('1-' + suserid + '-' + spwd + '-' + sStockSymbol);
	  console.log('url-' + sURL);
		  
	  axios.get(sURL)
		 .then(function (response) {
	  //console.log(response.data);
	  return res.json({status: true, rows: response.data });
	  // do something with response data
	  })
	  .catch(function (error) {
	  // console.log(error);
	  return res.json({status: false, rows: 'ouch' });
	  });  	
		  
	  console.log('intraday post');
  });			
	  
  app.post("/xtechnical", multipartMiddleware, function(req, res) {
	  //app.post('/connect',urlencodedParser, function(req, res){
	  var suserid = JSON.stringify(req.body.title); 
	  var spwd = JSON.stringify(req.body.content); 
	  var sFunction = JSON.stringify(req.body.Function); 
	  var sStockSymbol = JSON.stringify(req.body.Symbol); 
	  var sInterval = JSON.stringify(req.body.Interval); 
	  var sSeriesType = JSON.stringify(req.body.SeriesType); 
	  var sAlphaKey = JSON.stringify(req.body.alphakey); 
  
	  suserid = suserid.replace(/\"/g, ""); 
	  spwd = spwd.replace(/\"/g, ""); 
	  sFunction = sFunction.replace(/\"/g, ""); 
	  sStockSymbol = sStockSymbol.replace(/\"/g, ""); 
	  sInterval = sInterval.replace(/\"/g, ""); 
	  sSeriesType = sSeriesType.replace(/\"/g, ""); 
	  sAlphaKey = sAlphaKey.replace(/\"/g, ""); 
						
	  suserid = suserid.replace(/\\/g, ""); 
	  spwd = spwd.replace(/\\/g, "");  
	  sFunction = sFunction.replace(/\\/g, ""); 
	  sStockSymbol = sStockSymbol.replace(/\\/g, ""); 
	  sInterval = sInterval.replace(/\\/g, ""); 
	  sSeriesType = sSeriesType.replace(/\\/g, ""); 
	  sAlphaKey = sAlphaKey.replace(/\\/g, ""); 	
	  if (sAlphaKey.length < 4){sAlphaKey = sAlphaBackup}				  

	  var sURL = sTechnicalURL
	  
	  sURL = sURL.replace("<<FUNC>>", sFunction); 
	  sURL = sURL.replace("<<SS>>", sStockSymbol); 
	  sURL = sURL.replace("<<INT>>", sInterval); 
	  sURL = sURL.replace("<<SER>>", sSeriesType); 
	  sURL = sURL.replace("<<ALPHA>>", sAlphaKey); 	
	  if(sInterval == 'Daily') {sURL = sURL.replace("<<DDD>>", "DAILY_ADJUSTED"); }
	  if(sInterval == 'Weekly') {sURL = sURL.replace("<<DDD>>", "WEEKLY_ADJUSTED"); }
	  if(sInterval == 'Monthly') {sURL = sURL.replace("<<DDD>>", "MONTHLY_ADJUSTED"); }
		  
	  //console.log('1-' + suserid + '-' + spwd + '-' + sStockSymbol);
	  console.log('url-' + sURL);
		  
	  axios.get(sURL)
	   .then(function (response) {
	   //console.log(response.data);
	   return res.json({status: true, rows: response.data });
	   // do something with response data
	   })
	   .catch(function (error) {
	   // console.log(error);
	   return res.json({status: false, rows: 'ouch' });
	   });  	
	  console.log('intraday post');
  });			

  app.post("/xintraday", multipartMiddleware, function(req, res) {
	//app.post('/connect',urlencodedParser, function(req, res){
	var suserid = JSON.stringify(req.body.title); 
	var spwd = JSON.stringify(req.body.content); 
	var sStockSymbol = JSON.stringify(req.body.StockSymbol); 
	var sInterval = JSON.stringify(req.body.Interval); 
	var sAlphaKey = JSON.stringify(req.body.alphakey); 
  
	suserid = suserid.replace(/\"/g, ""); 
	spwd = spwd.replace(/\"/g, ""); 
	sStockSymbol = sStockSymbol.replace(/\"/g, ""); 
	sInterval = sInterval.replace(/\"/g, ""); 
	sAlphaKey = sAlphaKey.replace(/\"/g, ""); 
				
	suserid = suserid.replace(/\\/g, ""); 
	spwd = spwd.replace(/\\/g, "");  
	sStockSymbol = sStockSymbol.replace(/\\/g, ""); 
	sInterval = sInterval.replace(/\\/g, ""); 
	sAlphaKey = sAlphaKey.replace(/\\/g, ""); 
    if (sAlphaKey.length < 4){sAlphaKey = sAlphaBackup}				  

	var sURL = sStockIntradayURL
	  if(sInterval == 'Daily') {sURL = sStockDailyURL;}
	  if(sInterval == 'Weekly') {sURL = sStockDailyURL;}
	  if(sInterval == 'Monthly') {sURL = sStockDailyURL;}
	  sURL = sURL.replace("<<SS>>", sStockSymbol); 
	  sURL = sURL.replace("<<INT>>", sInterval); 
	  sURL = sURL.replace("<<ALPHA>>", sAlphaKey); 
	  if(sInterval == 'Daily') {sURL = sURL.replace("<<DDD>>", "DAILY_ADJUSTED"); }
	  if(sInterval == 'Weekly') {sURL = sURL.replace("<<DDD>>", "WEEKLY_ADJUSTED"); }
	  if(sInterval == 'Monthly') {sURL = sURL.replace("<<DDD>>", "MONTHLY_ADJUSTED"); }
  
	  //console.log('1-' + suserid + '-' + spwd + '-' + sStockSymbol);
	  console.log('url-' + sURL);
  
	  axios.get(sURL)
	   .then(function (response) {
		   //console.log(response.data);
		   return res.json({status: true, rows: response.data });
	   // do something with response data
	   })
	   .catch(function (error) {
	   // console.log(error);
	   return res.json({status: false, rows: 'ouch' });
	   });  	
		console.log('intraday post');
  });
  
  app.post("/xForex", multipartMiddleware, function(req, res) {
	//app.post('/connect',urlencodedParser, function(req, res){
				
	var suserid = JSON.stringify(req.body.title); 
	var spwd = JSON.stringify(req.body.content); 
	var sfromCurrency = JSON.stringify(req.body.fromCurrency); 
	var stoCurrency = JSON.stringify(req.body.toCurrency); 
	var sInterval = JSON.stringify(req.body.Interval); 
	var sAlphaKey = JSON.stringify(req.body.alphakey); 
				  
	suserid = suserid.replace(/\"/g, ""); 
	spwd = spwd.replace(/\"/g, ""); 
	sfromCurrency = sfromCurrency.replace(/\"/g, ""); 
	stoCurrency = stoCurrency.replace(/\"/g, ""); 
	sInterval = sInterval.replace(/\"/g, ""); 
	sAlphaKey = sAlphaKey.replace(/\"/g, ""); 
					
	suserid = suserid.replace(/\\/g, ""); 
	spwd = spwd.replace(/\\/g, "");  
	sfromCurrency = sfromCurrency.replace(/\\/g, ""); 
	stoCurrency = stoCurrency.replace(/\\/g, ""); 
	sInterval = sInterval.replace(/\\/g, ""); 
	sAlphaKey = sAlphaKey.replace(/\\/g, ""); 
	if (sAlphaKey.length < 4){sAlphaKey = sAlphaBackup}				  
				  
	var sURL = sFXIntradayURL
	if(sInterval == 'Daily') {sURL = sFXDailyURL;}
	if(sInterval == 'Weekly') {sURL = sFXDailyURL;}
	if(sInterval == 'Monthly') {sURL = sFXDailyURL;}
	sURL = sURL.replace("<<FC>>", sfromCurrency); 
	sURL = sURL.replace("<<TC>>", stoCurrency); 
	sURL = sURL.replace("<<INT>>", sInterval); 
	sURL = sURL.replace("<<ALPHA>>", sAlphaKey); 
	if(sInterval == 'Daily') {sURL = sURL.replace("<<DDD>>", "DAILY"); }
	if(sInterval == 'Weekly') {sURL = sURL.replace("<<DDD>>", "WEEKLY"); }
	if(sInterval == 'Monthly') {sURL = sURL.replace("<<DDD>>", "MONTHLY"); }
	  
	//console.log('1-' + suserid + '-' + spwd + '-' + sStockSymbol);
	console.log('url-' + sURL);
	  
	axios.get(sURL)
	   .then(function (response) {
	   //console.log(response.data);
	   return res.json({status: true, rows: response.data });
	   // do something with response data
	   })
	   .catch(function (error) {
	   // console.log(error);
	   return res.json({status: false, rows: 'ouch' });
	   });  	
		console.log('intraday post');
	  });			


app.post("/xquote", multipartMiddleware, function(req, res) {
  
	var suserid = JSON.stringify(req.body.title); 
	var spwd = JSON.stringify(req.body.content); 
	var sIndex = JSON.stringify(req.body.index); 
		
	suserid = suserid.replace(/\"/g, ""); 
	spwd = spwd.replace(/\"/g, ""); 
	sIndex = sIndex.replace(/\"/g, ""); 
			
	suserid = suserid.replace(/\\/g, ""); 
	spwd = spwd.replace(/\\/g, "");  
	sIndex =sIndex.replace(/\\/g, ""); 
					  
	console.log('7-' + suserid + '-' + spwd + '-' + sIndex);
	
	yahooFinance.quote({
		symbol: sIndex ,
		modules: [ 'price', 'summaryDetail'] // see the docs for the full list
	  }, function (err, quotes) {
		console.log(quotes);	    
		return res.json({status: true, rows: quotes });
		// ...
	  });

	  console.log('yahoo quote');
 });

app.post("/xhistorical", multipartMiddleware, function(req, res) {
  
	var suserid = JSON.stringify(req.body.title); 
	var spwd = JSON.stringify(req.body.content); 
	var sIndex = JSON.stringify(req.body.index); 
	var sCount = JSON.stringify(req.body.count); 
		
	suserid = suserid.replace(/\"/g, ""); 
	spwd = spwd.replace(/\"/g, ""); 
	sIndex = sIndex.replace(/\"/g, ""); 
	sCount = sCount.replace(/\"/g, ""); 
			
	suserid = suserid.replace(/\\/g, ""); 
	spwd = spwd.replace(/\\/g, "");  
	sIndex =sIndex.replace(/\\/g, ""); 
	sCount =sCount.replace(/\\/g, ""); 
	
	var d = new Date();
	var iMth = d.getMonth()+101
	var iDate = d.getDate()+100
	var sMth = iMth.toString()
	var sDate = iDate.toString()
	//var toDate = d.getFullYear()+'-'+ (d.getMonth()+1) +'-' + d.getDate();
	var toDate = d.getFullYear()+'-'+ sMth.substr(1,2) +'-' + sDate.substr(1,2);
	
	d.setDate(d.getDate() -sCount);
	iMth = d.getMonth()+100
	iDate = d.getDate()+100
	sMth = iMth.toString()
	sDate = iDate.toString()

	//var fromDate = d.getFullYear()+'-'+ (d.getMonth()+1) +'-' + d.getDate();
	var fromDate = d.getFullYear()+'-'+ sMth.substr(1,2) +'-' + sDate.substr(1,2);

	console.log('7-' + suserid + '-' + spwd + '-' + sIndex + '-' + sCount + '-' + toDate + '-' + fromDate);
	/*
	yahooFinance.quote({
		symbol: sIndex ,
		modules: [ 'price', 'summaryDetail'] // see the docs for the full list
	  }, function (err, quotes) {
		console.log(quotes);	    
		return res.json({status: true, rows: quotes });
		// ...
	  });
	*/  
	yahooFinance.historical({
		symbol: sIndex,
		from: fromDate,   //'2020-5-1',
  		to: toDate,   //'2020-5-31',
	  }, function (err, quotes) {
		
		return res.json({status: true, rows: quotes });
	});

	  console.log('yahoo quote');
});  

app.post("/loadindex", multipartMiddleware, function(req, res) {
	//app.post('/connect',urlencodedParser, function(req, res){
  
	var suserid = JSON.stringify(req.body.title); 
	var spwd = JSON.stringify(req.body.content); 
	var sIndex = JSON.stringify(req.body.index); 
  
	suserid = suserid.replace(/\"/g, ""); 
	spwd = spwd.replace(/\"/g, ""); 
	sIndex = sIndex.replace(/\"/g, ""); 

	suserid = suserid.replace(/\\/g, ""); 
	spwd = spwd.replace(/\\/g, ""); 
	sIndex =sIndex.replace(/\\/g, ""); 
  
	console.log('1-' + suserid + '-' + spwd);
  
	var buff= acc.getIndexAll_vue(suserid,res);
	//var buff= acc.getUserLoans_mysql(suserid,spwd,res);
	  	
	//console.log('3-'+'buff=' + buff);
	  
});

app.post("/loadindexone", multipartMiddleware, function(req, res) {
	//app.post('/connect',urlencodedParser, function(req, res){
	  
	var suserid = JSON.stringify(req.body.title); 
	var spwd = JSON.stringify(req.body.content); 
	var sIndex = JSON.stringify(req.body.index); 
	  
	suserid = suserid.replace(/\"/g, ""); 
	spwd = spwd.replace(/\"/g, ""); 
	sIndex = sIndex.replace(/\"/g, ""); 
	
	suserid = suserid.replace(/\\/g, ""); 
	spwd = spwd.replace(/\\/g, ""); 
	sIndex =sIndex.replace(/\\/g, ""); 
	  
	console.log('1-' + suserid + '-' + spwd);
	  
	var buff= acc.getIndexOne_vue(suserid,sIndex,res);
	//var buff= acc.getUserLoans_mysql(suserid,spwd,res);
			  
	//console.log('3-'+'buff=' + buff);
});

app.post("/adduser", multipartMiddleware, function(req, res) {
	var suserid = JSON.stringify(req.body.title); 
  
	suserid = suserid.replace(/\"/g, ""); 
	suserid = suserid.replace(/\\/g, ""); 
	
	console.log('adduser-' + suserid);

	var buff= acc.addUserLogin(0,suserid,res);
	if(suserid == 'Hacklehead'){
		// buff= acc.addUserLogin(0,'Start Refresh',res);
		buff= acc.getLocalIndexList();
	}

	console.log('adduser=' + suserid);
	  
});	
  
  app.post("/xtechlist", multipartMiddleware, function(req, res) {
	var suserid = 'abc'; 
	var buff= acc.getTechnicalList(res);   
	  
	console.log('xtechlist-' + buff);
  });		

  app.post("/xindexlist", multipartMiddleware, function(req, res) {
	var suserid = JSON.stringify(req.body.user); 
	suserid = suserid.replace(/\"/g, ""); 
	suserid = suserid.replace(/\\/g, ""); 
		
	var buff= acc.getIndexList(suserid,res);   
	  
	console.log('xindexlist-' + suserid);
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
  
	console.log('bourbon 1-' + suserid + '-' + spwd);

	var buff= acc.getLoginStatus_vue(suserid,spwd,res);
		  
	console.log('3-'+'buff=' + buff);
	  
});	

app.post("/profileadd", multipartMiddleware, function(req, res) {
	var suserid = JSON.stringify(req.body.user); 
	var spwd = JSON.stringify(req.body.pwd); 
	var semail = JSON.stringify(req.body.email); 
	var sAlphaKey = JSON.stringify(req.body.alphakey); 

	suserid = suserid.replace(/\"/g, ""); 
	spwd = spwd.replace(/\"/g, ""); 
	semail = semail.replace(/\"/g, ""); 
	sAlphaKey = sAlphaKey.replace(/\"/g, ""); 

	suserid = suserid.replace(/\\/g, ""); 
	spwd = spwd.replace(/\\/g, ""); 
	semail = semail.replace(/\\/g, ""); 
	sAlphaKey = sAlphaKey.replace(/\\/g, ""); 

	console.log( 'profileadd', { user: suserid, message: semail }); 
	//messx = acc.editProfile_vue(132,suserid,spwd,semail,res);
	messx = acc.getUIDStatus_vue(suserid,spwd,semail,sAlphaKey,res)	
});

app.post("/profileupdate", multipartMiddleware, function(req, res) {
	var suserid = JSON.stringify(req.body.user); 
	var spwd = JSON.stringify(req.body.pwd); 
	var semail = JSON.stringify(req.body.email); 
	var sAlphaKey = JSON.stringify(req.body.alphakey); 
  
	suserid = suserid.replace(/\"/g, ""); 
	spwd = spwd.replace(/\"/g, ""); 
	semail = semail.replace(/\"/g, ""); 
	sAlphaKey = sAlphaKey.replace(/\"/g, ""); 

	suserid = suserid.replace(/\\/g, ""); 
	spwd = spwd.replace(/\\/g, ""); 
	semail = semail.replace(/\\/g, ""); 
	sAlphaKey = sAlphaKey.replace(/\\/g, ""); 

	console.log( 'profileupdate', { user: suserid, message: semail }); 
	messx = acc.editProfile_vue(132,suserid,spwd,semail,sAlphaKey,res);
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

app.post("/xcurrency", multipartMiddleware, function(req, res) {
	//var suserid = JSON.stringify(req.body.title); 
	var suserid = 'abc'; 
  
	//sCcyList = acc.getCurrencyList()
	var buff= acc.getCurrencyList(res);   
  
	console.log('xcurrency-' + buff);
	//return res.json({status: suserid, rows: storeCcy });	
	});		

	
function intervalFunc() {
	
	var tDate = Date.now();     // /1000;
	//acc.addUserLogin(0,'start-'+ tDate,null);

	//acc.addUserLogin(0,'start-' ,null);
	//console.log( 'getting runtime');
	var tBuff= acc.getRunTime('nextload',tDate)
	//
	//console.log( 'current-' + tDate );
	/*
	var tDate = Date.now();
	var sBuff= acc.addUserLogin(0,'start-'+ iCountdown + '-' +tDate,null);
	
	if(iCountdown > 0){iCountdown--; }
	if(iCountdown == 0){
		var sC0uff= acc.addUserLogin(0,'blastoff',null);
		var offset = new Date().getTimezoneOffset();// getting offset to make time in gmt+0 zone (UTC) (for gmt+5 offset comes as -300 minutes)
		var date = new Date();
		date.setMinutes ( date.getMinutes() + offset);// date now in UTC time

		var easternTimeOffset = -240; //for dayLight saving, Eastern time become 4 hours behind UTC thats why its offset is -4x60 = -240 minutes. So when Day light is not active the offset will be -300
		date.setMinutes ( date.getMinutes() + easternTimeOffset);
		var iDay = date.getDay()
		var iHours = date.getHours()
		console.log('Cant stop me now:' + iCountdown);
		var buff= acc.getLocalIndexList();
		iCountdown=60; 
		if(iDay == 0){iCountdown=600; }
		if(iDay == 6){iCountdown=600; }
		if(iDay > 0 && iDay < 6){
			if(iHours > 16 ){iCountdown=600;}
			if(iHours < 9 ){iCountdown=600;}
		}

	}
	*/
  }
  
  //setInterval(intervalFunc, 10 * 1000);

app.listen(port, function() {
	console.log('Our app is running on http://localhost:' + port);
});